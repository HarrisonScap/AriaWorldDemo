import * as THREE from 'three'
import { useEffect, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { PlayerController } from './controller.js'
import { PointCloud } from './PointCloud.js'
import { CameraTracker } from './CameraTracker.js'
import { useLoopingSound } from './sound.js' // Import the sound logic

export default function App() {
  const [pointCount, setPointCount] = useState(0) // State to track the total number of points
  const [points, setPoints] = useState([]) // State to store the points
  const [loading, setLoading] = useState(true) // State to track loading status
  const cameraPosition = useRef(new THREE.Vector3()) // Track camera position
  const [soundEnabled, setSoundEnabled] = useState(false) // State to toggle sound
  const [activeCloud, setActiveCloud] = useState('xyz') // State to track the active point cloud

  // Determine the sound file based on the active cloud
  const soundFile = activeCloud === 'ply' 
    ? '/AriaWorldDemo/assets/pointsound2.wav' 
    : '/AriaWorldDemo/assets/pointsound.wav'

  // ########################### Sound stuff ############################  //
  useLoopingSound(soundEnabled, soundFile)

  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'x' || event.key === 'X') {
        setSoundEnabled((prev) => !prev) // Toggle soundEnabled state
      }
      if (event.key === 'ArrowRight') {
        setActiveCloud((prev) => (prev === 'xyz' ? 'ply' : 'xyz')) // Toggle between 'xyz' and 'ply'
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])
  // #####################################################################  //

  // Map activeCloud to display names
  const cloudNames = {
    xyz: 'loc5_script4_seq6_rec1\n(Aria Everyday Activities Dataset)', // Replace with the actual name for the XYZ cloud
    ply: 'Apartment_release_golden_skeleton_seq100_10s_sample_M1292\n(Aria Twin Dataset)', // Replace with the actual name for the PLY cloud
  }

  return (
    <>
      {/* Loading overlay */}
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            color: 'white',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            padding: '10px 20px',
            borderRadius: '10px',
            fontFamily: 'Arial, sans-serif',
            fontSize: '24px',
            zIndex: 2,
          }}
        >
          Loading...
        </div>
      )}

      {/* Overlay text for point count */}
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

      {/* Overlay text for active cloud */}
      <div style={{
        position: 'absolute',
        top: '10px',
        right: '10px',
        color: 'gold',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        padding: '5px',
        borderRadius: '5px',
        fontFamily: 'Arial, sans-serif',
        fontSize: '15px',
        zIndex: 1,
      }}>
        {cloudNames[activeCloud]}
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
          Enable Sound (X to toggle)
          <br/>
          Right Arrow to Swap Point Cloud
        </label>
      </div>

      {/* Canvas */}
      <Canvas camera={{ position: [4, 1.5, -4], fov: 35 }}>
        {/* Conditionally set the background color */}
        <color attach="background" args={[activeCloud === 'ply' ? 'skyblue' : 'black']} />
        <PointerLockControls />
        <PlayerController />
        <PointCloud setPointCount={setPointCount} setPoints={setPoints} activeCloud={activeCloud} setLoading={setLoading} />
        <CameraTracker cameraPosition={cameraPosition} />
      </Canvas>
    </>
  )
}