import React, { useEffect, useRef } from 'react'

export function DotScreenShader({ 
  dotColor = '#000000', 
  bgColor = '#ffffff', 
  dotOpacity = 0.1,
  dotSize = 1.5 
}) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      if (!rect) return
      
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      ctx.clearRect(0, 0, rect.width, rect.height)
      
      // Draw background
      ctx.fillStyle = bgColor
      ctx.fillRect(0, 0, rect.width, rect.height)
      
      // Draw dots in a grid pattern
      const spacing = 15
      ctx.fillStyle = dotColor
      ctx.globalAlpha = dotOpacity
      
      for (let x = 0; x < rect.width; x += spacing) {
        for (let y = 0; y < rect.height; y += spacing) {
          ctx.beginPath()
          ctx.arc(x, y, dotSize, 0, Math.PI * 2)
          ctx.fill()
        }
      }
      
      ctx.globalAlpha = 1
    }

    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [dotColor, bgColor, dotOpacity, dotSize])

  return (
    <canvas
      ref={canvasRef}
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100%',
        height: '100%',
        display: 'block'
      }}
    />
  )
}
