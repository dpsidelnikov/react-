import React, { useRef, useEffect } from 'react'
import anime from 'animejs'
import Matter from 'matter-js'

// Create a box component
const Box = ({ text, x, y, width, height, color, engine }) => {
  // Create a reference to the box
  const boxRef = useRef()
  const progress = { value: 1 }
  let startBounds
  let currentBounds = width

  let box

  const enterButton = () => {
    anime({
      targets: progress,
      value: 1.2,
      duration: 2000,
      easing: 'easeOutElastic(1, .6)',
      update: () => {
        const desiredSize = startBounds[0] * progress.value
        const ratio = (desiredSize / currentBounds)
        Matter.Body.scale(box, ratio, ratio)
        currentBounds *= ratio
      }
    })
  }

  const leaveButton = () => {
    anime({
      targets: progress,
      value: 1,
      duration: 2000,
      easing: 'easeOutElastic(1, .6)',
      update: () => {
        const desiredSize = startBounds[0] * progress.value
        const ratio = (desiredSize / currentBounds)
        Matter.Body.scale(box, ratio, ratio)
        currentBounds *= ratio
      }
    })
  }

  // Create an effect that runs the code on every render
  useEffect(() => {
    // Create a Matter Body if the engine exists
    if (!engine) {
      return
    }
    // Create a Matter Body
    box = Matter.Bodies.rectangle(x, y, width, height, { chamfer: { radius: height / 2 } })
    startBounds = [box.bounds.max.x - box.bounds.min.x, box.bounds.max.y - box.bounds.min.y]

    // Add the body to the world
    Matter.Composite.add(engine.world, [
      box
    ])
    // Update the boxRef's current style to the Matter Body's position
    const update = () => {
      // If there are no moving bodies, stop the engine
      // Check if any bodies are moving
      const movingBodies = engine.world.bodies.filter(body => body.speed > 0)
      if (movingBodies.length === 0) {
        // window.location.reload()
        Matter.Engine.clear(engine)
        return
      }

      // Destructure the position from the box
      const { x, y } = box.position

      // Destructure the width and height from the box

      // console.log(engine.world.bodies.filter(body => body.speed > 0).length)
      // If the box is off the screen, remove it from the world
      if (y > window.innerHeight) {
        Matter.Composite.remove(engine.world, box)
        return
      }

      // Update the boxRef's style
      boxRef.current.style.top = `${y - height / 2}px`
      boxRef.current.style.left = `${x - width / 2}px`
      boxRef.current.style.background = color
      boxRef.current.style.width = `${width}px`
      boxRef.current.style.height = `${height}px`
      boxRef.current.style.position = 'absolute'
      boxRef.current.style.transform = `scale(${progress.value}) rotate(${box.angle}rad)`
    }
    // Run the update function once to set the initial style
    Matter.Events.on(engine, 'afterUpdate', update)
    // Remove event listener to prevent memory leak
    return () => {
      Matter.Events.off(engine, 'afterUpdate', update)
    }
  },
  // Run the effect if the engine changes or if the boxRef changes
  [engine, width, height, x, y, color])
  // Render the box
  return <div onMouseEnter={enterButton} onMouseLeave={leaveButton}className='box' ref={boxRef}>{text}</div>
}

export default Box
