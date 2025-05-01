import * as THREE from 'three'
import { useEffect, useState } from 'react'
import { useThree } from '@react-three/fiber'

export function PointCloud({ setPointCount, activeCloud, setLoading }) {
  const { scene } = useThree()
  const [xyzData, setXyzData] = useState(null) // Preloaded XYZ data
  const [plyData, setPlyData] = useState(null) // Preloaded PLY data

  // Preload point cloud data
  useEffect(() => {
    const preloadData = async () => {
      setLoading(true) // Start loading
      const xyzResponse = await fetch('/AriaWorldDemo/xyz.txt')
      const xyzText = await xyzResponse.text()
      setXyzData(xyzText)

      const plyResponse = await fetch('/AriaWorldDemo/colored_cloud_frame1.ply')
      const plyText = await plyResponse.text()
      setPlyData(plyText)
      setLoading(false) // Finish loading
    }

    preloadData()
  }, [setLoading])

  useEffect(() => {
    const groupXYZ = new THREE.Group()
    const groupPLY = new THREE.Group()

    groupXYZ.scale.set(0.1, 0.1, 0.1)
    groupXYZ.rotation.x = Math.PI / 2

    groupPLY.scale.set(0.1, 0.1, 0.1)
    groupPLY.rotation.y = Math.PI / 2

    // Load the XYZ point cloud
    if (activeCloud === 'xyz' && xyzData) {
      const lines = xyzData.split('\n')
      const vertices = []
      const colors = []

      lines.forEach((line) => {
        const parts = line.trim().split(/\s+/)
        if (parts.length === 5) {
          const [x, y, z] = parts.map(Number)
          vertices.push(x, y, -z)
          colors.push(1, 1, 1) // Set all points to white
        }
      })

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

      const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.001,
        sizeAttenuation: true,
      })

      const points = new THREE.Points(geometry, material)
      groupXYZ.add(points)

      // Update the point count
      setPointCount(vertices.length / 3) // Divide by 3 because each point has x, y, z

      scene.add(groupXYZ)
    }

    // Load the PLY point cloud
    if (activeCloud === 'ply' && plyData) {
      const lines = plyData.split('\n')
      const vertices = []
      const colors = []
      let isHeader = true

      lines.forEach((line) => {
        if (isHeader) {
          if (line.trim() === 'end_header') {
            isHeader = false
          }
          return
        }

        const parts = line.trim().split(/\s+/)
        if (parts.length === 6) {
          const [x, y, z, r, g, b] = parts.map(Number)
          vertices.push(x, y, z)
          colors.push(r / 255, g / 255, b / 255) // Normalize RGB values to [0, 1]
        }
      })

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3))
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3))

      const material = new THREE.PointsMaterial({
        vertexColors: true,
        size: 0.01,
        sizeAttenuation: true,
      })

      const points = new THREE.Points(geometry, material)
      groupPLY.add(points)

      // Update the point count
      setPointCount(vertices.length / 3) // Divide by 3 because each point has x, y, z
      groupPLY.scale.set(0.2, 0.2, 0.2)
      groupPLY.position.set(-0.5, -0.5, -0.1)

      scene.add(groupPLY)
    }

    return () => {
      scene.remove(groupXYZ)
      scene.remove(groupPLY)
    }
  }, [scene, setPointCount, activeCloud, xyzData, plyData])

  return null
}
