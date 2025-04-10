import * as THREE from 'three'
import { useRef, useEffect } from 'react'
import { Canvas, extend, useThree } from '@react-three/fiber'
import { Splat, Float, CameraControls, StatsGl, Effects, Gltf } from '@react-three/drei'
import { Physics, RigidBody, CuboidCollider, BallCollider } from '@react-three/rapier'
import { TAARenderPass } from 'three/examples/jsm/postprocessing/TAARenderPass'
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass'
import { useControls } from 'leva'

extend({ TAARenderPass, OutputPass })

export default function App() {
  return (
    <Canvas camera={{ position: [4, 1.5, -4], fov: 35 }}>
      <color attach="background" args={['white']} />

      <CameraControls makeDefault />

      {/* Requires appending of /AriaWorldDemo/ to front of any assets... */}
      <Splat src="/AriaWorldDemo/assets/bonsai-7k.splat" position={[0, 0, 0]} /> 

    </Canvas>
  )
}
