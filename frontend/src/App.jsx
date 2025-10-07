import { useState } from 'react'
import './App.css'

function App() {

  return (
    <>
    {/* login form */}
    <p>Login</p>
    <form>
        <input type="text" placeholder="Email" />
        <input type="password" placeholder="Password" />
        <button type="submit">Submit</button>
      </form>
    </>
  )
}

export default App
