import * as THREE from 'three'
import { useEffect, useState } from 'react' // Add useState to track the number of points
import { Canvas, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { PlayerController } from './controller.js'


export function PointCloud({ setPointCount }) {
  const { scene } = useThree()

  useEffect(() => {
    const group = new THREE.Group()
    group.scale.set(0.1, 0.1, 0.1)
    group.rotation.x = Math.PI / 2

    const geometry = new THREE.BufferGeometry()
    const material = new THREE.PointsMaterial({
      vertexColors: true,
      size: 0.001,
      sizeAttenuation: true,
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
            const [x, y, z] = parts.map(Number)
            vertices.push(x, y, -z)
            colors.push(1, 1, 1, 1)
          }
        })

        geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
        geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 4))

        const points = new THREE.Points(geometry, material)
        group.add(points)
        scene.add(group)

        // Update the point count
        setPointCount(vertices.length / 3) // Divide by 3 because each point has x, y, z
      })

    return () => scene.clear()
  }, [scene, setPointCount])

  return null
}