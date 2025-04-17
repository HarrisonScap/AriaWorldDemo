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