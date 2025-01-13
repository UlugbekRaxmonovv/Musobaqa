import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Select, message, Table } from 'antd';
import axios from '../../api/index';
import { CiEdit } from 'react-icons/ci';
import { RiDeleteBin7Line } from 'react-icons/ri';
import { FaPlus } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const { Option } = Select;

const Managers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [taskType, setTaskType] = useState('');
  const [status,setStatus] = useState("")
  const [search, setSearch] = useState("");
  const [taskName, setTaskName] = useState('');
  const [email, setEmail] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [currentStatus, setCurrentStatus] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [modalType, setModalType] = useState('add'); 
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentManagerId, setCurrentManagerId] = useState(null);
  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem('x-auth-token');
      if (!token) {
        console.error('Token topilmadi! Iltimos, tizimga qayta kiring.');
        return;
      }
  
      try {
        let api = search ? `/managers?name_like=${search}` : '/managers'; 
        const response = await axios.get(api, {
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
  }, [search]);
  

  const handleAddTask = () => {
    setModalType('add');
    setIsModalOpen(true);
    setTaskName('');
    setTaskType('');
  };

  const handleEditTask = (id) => {
    const taskToEdit = data.find((task) => task.id === id);
    if (taskToEdit) {
      setTaskName(taskToEdit.name);
      setEmail(taskToEdit.email);
      setLastName(taskToEdit.last_name);
      setRole(taskToEdit.role);
      setCurrentStatus(taskToEdit.status);
      setEditTaskId(id);
      setModalType('edit');
      setIsModalOpen(true);
    }
  };
  

  const resetForm = () => {
    setTaskName('');
    setEmail('');
    setLastName('');
    setRole('');
    setCurrentStatus(null);
    setEditTaskId(null);
  };
  

  const handleDeleteTask = (id) => {
    Modal.confirm({
      title: 'Vazifani o\'chirish',
      content: 'Siz haqiqatan ham ushbu vazifani o\'chirmoqchimisiz?',
      onOk: async () => {
        try {
          const token = localStorage.getItem('x-auth-token');
          await axios.delete(`/managers/${id}`, {
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
    
    if (!taskName || !email || !lastName || !role || currentStatus === null) {
      message.warning('Iltimos, barcha maydonlarni to\'ldiring!');
      return;
    }
  
    try {
      if (modalType === 'add') {
        const response = await axios.post(
          '/managers',
          {
            name: taskName,
            email,
            last_name: lastName,
            type: role,
            isActive: currentStatus,
            tasks:[]
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData((prevData) => [...prevData, response.data]);
        message.success('Vazifa qo\'shildi!');
      } else if (modalType === 'edit') {
        const response = await axios.patch(
          `/managers/${editTaskId}`, 
          {
            name: taskName,
            email,
            last_name: lastName,
            type: role,
            isActive: currentStatus,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData((prevData) =>
          prevData.map((task) =>
            task.id === editTaskId ? response.data : task
          )
        );
        message.success('Vazifa yangilandi!');
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error('Xatolik yuz berdi:', err);
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
      render: (_, record, index) =>
       <>
       <Link to={`/dashboard/general/${record.id}`}>
       <div className="text-center w-full">
          {index + 1}
        </div></Link>
       
       </>
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text,record) => <><Link to={`/dashboard/general/${record.id}`}><span className="font-medium w-full text-gray-700">{text}</span></Link></>,
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      render: (text,record) =><Link to={`/dashboard/general/${record.id}`}> <span className="font-medium  text-gray-700 w-full">{text}</span> </Link>,
    },
  
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      render: (text,record) => <Link to={`/dashboard/general/${record.id}`}><span className="text-gray-500 w-full">{text}</span></Link>
    },
    {
      title: 'Role',
      dataIndex: 'type',
      key: 'type',
      render: (text,record) => <Link to={`/dashboard/general/${record.id}`}><span className="font-medium w-full text-gray-700">{text}</span></Link>,
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      render: (text, record) => (
           <span
          onClick={() => handleStatusModalOpen(record)}
          className={`font-medium text-white cursor-pointer px-2 py-1 rounded w-full ${text ? 'bg-green-500' : 'bg-red-500'}`}
        >
          {text ? 'Active' : 'Inactive'}
        </span>
       
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white"
            onClick={() => handleEditTask(record.id)}
            icon={<CiEdit />}
          />
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            onClick={() => handleDeleteTask(record.id)}
            icon={<RiDeleteBin7Line />}
          />
        </div>
      ),
    },
  ];

   const handleStatusModalOpen = (manager) => {
    setCurrentManagerId(manager.id);
    setCurrentStatus(manager.isActive);
    setIsStatusModalOpen(true);
  };

  const handleStatusUpdate = async () => {
    const token = localStorage.getItem('x-auth-token');
    try {
      await axios.patch(`/managers/${currentManagerId}`, { isActive: currentStatus }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentManagerId ? { ...item, isActive: currentStatus } : item
        )
      );
      message.success('Status muvaffaqiyatli yangilandi!');
      setIsStatusModalOpen(false);
    } catch (err) {
      console.error('Status yangilashda xatolik:', err);
      message.error('Status yangilashda xatolik yuz berdi.');
    }
  };

  return (
    <div className="py-8 px-2 max-w-full">
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
        <Button
          type="primary"
          className=" add-user w-[152px]  h-[40px] bg-[#14B890] hover:!bg-[#129c7a]"
          onClick={handleAddTask}
        >
          <FaPlus className="add-user-active !transform !transition-transform !duration-300 group-hover:!rotate-90 " />
          Employee add
        </Button>
        <Input
          placeholder="Поиск по familiyasi"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-full sm:w-64"
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={true}
       
      />
<Modal
  title={modalType === 'add' ? "Add Manager" : "Edit Manager"}
  open={isModalOpen}
  onOk={handleModalOk}
  onCancel={handleModalCancel}
  className="max-w-sm w-full"
>
  <div className="space-y-4">
    <div>
      <label htmlFor="taskName" className="block text-sm font-medium text-gray-700">
       Name
      </label>
      <Input
        id="taskName"
        placeholder="Name"
        value={taskName}
        onChange={(e) => setTaskName(e.target.value)}
        className="border border-gray-300 rounded-md mt-1"
      />
    </div>
    <div>
      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
        Email
      </label>
      <Input
        id="email"
        placeholder="Enter email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border border-gray-300 rounded-md mt-1"
      />
    </div>
    <div>
      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
        Last Name
      </label>
      <Input
        id="lastName"
        placeholder="Enter last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="border border-gray-300 rounded-md mt-1"
      />
    </div>
    <div>
      <label htmlFor="role" className="block text-sm font-medium text-gray-700">
        Role
      </label>
      <Input
        id="role"
        placeholder="Enter role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        className="border border-gray-300 rounded-md mt-1"
      />
    </div>
    {
      modalType === "add" ? <div>
      <label htmlFor="status" className="block text-sm font-medium text-gray-700">
        Status
      </label>
      <Select
        id="status"
        placeholder="Select status"
        value={currentStatus}
        onChange={(value) => setCurrentStatus(value)}
        className="w-full mt-1"
      >
        <Option value={true}>Active</Option>
        <Option value={false}>Inactive</Option>
      </Select>
    </div>
    :
    ""
    }
    
  </div>
</Modal>



        <Modal
        title="Statusni o'zgartirish"
        open={isStatusModalOpen}
        onOk={handleStatusUpdate}
        onCancel={() => setIsStatusModalOpen(false)}
        className="max-w-sm w-full"
      >
        <Select
          placeholder="Status"
          value={currentStatus}
          onChange={(value) => setCurrentStatus(value)}
          className="w-full"
        >
          <Option value={true}>Active</Option>
          <Option value={false}>Inactive</Option>
        </Select>
      </Modal>
    </div>
  );
};

export default Managers