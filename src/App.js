import * as THREE from 'three'
import { useEffect, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { PlayerController } from './controller.js'
import { PointCloud } from './PointCloud.js'
import { CameraTracker } from './CameraTracker.js'

export default function App() {
  const [pointCount, setPointCount] = useState(0) // State to track the total number of points
  const [points, setPoints] = useState([]) // State to store the points
  const [soundEnabled, setSoundEnabled] = useState(false) // State to toggle sound
  const audioContext = useRef(null) // Audio context reference
  const audioSource = useRef(null) // Audio source reference
  const cameraPosition = useRef(new THREE.Vector3()) // Track camera position

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'x' || event.key === 'X') {
        setSoundEnabled((prev) => !prev) // Toggle soundEnabled state
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  useEffect(() => {
    if (!soundEnabled) return // Do nothing if sound is disabled

    const context = new (window.AudioContext || window.webkitAudioContext)()
    audioContext.current = context

    const loadAndPlaySound = async () => {
      const response = await fetch('/AriaWorldDemo/assets/pointsound.wav')
      const arrayBuffer = await response.arrayBuffer()
      const audioBuffer = await context.decodeAudioData(arrayBuffer)

      const source = context.createBufferSource()
      source.buffer = audioBuffer
      source.loop = true // Enable looping
      source.connect(context.destination)
      source.start(0)

      audioSource.current = source // Store the audio source reference
    }

    loadAndPlaySound()

    return () => {
      // Stop the audio source when the component unmounts or sound is disabled
      if (audioSource.current) {
        audioSource.current.stop()
        audioSource.current = null
      }
      if (audioContext.current) {
        audioContext.current.close()
        audioContext.current = null
      }
    }
  }, [soundEnabled]) // Re-run when soundEnabled changes

  return (
    <>
      {/* Overlay text */}
      <div style={{
        position: 'absolute',
        top: '10px',
        left: '10px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '20px',
        zIndex: 1,
      }}>
        Points in Scene: {pointCount}
      </div>

      {/* Sound Toggle */}
      <div style={{
        position: 'absolute',
        top: '50px',
        left: '10px',
        color: 'white',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '16px',
        zIndex: 1,
      }}>
        <label>
          <input
            type="checkbox"
            checked={soundEnabled}
            onChange={(e) => setSoundEnabled(e.target.checked)}
          />
          Enable Ominous Ethereral Humming (X to toggle)
        </label>
      </div>

      {/* Canvas */}
      <Canvas camera={{ position: [4, 1.5, -4], fov: 35 }}>
        <color attach="background" args={['black']} />
        <PointerLockControls />
        <PlayerController />
        <PointCloud setPointCount={setPointCount} setPoints={setPoints} />
        <CameraTracker cameraPosition={cameraPosition} />
      </Canvas>
    </>
  )
}