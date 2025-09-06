import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './components/Home'
import CharacterList from './components/characters/CharacterList'
import CharacterDetail from './components/characters/CharacterDetail'
import AnalyticsDashboard from './components/analytics/AnalyticsDashboard'
import DesignSystemShowcase from './components/DesignSystemShowcase'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="characters" element={<CharacterList />} />
        <Route path="characters/:id" element={<CharacterDetail />} />
        <Route path="analytics" element={<AnalyticsDashboard />} />
        <Route path="design-system" element={<DesignSystemShowcase />} />
      </Route>
    </Routes>
  )
}

export default App