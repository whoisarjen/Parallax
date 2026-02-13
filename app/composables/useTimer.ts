export function useTimer() {
  const remaining = ref(0)
  const isRunning = ref(false)
  const totalDuration = ref(0)

  let intervalId: ReturnType<typeof setInterval> | null = null

  const isExpired = computed(() => remaining.value <= 0 && totalDuration.value > 0)

  const formattedTime = computed(() => {
    const mins = Math.floor(remaining.value / 60)
    const secs = remaining.value % 60
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  })

  const progress = computed(() => {
    if (totalDuration.value === 0) return 1
    return remaining.value / totalDuration.value
  })

  function start(seconds: number) {
    stop()
    totalDuration.value = seconds
    remaining.value = seconds
    isRunning.value = true

    intervalId = setInterval(() => {
      if (remaining.value > 0) {
        remaining.value--
      } else {
        stop()
      }
    }, 1000)
  }

  function stop() {
    isRunning.value = false
    if (intervalId !== null) {
      clearInterval(intervalId)
      intervalId = null
    }
  }

  function reset() {
    stop()
    remaining.value = 0
    totalDuration.value = 0
  }

  if (import.meta.client) {
    onUnmounted(() => {
      if (intervalId !== null) {
        clearInterval(intervalId)
        intervalId = null
      }
    })
  }

  return {
    remaining: readonly(remaining),
    isRunning: readonly(isRunning),
    isExpired,
    formattedTime,
    progress,
    start,
    stop,
    reset,
  }
}
