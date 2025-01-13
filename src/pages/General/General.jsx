import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import axios from "../../api/index";
import { useParams } from "react-router-dom";

const General = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [managers, setManagers] = useState({});
  console.log(managers);
  
  const [error, setError] = useState(null);
  const { id } = useParams();
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('x-auth-token');
      if (!token) {
        console.error('Token topilmadi! Iltimos, tizimga qayta kiring.');
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
        console.error('Xatolik yuz berdi:', err);
        message.error(err.response?.data || 'Xatolik');
      }
    };

    fetchTasks();
  }, []);

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

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="py-8 px-2">
     <div className="max-w-md  bg-white shadow-xl rounded-lg overflow-hidden sm:max-w-xl">
  <div className="px-6 py-4">
    <h2 className="text-2xl font-bold text-gray-800">
      {managers?.name}
    </h2>
    <p className="text-sm text-gray-500">
      {managers?.last_name}
    </p>

    <div className="mt-6">
      <h3 className="text-lg font-medium text-gray-700 mb-3">
        Hunarlari (Tasks)
      </h3>
      <ul className="space-y-2">
      {
  managers?.tasks?.length > 0 ? (
    managers.tasks.map((item) => (
      <li 
        key={item.id} 
        className="flex items-center justify-between bg-gray-50 p-3 rounded-md shadow-sm hover:shadow-md transition"
      >
        <span className="text-gray-700 font-medium">{item.name}</span>
        <span className="text-sm text-gray-400">{item.type}</span>
      </li>
    ))
  ) : (
    <li className="text-gray-500">No tasks available</li>
  )
}

      
      </ul>
    </div>

    <button
      onClick={showModal}
      className="mt-6 px-5 py-2 w-full bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
    >
      Task qo'shish
    </button>

    <Modal
      title="Yangi Task qo'shish"
      open={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      okText="Saqlash"
      cancelText="Bekor qilish"
    >
      <div className="space-y-3">
        {data?.map((item) => (
          <div 
            key={item.id} 
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition"
          >
            <span className="text-gray-700">{item.name}</span>
            <Input 
              type="checkbox" 
              className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
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
