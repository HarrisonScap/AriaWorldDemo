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

  useEffect(() => {
    const group = new THREE.Group() // Create a group to hold the points
    group.scale.set(0.1, 0.1, 0.1)  // Scale the entire group down

    const geometry = new THREE.BufferGeometry()
    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 5,
      sizeAttenuation: false,
    })

    fetch('/AriaWorldDemo/xyz.txt')
      .then((response) => response.text())
      .then((data) => {
        const lines = data.split('\n')
        const vertices = []
        const colors = []

        lines.forEach((line) => {
          const parts = line.trim().split(/\s+/)
          if (parts.length === 5) {
            const [x, y, z, inv_dist_std, dist_std] = parts.map(Number)

            vertices.push(x, y, -z) // No need to scale here anymore

            // Map dist_std to alpha (transparency)
            const clampedStd = Math.min(Math.max(dist_std, 0), 0.2)
            const alpha = 1.0 - clampedStd / 0.2
            colors.push(1, 1, 1, alpha)
          }
        })

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4))

        const points = new THREE.Points(geometry, material)
        group.add(points)        // Add points to the group
        scene.add(group)         // Add the group to the scene
      })

    return () => scene.clear()
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
