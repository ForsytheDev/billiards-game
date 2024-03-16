import React from 'react'

import { Preferences } from '../Preferences'

type BallType = {
  id: number
  x: number
  y: number
  vx: number
  vy: number
  mass: number
  radius: number
  color: string
}

export const Canvas: React.FC = () => {
  const [selectedBallId, setSelectedBallId] = React.useState<number | null>(null)
  const [currentVelocity, setCurrentVelocity] = React.useState<{ vx: number; vy: number } | null>(
    null
  )
  const [offset, setOffset] = React.useState<{ offsetX: number; offsetY: number } | null>(null)
  const [balls, setBalls] = React.useState<BallType[]>([
    { id: 1, x: 600, y: 300, vx: 0, vy: 0, mass: 0, radius: 22, color: '#FFFFFF' },
    { id: 2, x: 200, y: 100, vx: 0, vy: 0, mass: 0, radius: 30, color: '#FF0000' },
    { id: 3, x: 800, y: 100, vx: 0, vy: 0, mass: 0, radius: 25, color: '#FFFF00' },
    { id: 4, x: 400, y: 400, vx: 0, vy: 0, mass: 0, radius: 24, color: '#0000FF' },
    { id: 5, x: 1000, y: 400, vx: 0, vy: 0, mass: 0, radius: 30, color: '#FFA500' },
    { id: 6, x: 200, y: 500, vx: 0, vy: 0, mass: 0, radius: 20, color: '#FF69B4' },
    { id: 7, x: 800, y: 500, vx: 0, vy: 0, mass: 0, radius: 24, color: '#008000' },
    { id: 8, x: 400, y: 200, vx: 0, vy: 0, mass: 0, radius: 30, color: '#8B4513' },
    { id: 9, x: 1000, y: 200, vx: 0, vy: 0, mass: 0, radius: 30, color: '#9400D3' },
    { id: 10, x: 600, y: 50, vx: 0, vy: 0, mass: 0, radius: 26, color: '#DC143C' },
    { id: 11, x: 200, y: 300, vx: 0, vy: 0, mass: 0, radius: 28, color: '#FF4500' },
    { id: 12, x: 800, y: 300, vx: 0, vy: 0, mass: 0, radius: 20, color: '#800080' },
    { id: 13, x: 400, y: 500, vx: 0, vy: 0, mass: 0, radius: 30, color: '#00FFFF' },
    { id: 14, x: 1000, y: 500, vx: 0, vy: 0, mass: 0, radius: 26, color: '#000000' },
  ])

  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  // Отрисовка поля Canvas
  const drawCanvas = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = '#0a6557'
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)

    balls.forEach((ball) => {
      ctx.beginPath()
      ctx.fillStyle = ball.color
      ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
      ctx.fill()
    })
  }

  // Обновление цвета шара
  const updateBallColor = (ballId: number, color: string) => {
    const updatedBalls = balls.map((ball) => (ball.id === ballId ? { ...ball, color } : ball))
    setBalls(updatedBalls)
  }

  // Обработка клика по полю - вызов меню для настройки цвета
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const offsetX = event.clientX - rect.left
    const offsetY = event.clientY - rect.top

    balls.forEach((ball) => {
      const dx = offsetX - ball.x
      const dy = offsetY - ball.y
      const distance = Math.sqrt(dx * dx + dy * dy)
      if (distance <= ball.radius) {
        setSelectedBallId(ball.id)
      }
    })
  }

  // Обработка коллизий
  const handleCollisions = (ballsToUpdate: BallType[]) => {
    const updatedBalls = ballsToUpdate.map((ball) => ({ ...ball }))

    updatedBalls.forEach((ball) => {
      // Проверяем столкновения со стенками
      if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvasRef.current!.width) {
        ball.vx *= -1
      }
      if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvasRef.current!.height) {
        ball.vy *= -1
      }

      // Проверяем столкновения между шарами
      updatedBalls.forEach((otherBall) => {
        if (ball.id !== otherBall.id) {
          const dx = otherBall.x - ball.x
          const dy = otherBall.y - ball.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance <= ball.radius + otherBall.radius) {
            // Рассчитываем новые скорости шаров после столкновения (упругий удар)
            const angle = Math.atan2(dy, dx)
            const sin = Math.sin(angle)
            const cos = Math.cos(angle)

            // Преобразуем скорости в систему координат, связанную со столкновением
            const vx1 = ball.vx * cos + ball.vy * sin
            const vy1 = ball.vy * cos - ball.vx * sin
            const vx2 = otherBall.vx * cos + otherBall.vy * sin
            const vy2 = otherBall.vy * cos - otherBall.vx * sin

            // Рассчитываем новые скорости шаров после столкновения (упругий удар)
            const vx1Final =
              ((ball.mass - otherBall.mass) * vx1 + 2 * otherBall.mass * vx2) /
              (ball.mass + otherBall.mass)
            const vx2Final =
              ((otherBall.mass - ball.mass) * vx2 + 2 * ball.mass * vx1) /
              (ball.mass + otherBall.mass)

            // Преобразуем скорости обратно в исходную систему координат
            ball.vx = vx1Final * cos - vy1 * sin
            ball.vy = vy1 * cos + vx1Final * sin
            otherBall.vx = vx2Final * cos - vy2 * sin
            otherBall.vy = vy2 * cos + vx2Final * sin

            // Обновляем координаты шаров после столкновения
            const overlap = ball.radius + otherBall.radius - distance
            const moveX = overlap * Math.cos(angle)
            const moveY = overlap * Math.sin(angle)
            ball.x -= moveX
            ball.y -= moveY
            otherBall.x += moveX
            otherBall.y += moveY
          }
        }
      })
    })

    return updatedBalls
  }

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (canvas) {
      const ctx = canvas.getContext('2d')
      if (ctx) {
        drawCanvas(ctx)

        const handleMouseDown = (event: MouseEvent) => {
          const { offsetX, offsetY } = event
          for (const ball of balls) {
            const dx = offsetX - ball.x
            const dy = offsetY - ball.y
            if (Math.sqrt(dx * dx + dy * dy) <= ball.radius) {
              setSelectedBallId(ball.id)
              setOffset({ offsetX: dx, offsetY: dy })
              setCurrentVelocity({ vx: 0, vy: 0 })
              break
            }
          }
        }

        const handleMouseMove = (event: MouseEvent) => {
          if (selectedBallId !== null && offset !== null) {
            const { offsetX, offsetY } = offset
            let newX = event.offsetX - offsetX
            let newY = event.offsetY - offsetY

            // Проверяем, не выходит ли шар за границы игрового поля
            if (newX < 0 + balls[selectedBallId - 1].radius) {
              newX = balls[selectedBallId - 1].radius
            } else if (newX > canvasRef.current!.width - balls[selectedBallId - 1].radius) {
              newX = canvasRef.current!.width - balls[selectedBallId - 1].radius
            }

            if (newY < 0 + balls[selectedBallId - 1].radius) {
              newY = balls[selectedBallId - 1].radius
            } else if (newY > canvasRef.current!.height - balls[selectedBallId - 1].radius) {
              newY = canvasRef.current!.height - balls[selectedBallId - 1].radius
            }

            const updatedBalls = balls.map((ball) =>
              ball.id === selectedBallId ? { ...ball, x: newX, y: newY } : ball
            )
            const updatedBallsAfterCollision = handleCollisions(updatedBalls)
            setBalls(updatedBallsAfterCollision)
            drawCanvas(ctx)
          }
        }

        const handleMouseUp = () => {
          if (selectedBallId !== null && offset !== null && currentVelocity !== null) {
            const { vx, vy } = currentVelocity
            const updatedBalls = balls.map((ball) =>
              ball.id === selectedBallId ? { ...ball, vx, vy } : ball
            )
            setBalls(updatedBalls)
          }
          setSelectedBallId(null)
          setOffset(null)
          setCurrentVelocity(null)
        }

        if (canvas) {
          canvas.addEventListener('mousedown', handleMouseDown)
          canvas.addEventListener('mousemove', handleMouseMove)
          canvas.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
          if (canvas) {
            canvas.removeEventListener('mousedown', handleMouseDown)
            canvas.removeEventListener('mousemove', handleMouseMove)
            canvas.removeEventListener('mouseup', handleMouseUp)
          }
        }
      }
    }
  }, [balls, selectedBallId, offset, currentVelocity])

  return (
    <div className="flex items-center justify-center rounded-3xl overflow-hidden">
      <canvas ref={canvasRef} width={1200} height={600} onClick={handleCanvasClick} />
      {selectedBallId !== null && <Preferences ball={selectedBallId} setColor={updateBallColor} />}
    </div>
  )
}
