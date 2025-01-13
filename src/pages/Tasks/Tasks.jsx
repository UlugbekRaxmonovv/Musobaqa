import React, { useContext, useEffect, useState } from 'react';
import { Modal, Input, Button, Select, message, Table } from 'antd';
import axios from '../../api/index';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa6';
import { Context } from '../../components/darkMode/Context';

const { Option } = Select;

const Tasks = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [taskName, setTaskName] = useState('');
  const [taskType, setTaskType] = useState('');
  const [editTaskId, setEditTaskId] = useState(null);
  const [search, setSearch] = useState("");
  const { theme } = useContext(Context);
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('x-auth-token');
      if (!token) {
        console.error('Token topilmadi! Iltimos, tizimga qayta kiring.');
        return;
      }

      try {
        const response = await axios.get('/tasks', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
      } catch (err) {
        console.error('Xatolik yuz berdi:', err);
        message.error(err.response?.data || 'Xatolik');
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = () => {
    setModalType('add');
    setIsModalOpen(true);
    setTaskName('');
    setTaskType('');
  };

  const handleEditTask = (id) => {
    const taskToEdit = data.find((task) => task.id === id);
    setModalType('edit');
    setEditTaskId(id);
    setTaskName(taskToEdit.name);
    setTaskType(taskToEdit.type);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (id) => {
    Modal.confirm({
      title: 'Vazifani o\'chirish',
      content: 'Siz haqiqatan ham ushbu vazifani o\'chirmoqchimisiz?',
      onOk: async () => {
        try {
          const token = localStorage.getItem('x-auth-token');
          await axios.delete(`/tasks/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(data.filter((task) => task.id !== id));
          message.success('Vazifa o\'chirildi!');
        } catch (err) {
          console.error('O\'chirishda xatolik:', err);
          message.error('Vazifani o\'chirishda xatolik yuz berdi.');
        }
      },
      onCancel() {
        console.log('O\'chirish bekor qilindi');
      },
    });
  };

  const handleModalOk = async () => {
    const token = localStorage.getItem('x-auth-token');
    if (!taskName || !taskType) {
      message.warning('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }

    try {
      if (modalType === 'add') {
        const response = await axios.post(
          '/tasks',
          { name: taskName, type: taskType },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData([...data, response.data]);
        message.success('Vazifa qo\'shildi!');
      } else if (modalType === 'edit') {
        const response = await axios.patch(
          `/tasks/${editTaskId}`,
          { name: taskName, type: taskType },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData(data.map((task) => (task.id === editTaskId ? response.data : task)));
        message.success('Vazifa yangilandi!');
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error('Saqlashda xatolik:', err);
      message.error('Xatolik yuz berdi.');
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title:
        < div className="text-center" >
          {"№"}
        </div >,
      width: 20,
      render: (_, __, index) =>
        <div className="text-center">
          {index + 1}
        </div>
    },
    {
      title: 'Task name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <span className="">{text}</span>,
    },
    {
      title: 'Role',
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span className="">{text}</span>,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
  className={`${
    theme ? 'bg-[#374151] hover:bg-[#4b5563]' : 'bg-teal-500 hover:bg-teal-600'
  } text-white`}
  onClick={() => handleEditTask(record.id)}
  icon={<CiEdit />}
/>
<Button
  className={`${
    theme ? 'bg-[#991b1b] hover:bg-[#b91c1c]' : 'bg-red-500 hover:bg-red-600'
  } text-white`}
  onClick={() => handleDeleteTask(record.id)}
  icon={<RiDeleteBin7Line />}
/>
        </div>
      ),
    },
  ];

  return (
    <div
    className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
          p-4 min-h-[100%] transition-all 
          rounded-lg`}
  >
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
      <Button
  type="primary"
  className={`add-user w-[152px] h-[40px] ${
    theme ? 'bg-[#1f2937] hover:!bg-[#374151]' : 'bg-[#14B890] hover:!bg-[#129c7a]'
  }`}
  onClick={handleAddTask}
>
  <FaPlus className="add-user-active !transform !transition-transform !duration-300 group-hover:!rotate-90" />
  Task add
</Button>

<input
  placeholder="Search"
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className={`border rounded-md px-4 py-2 w-full sm:w-64 outline-none ${
    theme ? 'border-[#4b5563] bg-[#1f2937] text-white placeholder-white' : 'border-gray-300 placeholder-gray-400'
  } focus:outline-none`}
/>


      </div>

      <Table
        columns={columns}
        dataSource={data.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))}
        rowKey="id"
        pagination={true}
        className={theme ? "custom-table theme" : "custom-table"}
        rowClassName={() => (theme ? "dark-row" : "light-row")}
      
        
      />

      <Modal
        title={modalType === 'add' ? "Task add" : "Task update"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        className="max-w-sm w-full"
      >
        <div className="space-y-4">
          <Input
            placeholder="Vazifa nomi"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="border border-gray-300 rounded-md"
          />
          <Select
            placeholder="Vazifa turi"
            value={taskType}
            onChange={(value) => setTaskType(value)}
            className="w-full"
          >
            <Option value="Manager">Manager</Option>
            <Option value="Employee">Employee</Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default Tasks;
