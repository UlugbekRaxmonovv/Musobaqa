import { Route, Routes } from 'react-router-dom'
import General from './pages/General/General'
import Tasks from './pages/Tasks/Tasks'
import Employees from './pages/Employees/Employees'
import BlockLanganar from './pages/BlockLanganar/BlockLanganar'
import Managers from './pages/Managers/Managers'
import './App.css'
import Auth from './pages/Auth/Auth'
import Login from './pages/Login/Login'
import { Toaster } from 'react-hot-toast';
import Manager  from './pages/DashboardPages/Manager/Manager'
function App() {
  return (
    <>
    <Toaster
  position="top-center"
  reverseOrder={false}
/>
        <Routes>
        <Route path="/signin" element={<Login />} />
        <Route path="/" element={<Auth />} >
        <Route path="/dashboard" element={<Manager />} >
          <Route path="managers" element={<Managers />} />
          <Route path="general/:id" element={<General />} />
          <Route path="tasks" element={<Tasks />} />
          <Route path="employees" element={<Employees />} />
          <Route path="blockLanganar" element={<BlockLanganar />} />
          </Route>
          </Route>  
      </Routes>
    </>
  )
}

export default App
