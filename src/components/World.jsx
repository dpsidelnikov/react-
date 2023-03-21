import React, { useRef, useLayoutEffect } from 'react'

const World = ({ children }) => {
  const containerRef = useRef()

  useLayoutEffect(() => {
    if (!containerRef.current) return

    const physicsElements = containerRef.current.querySelectorAll('[physics="false"]')

    const parentStyle = window.getComputedStyle(containerRef.current)
    const gapSize = parseFloat(parentStyle.gap)

    physicsElements.forEach((element, index) => {
      const rect = element.getBoundingClientRect()
      const newPosition = {
        top: rect.top + gapSize * index + window.scrollY,
        left: rect.left + window.scrollX
      }

      element.style.position = 'absolute'
      element.style.top = `${newPosition.top}px`
      element.style.left = `${newPosition.left}px`
    })
  }, [children])

  const childrenWithRef = React.Children.map(children, (child) =>
    React.cloneElement(child, { ref: containerRef })
  )

  return <>{childrenWithRef}</>
}

export default World

// const childrenWithRef = React.Children.map(children, (child) =>
// React.cloneElement(child, { ref: containerRef })
// )

// return <>{childrenWithRef}</>
