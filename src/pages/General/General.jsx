import React, { useEffect, useState } from "react";
import { Modal, Button, Input, Form } from "antd";
import axios from "../../api/index";

const General = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null); 

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
      <div className="max-w-md bg-white shadow-lg rounded-lg overflow-hidden sm:max-w-xl">
        <div className="px-6 py-4">
          <h2 className="text-xl font-semibold text-gray-800">Manager G’aybulla</h2>
          <p className="text-gray-500">G’aybulla o'g'li</p>

          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-700 mb-2">Hunarlari tasks</h3>
            <ul className="list-decimal list-inside text-gray-600">
              {
                data.map((item) =>(
                  <>
                    <li>{item.name}</li>
                  </>
                ))
              }
            
             
            </ul>
          </div>

          <button
            onClick={showModal}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
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
          {
  data?.map((item) => (
    <div 
      key={item.id} 
      className="flex items-center justify-between p-3 bg-white rounded-lg shadow-md hover:bg-gray-100 transition duration-300 mb-2"
    >
      <li className="text-lg font-semibold text-gray-800 list-none">{item.name}</li>
      <Input 
        type="checkbox" 
        className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
    </div>
  ))
}
          </Modal>
        </div>

      
      </div>
    </div>
  );
};

export default General;
