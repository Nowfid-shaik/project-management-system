import { Routes, Route } from 'react-router-dom'
import Layout from './pages/Layout'
import { Toaster } from 'react-hot-toast'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Team from './pages/Team'
import ProjectDetails from './pages/ProjectDetails'
import TaskDetails from './pages/TaskDetails'

const App = () => {
  return (
    <>
      <Toaster />

      <Routes>

        <Route path="/" element={<Layout />}>

          {/* ROOT dashboard */}
          <Route index element={<Dashboard />} />

          {/* ADD THIS LINE */}
          <Route path="dashboard" element={<Dashboard />} />

          <Route path="team" element={<Team />} />
          <Route path="projects" element={<Projects />} />
          <Route path="projectDetails" element={<ProjectDetails />} />
          <Route path="taskDetails" element={<TaskDetails />} />

        </Route>

      </Routes>

    </>
  )
}

export default App