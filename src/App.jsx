
import Box from './components/box'
import Ground from './components/ground'
import Matter from 'matter-js'
import React, { useRef, useState } from 'react'

const App = () => {
  const engine = useRef(Matter.Engine.create({})).current
  const mouse = useRef(Matter.Mouse.create(document.querySelector('#root'))).current
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: {
        visible: false
      }
    }
  })

  window.addEventListener('mousedown', () => {
    Matter.Composite.remove(engine.world, engine.world.bodies[13])
    setFall(true)
  }
  )
  const [fall, setFall] = useState(false)
  Matter.Composite.add(engine.world, mouseConstraint)
  Matter.Runner.run(engine)
  // Add event listener for keydown event when "k" is pressed
  document.addEventListener('keydown', (event) => {
    if (event.key === 'k') {
      Matter.Composite.remove(engine.world, engine.world.bodies[13])
      setFall(true)
    }
  })

  const commonProps = {
    x: 300,
    y: -600,
    width: 100,
    height: 100,
    color: '#372549',
    engine: engine || null,
    text: 'Box 7'
  }

  return (
  <div className='container'>
  <Box text="Box 1" x={300} y={-800} width={200} height={100} color="#774c60" engine={engine}/>
  <Box text="Box 2" x={300} y={-500} width={100} height={60} color="#1a1423" engine={engine}/>
  <Box text="Box 3" x={300} y={-200} width={100} height={100} color="#b75d69" engine={engine}/>
  <Box text="Box 4" x={400} y={-800} width={200} height={90} color="#1a1423" engine={engine}/>
  <Box text="Box 5" x={200} y={-500} width={160} height={160} color="#b75d69" engine={engine}/>
  <Box text="Box 6" x={150} y={-200} width={120} height={80} color="#372549" engine={engine}/>
  <Box {...commonProps}/>
  <Box text="Box 8" x={300} y={-400} width={200} height={100} color="#774c60" engine={engine}/>
  <Box text="Box 9" x={300} y={-700} width={100} height={60} color="#1a1423" engine={engine}/>
  <Box text="Box 10" x={300} y={-300} width={100} height={100} color="#b75d69" engine={engine}/>
  <Box text="Box 11" x={400} y={-200} width={200} height={90} color="#1a1423" engine={engine}/>
  <Box text="Box 12" x={400} y={-900} width={160} height={160} color="#b75d69" engine={engine}/>
  <Box text="Box 13" x={450} y={-100} width={120} height={80} color="#372549" engine={engine}/>
  {!fall && <Ground x={300} y={500} width={500} height={10} color="grey" angle={0} engine={engine}/>}
  <Ground x={50} y={250} width={10} height={510} color="grey" angle={0} engine={engine}/>
  <Ground x={550} y={250} width={10} height={510} color="grey" angle={0} engine={engine}/>
  </div>
  )
}

export default App
