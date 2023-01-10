function padStartWithZeros(value: number, totalStringSize: number) {
  return value.toString().padStart(totalStringSize, '0')
}

export function formatSecondsIntoMinutesAndSeconds(value: number) {
  const seconds = padStartWithZeros(value % 60, 2)
  const minutes = padStartWithZeros(Math.floor(value / 60), 2)
  return [minutes, seconds].join(':')
}
