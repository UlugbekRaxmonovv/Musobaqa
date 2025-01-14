import React, { useContext, useEffect, useState } from "react";

import blockedimg from "../../../assets/images/blocked-users-img.png";
import employesimg from "../../../assets/images/employes.webp";
import managersimg from "../../../assets/images/manager-img.png";
import tasks from "../../../assets/images/tasks.png";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

import { Bar } from "react-chartjs-2";
import { CategoryScale, LinearScale, BarElement } from "chart.js";
// fetch
import axios from "../../../api/index";
import { Context } from "../../../components/darkMode/Context";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const Dashboard = () => {
  const [blocked, setBlocked] = useState(0);
  const [filteredData, setFilteredData] = useState([]);
  const [managers, setManagers] = useState(0);
  const [employes, setEmployes] = useState(0);
  const [task , setTask] = useState(0)

  const { theme } = useContext(Context);

  const data = {
    labels: ["Bloced", "Active"],
    datasets: [
      {
        data: [blocked, managers-blocked],
        backgroundColor: ["#fe7a79", "#7376a0"],
        hoverOffset: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Active and blocked Managers statsitic",
      },
    },
  };

  const data2 = {
    labels: ["Yanvar", "Fevral", "Mart", "Aprel", "May", "Iyun"],
    datasets: [
      {
        label: "2024 Yil",
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "2023 Yil",
        data: [28, 48, 40, 19, 86, 27],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };
  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Bar Diagrammasi Misoli",
      },
    },
  };

  const fetchTasks = async () => {
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      const response = await axios.get("/managers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setManagers(response.data.length);
      const filteredData = response?.data?.filter((item) => !item.isActive);
      setBlocked(filteredData.length);
      setFilteredData(filteredData);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };

  // fetch employes
  const fetchEmployes = async () => {
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      const response = await axios.get("/employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setEmployes(response.data.length);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };


  // main fetch tasks
  const fetchTasksmain = async () => {
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      const response = await axios.get(`/tasks`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTask(response.data.length);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
      message.error(err.response?.data || "Xatolik");
    }
  };




  useEffect(() => {
    fetchTasks();
    fetchEmployes();
    fetchTasksmain()
  }, []);

  return (
    <div
      className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
        p-4 min-h-[100%] transition-all 
        rounded-lg`}
    >
      <div className="status-header mt-[40px] flex items-center justify-center gap-[50px]">
       
        <div className="managers flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] "> Managers</h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={managersimg} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">
              {managers ? managers : "0"}
            </h3>
          </div>
        </div>

        
        <div className="managers flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] "> Active Managers</h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={managersimg} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">
              {managers- blocked ?managers- blocked   : "0"}
            </h3>
          </div>
        </div>
          
        <div className="blocked flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] ">
            {" "}
            Blocked Managers
          </h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={blockedimg} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">
              {blocked ? blocked : "0"}
            </h3>
          </div>
        </div>


        <div className="employes flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] "> Employes</h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={employesimg} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">
              {employes ? employes : "0"}
            </h3>
          </div>
        </div>

        <div className="tasks flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] "> Tasks</h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={tasks} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">{task ? task : "0"}</h3>
          </div>
        </div>
      </div>

      <div className="chartjs mt-[30px] flex items-center justify-between">
        <div className=" w-[800px] h-[400px]">
          <Bar data={data2} options={options2} />
        </div>

        <div className="w-[300px] h-[300px]">
          <Doughnut data={data} options={options} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
