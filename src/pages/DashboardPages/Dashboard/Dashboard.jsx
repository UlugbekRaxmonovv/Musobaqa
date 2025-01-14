import React, { useContext, useEffect } from "react";
import { Context } from "../../components/darkMode/Context";
import blockedimg from "../../assets/images/blocked-users-img.png";
import employes from "../../assets/images/employes.webp";
import managers from "../../assets/images/manager-img.png";
import tasks from "../../assets/images/tasks.png";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";

import { Bar } from "react-chartjs-2";
import { CategoryScale, LinearScale, BarElement } from "chart.js";

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
  const { theme } = useContext(Context);

  const data = {
    labels: ["Bloced", "Active"],
    datasets: [
      {
        label: "Bloked or Active",
        data: [2, 8],
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
        text: "Active and blocked users statsitic",
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

  return (
    <div
      className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
        p-4 min-h-[100%] transition-all 
        rounded-lg`}
    >
      <div className="status-header mt-[40px] flex items-center justify-center gap-[50px]">
        <div className="blocked flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] ">
            {" "}
            Blocked Users
          </h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={blockedimg} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">22</h3>
          </div>
        </div>

        <div className="managers flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] "> Managers</h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={managers} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">12</h3>
          </div>
        </div>

        <div className="employes flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] "> Employes</h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={employes} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">2</h3>
          </div>
        </div>

        <div className="tasks flex flex-col items-center justify-center gap-[20px]  w-[217px] h-[130px] bg-[#fff] rounded-[10px] ">
          <h2 className="text-[#0f123f] font-[500] text-[18px] "> Tasks</h2>
          <div className="flex items-center justify-center gap-[30px]">
            <img className="w-[50px] h-[50px]" src={tasks} alt="" />
            <h3 className="text-[#0f123f] font-[600] text-[30px]">2</h3>
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
