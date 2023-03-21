import React from 'react'
import PhysicsWorld from './components/PhysicsWorld'
import Object from './components/Object'
import './style/index.css'

const content = [<Object style="object" key='1' physics="dynamic" text="hola"/>,
<Object style="object1" key='2' physics="dynamic" text="hola"/>,
<Object style="object2" key='3' physics="dynamic" text="Pepsicola"/>]

const App = () => {
  return (
        <PhysicsWorld>{ content }</PhysicsWorld>

  )
}

export default App
