import React, { useContext } from 'react'
import { Context } from '../../components/darkMode/Context';

const Dashboard = () => {
    const { theme } = useContext(Context);
  return (
    <div
    className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
        p-4 min-h-[100%] transition-all 
        rounded-lg`}
  >
    <h1>
        Status
    </h1>

    </div>
  )
}

export default Dashboard