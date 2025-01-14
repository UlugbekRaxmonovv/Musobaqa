import { Route, Routes } from "react-router-dom";
import General from "./pages/DashboardPages/General/General"; 
import Tasks from "./pages/DashboardPages/Tasks/Tasks"; 
import Employees from "./pages/DashboardPages/Employees/Employees"; 
import BlockLanganar from "./pages/DashboardPages/BlockLanganar/BlockLanganar"; 
import Managers from "./pages/DashboardPages/Managers/Managers.jsx";   
import "./App.css";
import Auth from "./pages/Auth/Auth";
import Login from "./pages/Login/Login";
import { Toaster } from "react-hot-toast";
import Manager from './pages/DashboardPages/Manager.jsx'
import Dashboard from "./pages/DashboardPages/Dashboard/Dashboard"; 
function App() {
  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/" element={<Auth />}>
          <Route path="/dashboard" element={<Manager />}>
            <Route path="statestika" element={<Dashboard />} />
            <Route path="managers" element={<Managers />} />
            <Route path="general/:id?" element={<General />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="employees" element={<Employees />} />
            <Route path="blockLanganar" element={<BlockLanganar />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
