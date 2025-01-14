import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import axios from '../../../api/index'
import { useParams } from "react-router-dom";
import { Context } from "../../../components/darkMode/Context"; 

const General = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [managers, setManagers] = useState({});
  const { theme } = useContext(Context);
  const [error, setError] = useState(null);
  const [selectedTasks, setSelectedTasks] = useState([]);
let obj = Object.assign({},selectedTasks)
console.log(obj);

  
  const { id } = useParams();

  useEffect(() => {
    const fetchManagers = async () => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
        return;
      }

      try {
        const response = await axios.get(`/managers/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setManagers(response.data);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        message.error(err.response?.data || "Xatolik");
      }
    };

    fetchManagers();
  }, [id]);

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
        return;
      }

      try {
        const response = await axios.get("/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        setError(err.response?.data || "Xatolik");
      }
    };

    fetchTasks();
  }, []);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleTaskSelection = (taskId) => {
    setSelectedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSaveTasks = async () => {
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      const response = await axios.post(
        `/managers/${id}`,
        { tasks: selectedTasks },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        message.success("Tasks successfully added!");
        setIsModalOpen(false);
        setSelectedTasks([]); 
      }
    } catch (error) {
      console.error(error);
      message.error("Failed to save tasks.");
    }
  };

  return (
    <div
      className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
          p-4 min-h-[100%] transition-all 
          rounded-lg`}
    >
      <div
        className={`max-w-md shadow-xl rounded-lg overflow-hidden sm:max-w-xl ${
          theme
            ? "bg-[#1f2937] text-white"
            : "bg-white text-gray-800"
        } border-[1px] border-[rgb(244,241,236)]`}
      >
        <div className="px-6 py-4">
          <h2 className="text-2xl font-bold">{managers?.name}</h2>
          <p className="text-sm">{managers?.last_name}</p>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-3">Hunarlari (Tasks)</h3>
            <ul className="space-y-2">
              {managers?.tasks?.length > 0 ? (
                managers.tasks.map((item) => (
                  <li
                    key={item.id}
                    className={`flex items-center justify-between p-3 rounded-md shadow-sm transition ${
                      theme
                        ? "bg-[#374151] text-gray-300"
                        : "bg-gray-50 text-gray-700"
                    } hover:shadow-md border border-[rgb(244,241,236)]`}
                  >
                    <span className="font-medium">{item.name}</span>
                    <span className="text-sm">{item.type}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-500">No tasks available</li>
              )}
            </ul>
          </div>

          <button
            onClick={showModal}
            className={`mt-6 px-5 py-2 w-full font-semibold rounded-lg transition ${
              theme
                ? "bg-[#2563eb] hover:bg-[#1e40af] text-white"
                : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            Task qo'shish
          </button>

          <Modal
            title="Yangi Task qo'shish"
            open={isModalOpen}
            onOk={handleSaveTasks}
            onCancel={handleCancel}
            okText="Saqlash"
            cancelText="Bekor qilish"
          >
            <div className="space-y-3">
              {data?.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg shadow-md transition bg-gray-50 hover:bg-gray-100 text-gray-700 border border-[rgb(244,241,236)]"
                >
                  <span>{item.name}</span>
                  <Input
                    type="checkbox"
                    className="w-5 h-5 rounded text-blue-500 border-gray-300 focus:ring-blue-500"
                    onChange={() => handleTaskSelection(item)}
                    checked={selectedTasks.includes(item.id)}
                  />
                </div>
              ))}
            </div>
          </Modal>
        </div>
      </div>
    </div>
  );
};

export default General;