import { Routes, Route } from "react-router"
import Home from "@/pages/Home"
import Landing from "@/pages/Landing"

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/app" element={<Home />} />
      </Routes>
    </div>
  )
}

export default App