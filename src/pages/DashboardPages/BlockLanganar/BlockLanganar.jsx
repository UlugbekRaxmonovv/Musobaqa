import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Modal, Table, Dropdown, Pagination } from "antd";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import axios from '../../../api/index'
import { Context } from "../../../components/darkMode/Context"; 

const BlockLanganar = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null); 
  const [selectedId, setSelectedId] = useState(null);
  const { theme } = useContext(Context);

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

      const filteredData = response?.data?.filter((item) => !item.isActive);
      setData(filteredData);
      setFilteredData(filteredData);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAction = async () => {
    if (!selectedId) return;
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      if (modalType === "unblock") {
        await axios.patch(
          `/managers/${selectedId}`,
          { isActive: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else if (modalType === "delete") {
        await axios.delete(`/managers/${selectedId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const updatedData = data.filter((item) => item.id !== selectedId);
      setData(updatedData);
      setFilteredData(updatedData);
      setIsModalOpen(false);
      setSelectedId(null);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      const searchResults = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(searchResults);
    } else {
      setFilteredData(data);
    }
  };

  const openModal = (type, id) => {
    setModalType(type);
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: <div className="text-center">{"№"}</div>,
      dataIndex: "number",
      render: (_, __, index) => <div className="text-center">{index + 1}</div>,
    },
    {
      title: "Ism-familiya",
      dataIndex: "name",
    },
    {
      title: "Turi",
      dataIndex: "type",
    },
    {
      title: "E-mail",
      dataIndex: "email",
    },
    {
      title: "",
      dataIndex: "actions",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white"
            icon={<CiEdit />}
            onClick={() => openModal("unblock", record.id)}
          />

          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            icon={<RiDeleteBin7Line />}
            onClick={() => openModal("delete", record.id)}
          />
        </div>
      ),
    },
  ];

  return (
  

 <>
      <div
        className={`${theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"} 
    py-8 px-2 min-h-[510px] transition-all 
    rounded-lg`}
      >
            <input
        className={`border rounded-md px-4 py-2 w-full sm:w-64 outline-none ${
          theme
            ? "border-[#4b5563] bg-[#1f2937] text-white placeholder-white"
            : "border-gray-300 placeholder-gray-400"
        } focus:outline-none`}
        placeholder="Ismi bo'yicha qidirish"
        prefix={<SearchOutlined />}
        value={searchValue}
        onChange={handleSearch}
      />
        <Table
          className={theme ? "custom-table theme" : "custom-table"}
          rowClassName={() => (theme ? "dark-row" : "light-row")}
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          size="middle"
          pagination={false}
          style={{marginTop:'20px'}}
          
        />

        <Pagination
          className="flex justify-center items-center mt-2"
          pageSize={pageSize}
          total={totalOrders}
          current={page}
          onChange={(newPage) => setPage(newPage)}
        />
      </div>

      <Modal
        title={
          modalType === "unblock"
            ? "Blockdan chiqarish"
            : "Xodimni o'chirib yuborish"
        }
        open={isModalOpen}
        onOk={handleAction}
        onCancel={() => setIsModalOpen(false)}
        okText="Ha"
        cancelText="Yo'q"
      >
        {modalType === "unblock"
          ? "Xodimni rostan ham blockdan chiqarishni xohlaysizmi?"
          : "Xodimni o'chirib yuborishni xohlaysizmi?"}
      </Modal>
 </>
  );
};

export default BlockLanganar;
