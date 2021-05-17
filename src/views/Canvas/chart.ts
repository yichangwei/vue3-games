export type CanvasRefType = HTMLCanvasElement | null

export function renderSolarSystem(canvas: CanvasRefType) {
  if (!canvas) return
  const { clientWidth: w, clientHeight: h } = canvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const draw = () => {
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    const t = new Date()
    const s = t.getSeconds()
    const ms = t.getMilliseconds()
    const PI = Math.PI
    const r = w / 100 // 切分成100份
    const sunRadius = r * 10
    const earthOrbitRadius = r * 36
    const earthRadius = r * 2
    const moonOrbitRadius = r * 10
    const moonRadius = r * 1
    // 清除并存储状态
    ctx.clearRect(0, 0, w, h)
    ctx.fillStyle = '#03a9f4'
    ctx.strokeStyle = '#f6c0ff'
    ctx.save()
    // 确定中心点
    ctx.translate(w / 2, h / 2)
    // sun
    ctx.beginPath()
    ctx.arc(0, 0, sunRadius, 0, PI * 2)
    ctx.fill()
    // earth orbit
    ctx.beginPath()
    ctx.arc(0, 0, earthOrbitRadius, 0, PI * 2)
    ctx.stroke()
    ctx.rotate(2 * (PI / 60) * (s + ms / 1000))
    // earth
    ctx.translate(earthOrbitRadius, 0)
    ctx.save()
    ctx.rotate(2 * (PI / 6) * (s + ms / 1000))
    ctx.translate(- earthRadius, - earthRadius)
    ctx.fillRect(0, 0, earthRadius * 2, earthRadius * 2)
    ctx.restore()
    // moon orbit
    ctx.beginPath()
    ctx.arc(0, 0, moonOrbitRadius, 0, PI * 2)
    ctx.stroke()
    // moon
    ctx.rotate(2 * (PI / 12) * (s + ms / 1000))
    ctx.translate(moonOrbitRadius, 0)
    ctx.beginPath()
    ctx.moveTo(- moonRadius, 0)
    ctx.lineTo(moonRadius, - moonRadius / 1.5)
    ctx.lineTo(moonRadius, moonRadius / 1.5)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
    requestAnimationFrame(draw)
  }
  draw()
}

export function renderOclock(canvas: CanvasRefType) {
  if (!canvas) return
  const { clientWidth: w, clientHeight: h } = canvas
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  /**
   * 绘制表盘
   * @param r 基础半径（画布宽度/100）
   */
  const drawDial = (r: number) => {
    const PI = Math.PI
    const dialRadius = r * 45
    ctx.save()
    ctx.fillStyle = '#800080'
    ctx.strokeStyle = '#800080'
    // 绘制外圆
    ctx.beginPath()
    ctx.arc(0, 0, dialRadius, 0, PI * 2)
    ctx.stroke()
    // 绘制圆心
    ctx.beginPath()
    ctx.arc(0, 0, r * 2, 0, PI * 2)
    ctx.fill()

    // 绘制刻度
    for(let i = 1; i <= 60; i++) {
      const scaleLength = i % 5 ? r * 2 : r * 4
      ctx.save()
      ctx.lineWidth = i % 5 ? 1 : 2
      ctx.rotate(- PI / 2 + i * (PI / 30))
      ctx.beginPath()
      ctx.moveTo(dialRadius, 0)
      ctx.lineTo(dialRadius - scaleLength, 0)
      ctx.stroke()
      ctx.restore()
    }

    ctx.restore()
  }

  /**
   * 绘制时间指针
   * @param handLen 指针长度
   * @param color 指针颜色
   * @param rotate 指针旋转角度
   */
  const drawHand = (handLen: number, color: string, rotate: number) => {
    ctx.save()
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.strokeStyle = color
    ctx.rotate(- Math.PI / 2 + rotate)
    ctx.beginPath()
    ctx.moveTo(0, 0)
    ctx.lineTo(handLen, 0)
    ctx.stroke()
    ctx.restore()
  }

  const draw = () => {
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w
      canvas.height = h
    }
    const r = w / 100
    const PI = Math.PI
    ctx.clearRect(0, 0, w, h)
    ctx.save()
    ctx.translate(w / 2, h / 2)
    drawDial(r)
    // 绘制所有时针
    const t = new Date()
    const sec = t.getSeconds()
    const min = t.getMinutes()
    const hour = t.getHours()

    const sr = (PI / 30) * sec
    const mr = (PI / 30) * min + sr / 60
    const hr = (PI / 6) * hour + mr / 12

    drawHand(r * 38, '#9a27b0', sr)
    drawHand(r * 30, '#03a9f4', mr)
    drawHand(r * 22, '#ff05ff', hr)

    ctx.restore()
    requestAnimationFrame(draw)
  }
  draw()
}
