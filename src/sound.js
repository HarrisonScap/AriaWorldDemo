import { useRef, useEffect, useState } from 'react'

export async function playSoundWithPitch(audioContext, url, playbackRate) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer)

  return new Promise((resolve) => {
    const source = audioContext.createBufferSource()
    source.buffer = audioBuffer
    source.playbackRate.value = playbackRate // Adjust pitch
    source.connect(audioContext.destination)

    source.onended = resolve // Resolve the promise when the sound finishes
    source.start()
  })
}

export async function preloadAudio(context, url) {
  const response = await fetch(url)
  const arrayBuffer = await response.arrayBuffer()
  return context.decodeAudioData(arrayBuffer) // Decode and return the audio buffer
}

export function useLoopingSound(soundEnabled, audioBuffers, activeSound) {
  const audioContext = useRef(null) // Audio context reference
  const audioSource = useRef(null) // Audio source reference
  const gainNode = useRef(null) // Gain node reference for volume control

  useEffect(() => {
    if (!soundEnabled || !audioBuffers[activeSound]) return // Do nothing if sound is disabled or buffer is missing

    const context = new (window.AudioContext || window.webkitAudioContext)()
    audioContext.current = context

    const playSound = () => {
      const source = context.createBufferSource()
      const gain = context.createGain() // Create a GainNode for volume control
      gain.gain.value = 0.1 // Set volume to 10% (0.1)

      source.buffer = audioBuffers[activeSound] // Use the preloaded audio buffer
      source.loop = true // Enable looping
      source.connect(gain) // Connect the source to the GainNode
      gain.connect(context.destination) // Connect the GainNode to the destination
      source.start(0)

      audioSource.current = source // Store the audio source reference
      gainNode.current = gain // Store the GainNode reference
    }

    playSound()

    return () => {
      // Stop the audio source and clean up when the component unmounts or sound is disabled
      if (audioSource.current) {
        audioSource.current.stop()
        audioSource.current = null
      }
      if (gainNode.current) {
        gainNode.current.disconnect()
        gainNode.current = null
      }
      if (audioContext.current) {
        audioContext.current.close()
        audioContext.current = null
      }
    }
  }, [soundEnabled, audioBuffers, activeSound]) // Re-run when soundEnabled, audioBuffers, or activeSound changes
}