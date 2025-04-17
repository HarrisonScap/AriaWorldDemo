import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { Canvas, extend, useThree } from '@react-three/fiber'
import { Splat, Float, CameraControls, StatsGl, Effects, Point } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { useControls } from 'leva'

extend({ TAARenderPass, OutputPass })

function SinglePoint() {
  const { scene } = useThree()

  const material_white = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 5,
    sizeAttenuation: false,
  })

  useEffect(() => {
    const geometry = new THREE.BufferGeometry()
    const vertices = new Float32Array([0, 0, 0]) // One point at origin
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

    const dot = new THREE.Points(geometry, material_white)
    scene.add(dot)

    return () => scene.remove(dot) // cleanup
  }, [scene])

  return null
}


export default function App() {
  return (
    <Canvas camera={{ position: [4, 1.5, -4], fov: 35}}>
      <color attach="background" args={['black']} />

      {/* Display a single splat at a specific position */}
      <CameraControls makeDefault />

      {/* Requires appending of /AriaWorldDemo/ to front of any assets... */}
      {/*       This will purely work to render the splat visually        */}

      {/* <Splat src="/AriaWorldDemo/assets/bonsai-7k.splat" position={[0, 0, 0]} />  */}
      <SinglePoint />

    </Canvas>
  )
}
