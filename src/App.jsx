import { useState } from 'react'
import OuterLogin from './components/OuterLogin.jsx'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <OuterLogin />
    </>
  )
}

export default App
