import { useFrame } from '@react-three/fiber'

export function CameraTracker({ cameraPosition }) {
  useFrame(({ camera }) => {
    cameraPosition.current.copy(camera.position) // Update the camera position
  })

  return null
}