import React, { useContext, useEffect, useState } from "react";
import { Modal, Input, Button, Select, message, Table, Pagination } from "antd";
import axios from "../../../api/index";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { FaPlus } from "react-icons/fa6";
import { Link } from "react-router-dom";
import { Context } from "../../../components/darkMode/Context";

const { Option } = Select;

const Managers = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [data, setData] = useState([]);
  const [taskType, setTaskType] = useState("");
  const [status, setStatus] = useState("");
  const [taskName, setTaskName] = useState("");
  const [email, setEmail] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState("");
  const [currentStatus, setCurrentStatus] = useState(null);
  const [editTaskId, setEditTaskId] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [currentManagerId, setCurrentManagerId] = useState(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);
  const [search, setSearch] = useState("");
  const { theme } = useContext(Context);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPage(1);
  };

  useEffect(() => {
    const fetchTasks = async () => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
        return;
      }

      try {
        let api = search
          ? `/managers?name_like=${search}`
          : `/managers?_limit=${pageSize}&_page=${page}`;
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(response.data);
        setTotalOrders(response.headers["x-total-count"]);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        message.error(err.response?.data || "Xatolik");
      }
    };

    fetchTasks();
  }, [search, page, pageSize]);

  const handleAddTask = () => {
    setModalType("add");
    setIsModalOpen(true);
    setTaskName("");
    setTaskType("");
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
      setModalType("edit");
      setIsModalOpen(true);
    }
  };

  const resetForm = () => {
    setTaskName("");
    setEmail("");
    setLastName("");
    setRole("");
    setCurrentStatus(null);
    setEditTaskId(null);
  };

  const handleDeleteTask = (id) => {
    Modal.confirm({
      title: "Vazifani o'chirish",
      content: "Siz haqiqatan ham ushbu vazifani o'chirmoqchimisiz?",
      onOk: async () => {
        try {
          const token = localStorage.getItem("x-auth-token");
          await axios.delete(`/managers/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setData(data.filter((task) => task.id !== id));
          message.success("Vazifa o'chirildi!");
        } catch (err) {
          console.error("O'chirishda xatolik:", err);
          message.error("Vazifani o'chirishda xatolik yuz berdi.");
        }
      },
      onCancel() {
        console.log("O'chirish bekor qilindi");
      },
    });
  };

  const handleModalOk = async () => {
    const token = localStorage.getItem("x-auth-token");

    if (!taskName || !email || !lastName || !role || currentStatus === null) {
      message.warning("Iltimos, barcha maydonlarni to'ldiring!");
      return;
    }

    try {
      if (modalType === "add") {
        const response = await axios.post(
          "/managers",
          {
            name: taskName,
            email,
            last_name: lastName,
            type: role,
            isActive: currentStatus,
            tasks: [],
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setData((prevData) => [...prevData, response.data]);
        message.success("Vazifa qo'shildi!");
      } else if (modalType === "edit") {
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
        message.success("Vazifa yangilandi!");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
      message.error("Xatolik yuz berdi.");
    }
  };

  const handleModalCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
    {
      title: <div className="text-center">{"№"}</div>,
      width: 20,
      render: (_, record, index) => (
        <>
          <Link to={`/dashboard/general/${record.id}`}>
            <div className="text-center w-full">{index + 1}</div>
          </Link>
        </>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <>
          <Link to={`/dashboard/general/${record.id}`}>
            <span className="font-medium w-full ">{text}</span>
          </Link>
        </>
      ),
    },
    {
      title: "Last Name",
      dataIndex: "last_name",
      key: "last_name",
      render: (text, record) => (
        <Link to={`/dashboard/general/${record.id}`}>
          {" "}
          <span className="font-medium   w-full">{text}</span>{" "}
        </Link>
      ),
    },

    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (text, record) => (
        <Link to={`/dashboard/general/${record.id}`}>
          <span className=" w-full">{text}</span>
        </Link>
      ),
    },
    {
      title: "Role",
      dataIndex: "type",
      key: "type",
      render: (text, record) => (
        <Link to={`/dashboard/general/${record.id}`}>
          <span className="font-medium w-full ">{text}</span>
        </Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (text, record) => (
        <span
          onClick={() => handleStatusModalOpen(record)}
          className={`font-medium text-white cursor-pointer px-2 py-1 rounded w-full ${
            text ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {text ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
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
    const token = localStorage.getItem("x-auth-token");
    try {
      await axios.patch(
        `/managers/${currentManagerId}`,
        { isActive: currentStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData((prevData) =>
        prevData.map((item) =>
          item.id === currentManagerId
            ? { ...item, isActive: currentStatus }
            : item
        )
      );
      message.success("Status muvaffaqiyatli yangilandi!");
      setIsStatusModalOpen(false);
    } catch (err) {
      console.error("Status yangilashda xatolik:", err);
      message.error("Status yangilashda xatolik yuz berdi.");
    }
  };

  return (
    <div
      className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
         py-8 px-2 min-h-[100%] transition-all 
          rounded-lg`}
    >
      <div className="flex flex-col sm:flex-row justify-between gap-4 items-center mb-4">
        <Button
          type="primary"
          className={`add-user w-[152px] h-[40px] ${
            theme
              ? "bg-[#1f2937] hover:!bg-[#374151]"
              : "bg-[#14B890] hover:!bg-[#129c7a]"
          }`}
          onClick={handleAddTask}
        >
          <FaPlus className="add-user-active !transform !transition-transform !duration-300 group-hover:!rotate-90 " />
          Employee add
        </Button>
        <input
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`border rounded-md px-4 py-2 w-full sm:w-64 outline-none ${
            theme
              ? "border-[#4b5563] bg-[#1f2937] text-white placeholder-white"
              : "border-gray-300 placeholder-gray-400"
          } focus:outline-none`}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data}
        pagination={false}
        className={theme ? "custom-table theme" : "custom-table"}
        rowClassName={() => (theme ? "dark-row" : "light-row")}
        locale={{
          emptyText: "Malumot topilmadi"
        }}
      />
      {search ? (
        ""
      ) : (
        <div className="flex items-center justify-between mt-7">
          <div>
            <h2 className={`${theme ? "text-white" : "text-black"} font-bold`}>
              {pageSize * (page - 1) + 1}–
              {Math.min(pageSize * page, totalOrders)}
              из {totalOrders}
            </h2>
          </div>
          <Pagination
            className={`flex justify-center items-center mt-2 ${
              theme ? "text-white" : "text-black"
            }`}
            pageSize={pageSize}
            total={totalOrders}
            current={page}
            onChange={(newPage) => setPage(newPage)}
          />

          <div>
            <select
              className={`outline-none w-[120px] h-[40px] rounded-md ${
                theme ? "bg-gray-800 text-white" : "bg-white text-black"
              }`}
              onChange={(e) =>
                handlePageSizeChange(parseInt(e.target.value, 10))
              }
              value={pageSize}
            >
              <option value="5">5 / стр.</option>
              <option value="10">10 / стр.</option>
              <option value="20">20 / стр.</option>
            </select>
          </div>
        </div>
      )}
      <Modal
        title={modalType === "add" ? "Add Manager" : "Edit Manager"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        className="max-w-sm w-full"
      >
        <div className="space-y-4">
          <div>
            <label
              htmlFor="taskName"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
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
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700"
            >
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
          {modalType === "add" ? (
            <div>
              <label
                htmlFor="status"
                className="block text-sm font-medium text-gray-700"
              >
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
          ) : (
            ""
          )}
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

export default Managers;
