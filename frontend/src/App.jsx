import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { ThemeProvider } from './components/ThemeContext'

// Components
import Navbar from './components/Navbar'

// Pages
import Home from './pages/Home'
import About from './pages/About'
import Contact from './pages/Contact'
import CreateMenu from './pages/CreateMenu'
import Login from './pages/Login'
import Signup from './pages/Signup'

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-theme-primary">
          <Navbar />
          <main>
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/create-menu" element={<CreateMenu />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
              </Routes>
            </AnimatePresence>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  )
}

export default App
