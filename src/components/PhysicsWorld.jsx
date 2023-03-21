import React, { useLayoutEffect, useState } from 'react'
import Matter from 'matter-js'

const randomColor = () => {
  const letters = '0123456789ABCDEF'
  let color = '#'
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)]
  }
  return color
}

const getRotation = (style) => {
  const transform = style.transform
  if (transform && transform.startsWith('matrix')) {
    const matrixValues = transform
      .slice(7, -1)
      .split(', ')
      .map(parseFloat)

    const a = matrixValues[0]
    const b = matrixValues[1]

    return Math.atan2(b, a)
  }
  return 0
}

const setTransformOrigin = (wrapperNode, childNode) => {
  const childRect = childNode.getBoundingClientRect()
  const wrapperRect = wrapperNode.getBoundingClientRect()
  const originX = childRect.left - wrapperRect.left + childRect.width / 2
  const originY = childRect.top - wrapperRect.top + childRect.height / 2
  wrapperNode.style.transformOrigin = `${originX}px ${originY}px`
}

const PhysicsWorld = ({ children }) => {
  const [renderedChildren, setRenderedChildren] = useState([])

  useLayoutEffect(() => {
    // Create the Matter.js engine and world
    const engine = Matter.Engine.create({
      constraintIterations: 10,
      positionIterations: 10
    })
    const world = engine.world

    Matter.Composite.add(world, [
      // walls
      Matter.Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, { isStatic: true })
    ])

    const childRefs = React.Children.map(children, () => React.createRef())
    const newChildren = React.Children.map(children, (child, index) => {
      const wrapperRef = childRefs[index]

      const clonedChild = (
        <div
          ref={wrapperRef}
        >
          {child}
        </div>
      )

      setTimeout(() => {
        const wrapperNode = wrapperRef.current

        const childNode = wrapperNode.firstChild
        childNode.style.backgroundColor = randomColor()

        setTransformOrigin(wrapperNode, childNode)
        // Create a Matter.js body for the child component
        const computedStyle = window.getComputedStyle(childNode)

        const initialRotation = getRotation(computedStyle)

        const width = parseFloat(computedStyle.width) + parseFloat(computedStyle.paddingLeft) + parseFloat(computedStyle.paddingRight) + parseFloat(computedStyle.borderLeftWidth) + parseFloat(computedStyle.borderRightWidth)
        const height = parseFloat(computedStyle.height) + parseFloat(computedStyle.paddingTop) + parseFloat(computedStyle.paddingBottom) + parseFloat(computedStyle.borderTopWidth) + parseFloat(computedStyle.borderBottomWidth)

        const initialX = parseFloat(computedStyle.left) + width / 2
        const initialY = parseFloat(computedStyle.top) + height / 2

        const body = Matter.Bodies.rectangle(
          initialX,
          initialY,
          width,
          height,
          {
            chamfer: { radius: parseInt(computedStyle.borderRadius.replace('px', '')) },
            initialX,
            initialY
          }
        )
        console.log(body)
        Matter.Body.setAngle(body, initialRotation)
        Matter.World.add(world, body)

        // Update the position and rotation of the child component based on the simulation
        Matter.Events.on(engine, 'beforeUpdate', () => {
          wrapperNode.style.transform = `translate(${body.position.x - body.initialX}px, ${body.position.y - body.initialY}px) rotate(${body.angle - initialRotation}rad)`
        })
      }, 0)

      return clonedChild
    })

    // Create a Matter.js renderer
    // const render = Matter.Render.create({
    //   element: document.getElementById('root'),
    //   engine,
    //   options: {
    //     width: window.innerWidth,
    //     height: window.innerHeight,
    //     wireframes: false,
    //     background: 'transparent'
    //   }
    // })

    // Run the Matter.js renderer and engine
    // Matter.Render.run(render)
    Matter.Runner.run(engine)

    setRenderedChildren(newChildren)

    // Clean up the Matter.js engine and world when the component unmounts
    return () => {
      Matter.Engine.clear(engine)
      Matter.World.clear(world)
    }
  }, [children])

  return <>{renderedChildren}</>
}

export default PhysicsWorld
