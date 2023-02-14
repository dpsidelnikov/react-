import Matter from 'matter-js'

const Engine = Matter.Engine
const Runner = Matter.Runner

let engine
let runner

const createEngine = () => {
  engine = Engine.create()
  runner = Runner.create()
}

const startRunner = () => {
  Runner.run(runner, engine)
}

const createRectangle = (size, position, isStatic) => {
  return (
    Matter.Bodies.rectangle(position[0], position[1], size[0], size[1], { isStatic })
  )
}

const addBody = (body) => {
  Matter.World.add(engine.world, body)
}

const removeBody = (body) => {
  Matter.Composite.remove(engine.world, body)
  Matter.Composite.allBodies(engine.world)
}

export { createEngine }
export { startRunner }
export { createRectangle }
export { addBody }
export { removeBody }
