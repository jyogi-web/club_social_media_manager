import { Routes, Route } from 'react-router-dom'
import EditorPage from './pages/EditorPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<EditorPage />} />
      <Route path="/editor" element={<EditorPage />} />
    </Routes>
  )
}

export default App
