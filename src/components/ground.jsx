import React, { useRef, useEffect } from 'react'
import Matter from 'matter-js'

const Ground = ({ x, y, width, height, color, angle, engine }) => {
  const groundRef = useRef()

  useEffect(() => {
    if (!engine) {
      return
    }
    const ground = Matter.Bodies.rectangle(x, y, width, height, { angle: angle * Math.PI / 180, isStatic: true })
    Matter.Composite.add(engine.world, [
      ground
    ])
    if (ground) {
      const { x, y } = ground.position
      groundRef.current.style.top = `${y - height / 2}px`
      groundRef.current.style.left = `${x - width / 2}px`
      groundRef.current.style.background = color
      groundRef.current.style.width = `${width}px`
      groundRef.current.style.height = `${height}px`
      groundRef.current.style.position = 'absolute'
      groundRef.current.style.transform = `rotate(${ground.angle}rad)`
    }
  }, [engine, width, height, x, y, color])

  return <div className="ground" ref={groundRef} />
}

export default Ground
