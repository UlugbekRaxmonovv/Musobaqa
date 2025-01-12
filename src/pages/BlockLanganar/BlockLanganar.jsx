import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";

import { Button, Input, Modal } from "antd";

import { SearchOutlined } from "@ant-design/icons";
import axios from "../../api/index";
// import antd table
import { Table } from "antd";



const BlockLanganar = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const columns = [
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
            onClick={showModal}
          />
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            icon={<RiDeleteBin7Line />}
          />
        </div>
      ),
    },
  ];



  useEffect(() => {
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
        setData(response.data);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        setError(err.response?.data || "Xatolik");
      }
    };

    fetchTasks();
  }, []);

  console.log(data);

  return (
    <div className="">
      {/* Modal*/}
      <Modal
        title="Basic Modal"
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      {/* Modal*/}

      <div className="blocked-users  flex flex-col gap-[20px] py-8 px-2">
        <Button
          type="primary"
          className=" add-user w-[152px]  h-[40px] bg-[#14B890] hover:!bg-[#129c7a]"
        >
          <FaPlus className="add-user-active !transform !transition-transform !duration-300 group-hover:!rotate-90 " />
          Hodim qo’shish
        </Button>

        <Input
          className="w-[30%] h-[40px]"
          placeholder="Поиск по фамилии"
          prefix={<SearchOutlined />}
        />

        <div className="table">
          <Table
            className=""
            columns={columns}
            dataSource={data}
            size="middle"
          />
        </div>
      </div>
    </div>
  );
};

export default BlockLanganar;
