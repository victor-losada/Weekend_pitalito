'use client'

import { useEffect, useRef } from 'react'

export function Hero3D() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    // Configurar canvas
    const resize = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    window.addEventListener('resize', resize)
    
    // Partículas de brillo/humo
    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      size: number
      color: string
    }> = []
    
    const colors = [
      'rgba(200, 120, 60, 0.6)',
      'rgba(180, 100, 40, 0.5)',
      'rgba(220, 140, 80, 0.4)',
      'rgba(255, 180, 100, 0.3)',
    ]
    
    let rotation = 0
    let time = 0
    
    function createParticle() {
      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2
      
      particles.push({
        x: centerX + (Math.random() - 0.5) * 100,
        y: centerY + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -Math.random() * 1 - 0.5,
        life: 0,
        maxLife: 100 + Math.random() * 50,
        size: Math.random() * 6 + 2,
        color: colors[Math.floor(Math.random() * colors.length)]
      })
    }
    
    function drawLechon(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, rotation: number) {
      ctx.save()
      ctx.translate(centerX, centerY)
      
      // Efecto 3D con perspectiva
      const perspective = Math.sin(rotation) * 0.3
      ctx.scale(1 + perspective * 0.1, 1)
      
      // Sombra
      ctx.shadowColor = 'rgba(100, 60, 30, 0.4)'
      ctx.shadowBlur = 40
      ctx.shadowOffsetY = 20
      
      // Cuerpo principal del lechón
      const gradient = ctx.createRadialGradient(0, -20, 10, 0, 0, 120)
      gradient.addColorStop(0, '#D4A574')
      gradient.addColorStop(0.3, '#B8865C')
      gradient.addColorStop(0.6, '#8B6914')
      gradient.addColorStop(1, '#6B4423')
      
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.ellipse(0, 0, 120, 70, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Textura de piel dorada
      const skinGradient = ctx.createLinearGradient(-120, -70, 120, 70)
      skinGradient.addColorStop(0, 'rgba(255, 200, 120, 0.3)')
      skinGradient.addColorStop(0.5, 'rgba(180, 120, 60, 0.1)')
      skinGradient.addColorStop(1, 'rgba(255, 180, 100, 0.2)')
      
      ctx.fillStyle = skinGradient
      ctx.beginPath()
      ctx.ellipse(0, 0, 120, 70, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Cabeza
      ctx.shadowBlur = 20
      const headGradient = ctx.createRadialGradient(-90, -10, 5, -100, 0, 50)
      headGradient.addColorStop(0, '#C4956A')
      headGradient.addColorStop(1, '#7A5030')
      
      ctx.fillStyle = headGradient
      ctx.beginPath()
      ctx.ellipse(-100, 0, 45, 40, 0.2, 0, Math.PI * 2)
      ctx.fill()
      
      // Orejas
      ctx.fillStyle = '#9A7050'
      ctx.beginPath()
      ctx.ellipse(-115, -35, 18, 12, -0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(-85, -35, 18, 12, 0.5, 0, Math.PI * 2)
      ctx.fill()
      
      // Hocico
      ctx.fillStyle = '#A8805A'
      ctx.beginPath()
      ctx.ellipse(-135, 5, 20, 15, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Ojitos (cerrados, feliz)
      ctx.strokeStyle = '#4A3020'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(-110, -8, 5, 0.2, Math.PI - 0.2)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(-90, -8, 5, 0.2, Math.PI - 0.2)
      ctx.stroke()
      
      // Nariz
      ctx.fillStyle = '#5A4030'
      ctx.beginPath()
      ctx.ellipse(-140, 2, 4, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(-140, 8, 4, 3, 0, 0, Math.PI * 2)
      ctx.fill()
      
      // Colita
      ctx.strokeStyle = '#8A6040'
      ctx.lineWidth = 6
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(115, 0)
      const tailWave = Math.sin(time * 0.05) * 5
      ctx.quadraticCurveTo(130, -15 + tailWave, 125, -30 + tailWave)
      ctx.quadraticCurveTo(135, -35 + tailWave, 130, -25 + tailWave)
      ctx.stroke()
      
      // Patas delanteras
      ctx.fillStyle = '#9A7050'
      ctx.beginPath()
      ctx.ellipse(-60, 55, 12, 20, 0.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(-30, 58, 12, 18, -0.2, 0, Math.PI * 2)
      ctx.fill()
      
      // Patas traseras
      ctx.beginPath()
      ctx.ellipse(50, 55, 12, 20, -0.2, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(80, 52, 12, 18, 0.2, 0, Math.PI * 2)
      ctx.fill()
      
      // Brillo especular
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)'
      ctx.beginPath()
      ctx.ellipse(-20, -40, 60, 20, -0.2, 0, Math.PI * 2)
      ctx.fill()
      
      // Líneas de textura
      ctx.strokeStyle = 'rgba(100, 60, 30, 0.2)'
      ctx.lineWidth = 1
      for (let i = 0; i < 5; i++) {
        ctx.beginPath()
        ctx.moveTo(-80 + i * 35, -50)
        ctx.quadraticCurveTo(-60 + i * 35, 0, -80 + i * 35, 50)
        ctx.stroke()
      }
      
      ctx.restore()
    }
    
    function animate() {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)
      
      const centerX = canvas.offsetWidth / 2
      const centerY = canvas.offsetHeight / 2
      
      // Crear partículas periódicamente
      if (Math.random() < 0.15) {
        createParticle()
      }
      
      // Dibujar y actualizar partículas
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life++
        
        const opacity = 1 - (p.life / p.maxLife)
        ctx.fillStyle = p.color.replace(/[\d.]+\)$/, `${opacity})`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * opacity, 0, Math.PI * 2)
        ctx.fill()
        
        if (p.life >= p.maxLife) {
          particles.splice(i, 1)
        }
      }
      
      // Glow detrás del lechón
      const glowGradient = ctx.createRadialGradient(
        centerX, centerY, 0,
        centerX, centerY, 180
      )
      glowGradient.addColorStop(0, 'rgba(200, 120, 60, 0.3)')
      glowGradient.addColorStop(0.5, 'rgba(180, 100, 40, 0.15)')
      glowGradient.addColorStop(1, 'rgba(180, 100, 40, 0)')
      
      ctx.fillStyle = glowGradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, 180, 0, Math.PI * 2)
      ctx.fill()
      
      // Dibujar lechón con rotación
      rotation += 0.02
      time++
      
      // Efecto de flotación
      const floatY = Math.sin(time * 0.03) * 8
      
      drawLechon(ctx, centerX, centerY + floatY, rotation)
      
      requestAnimationFrame(animate)
    }
    
    animate()
    
    return () => {
      window.removeEventListener('resize', resize)
    }
  }, [])
  
  return (
    <canvas 
      ref={canvasRef}
      className="w-[200px] h-[100px] md:w-[250px] md:h-[120px] opacity-60"
    />
  )
}
