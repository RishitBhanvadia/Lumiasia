import { useEffect } from 'react'
import './App.css'
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Header from './components/Header/Header'
import JourneyFlow from './components/JourneyFlow/JourneyFlow'
import useAppStore from './store/useAppStore'

/**
 * App — Root component
 * PRD §6 — Assembles the three persistent layers:
 *   1. <HeroCanvas /> — Full-viewport Three.js scene (fixed, behind DOM)
 *   2. <Header /> — Fixed top bar with language toggle
 *   3. <JourneyFlow /> — Main content container with animated transitions
 */
function App() {
  const fetchProjects = useAppStore((state) => state.fetchProjects)

  useEffect(() => {
    // PRD §7.2 - Populate Projects global state
    fetchProjects()
  }, [fetchProjects])

  return (
    <ErrorBoundary>
      <Header />
      <JourneyFlow />
    </ErrorBoundary>
  )
}

export default App
