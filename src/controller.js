import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PointerLockControls } from '@react-three/drei'
import { useRef, useState, useEffect } from 'react'

export function PlayerController() {
  const { camera } = useThree()
  const velocity = useRef(new THREE.Vector3())
  const direction = useRef(new THREE.Vector3())
  const keys = useRef({})
  var speed = 1

  useEffect(() => {
    const handleKeyDown = (e) => (keys.current[e.code] = true)
    const handleKeyUp = (e) => (keys.current[e.code] = false)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useFrame((_, delta) => {
    direction.current.set(0, 0, 0)

    if (keys.current['KeyW']) direction.current.z -= 1
    if (keys.current['KeyS']) direction.current.z += 1
    if (keys.current['KeyA']) direction.current.x -= 1
    if (keys.current['KeyD']) direction.current.x += 1

    // Speed
    if (keys.current['ShiftLeft']) {
        speed = 3
    }else {
        speed = 1
    }

    direction.current.normalize()
    direction.current.applyEuler(camera.rotation)

    velocity.current.copy(direction.current).multiplyScalar(speed * delta)
    camera.position.add(velocity.current)
  })

  return null
}