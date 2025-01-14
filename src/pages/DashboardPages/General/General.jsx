import React, { useContext, useEffect, useState } from "react";
import { Modal, Button, Input, message } from "antd";
import axios from "../../../api/index";
import { useParams } from "react-router-dom";
import { Context } from "../../../components/darkMode/Context";

const General = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [managers, setManagers] = useState({});
  const [newTask, setNewTask] = useState("");
  const { theme } = useContext(Context);
  const [datas, setDatas] = useState([]);
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
        setData(response.data.tasks || []);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        message.error(err.response?.data || "Xatolik");
      }
    };

    fetchManagers();
  }, [id]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const fetchTasks = async () => {
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
        let result = response.data.filter((item) => item.type !== item.type);

        setDatas(result);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        message.error(err.response?.data || "Xatolik");
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = async () => {
    if (newTask.trim() === "") {
      message.error("Task nomini kiriting!");
      return;
    }

    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      const response = await axios.post(
        `/tasks`,
        { name: newTask },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201) {
        message.success("Task muvaffaqiyatli qo'shildi!");
        const newTaskData = response.data;

        setManagers((prev) => ({
          ...prev,
          tasks: [...(prev.tasks || []), newTaskData],
        }));
        setData((prev) => [...prev, newTaskData]);
        setNewTask("");
      }
    } catch (error) {
      console.error("Task qo'shishda xatolik yuz berdi:", error);
      message.error("Task qo'shishda xatolik.");
    }
  };

  if (id) {
    return (
      <div
        className={`${
          theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"
        } p-4 min-h-[100%] transition-all rounded-lg`}
      >
        <div
          className={`max-w-md shadow-xl rounded-lg overflow-hidden sm:max-w-xl ${
            theme ? "bg-[#1f2937] text-white" : "bg-white text-gray-800"
          } border-[1px] border-[rgb(244,241,236)]`}
        >
          <div className="px-6 py-4">
            <h2 className="text-2xl font-bold">{managers?.name}</h2>
            <p className="text-sm">{managers?.last_name}</p>

            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Hunarlari (Tasks)</h3>
              <ul className="space-y-2">
                {data.length > 0 ? (
                  data.map((item) => (
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
                {datas ? (
                  <>
                    {datas.map((item) => (
                      <li
                        key={item.id}
                        className={`flex items-center justify-between p-3 rounded-md shadow-sm transition ${
                          theme
                            ? "bg-[#374151] text-gray-300"
                            : "bg-gray-50 text-gray-700"
                        } hover:shadow-md border border-[rgb(244,241,236)]`}
                      >
                        <span className="font-medium">{item.name}</span>
                      </li>
                    ))}
                  </>
                ) : (
                  ""
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
              onCancel={handleCancel}
              footer={[
                <Button key="cancel" onClick={handleCancel}>
                  Bekor qilish
                </Button>,
                <Button key="submit" type="primary" onClick={handleAddTask}>
                  Task qo'shish
                </Button>,
              ]}
            >
              <div className="space-y-3">
                <Input
                  placeholder="Task nomini kiriting"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                />
              </div>
            </Modal>
          </div>
        </div>
      </div>
    );
  }
  return (
    <>
      <div
        className={`${
          theme
            ? "bg-gray-900 text-gray-200"
            : "bg-[rgb(244,241,236)] text-gray-900"
        } p-4 min-h-[100%] transition-all rounded-lg`}
      >
        <div className="flex justify-center items-center flex-col h-full">
          <h1
            className={`text-2xl font-bold ${
              theme ? "text-white" : "text-gray-900"
            }`}
          >
            General Page (No ID)
          </h1>
          <p
            className={`text-lg mt-2 ${
              theme ? "text-gray-400" : "text-gray-700"
            }`}
          >
            ID mavjud emas. Umumiy ma'lumotlar ko'rsatilmoqda hozir.
          </p>
        </div>
      </div>
    </>
  );
};

export default General;
