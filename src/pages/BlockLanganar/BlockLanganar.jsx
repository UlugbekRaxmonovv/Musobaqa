import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";

import { Button, Input, Modal } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "../../api/index";
import { Table, Dropdown } from "antd";

const BlockLanganar = () => {
  const [data, setData] = useState([]); 
  const [searchValue, setSearchValue] = useState(""); 
  const [filteredData, setFilteredData] = useState([]); 

  const unblock = async (id) => {
    if (!id) return;
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      await axios.patch(
        `/managers/${id}`,
        { isActive: true },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };

  const deleteUser = async (id) => {
    if (!id) return;
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
      return;
    }

    try {
      await axios.delete(`/managers/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const updatedData = data.filter((item) => item.id !== id);
      setData(updatedData);
      setFilteredData(updatedData);
    } catch (err) {
      console.error("Xatolik yuz berdi:", err);
    }
  };

  

  const items = (id) => [
    {
      key: "1",
      label: <button onClick={() => unblock(id)}>Blockdan ochish</button>,
    },
  ];
  const items2 = (id) => [
    {
      key: "1",
      label: (
        <button onClick={() => deleteUser(id)}>
          Xodimni o'chirib yuborish
        </button>
      ),
    },
  ];

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
          <Dropdown
            menu={{
              items: items(record.id),
            }}
            placement="bottomRight"
          >
            <Button
              className="bg-teal-500 hover:bg-teal-600 text-white"
              icon={<CiEdit />}
            />
          </Dropdown>

          {/* delete button  */}
          <Dropdown
            menu={{
              items: items2(record.id),
            }}
            placement="bottomRight"
          >
            <Button
              className="bg-red-500 hover:bg-red-600 text-white"
              icon={<RiDeleteBin7Line />}
            />
          </Dropdown>
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

        const filteredData = response?.data?.filter((item) => !item.isActive);
        setData(filteredData);
        setFilteredData(filteredData);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
      }
    };

    fetchTasks();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (value) {
      // Search qilish
      const searchResults = data.filter((item) =>
        item.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredData(searchResults);
    } else {

      setFilteredData(data);
    }
  };

  return (
    <div className="blocked-users flex flex-col gap-[20px] py-8 px-2">

      <Input
        className="w-[30%] h-[40px]"
        placeholder="Поиск по фамилии"
        prefix={<SearchOutlined />}
        value={searchValue}
        onChange={handleSearch}
      />

      <div className="table">
        <Table columns={columns} dataSource={filteredData} rowKey="id" size="middle" />
      </div>
    </div>
  );
};

export default BlockLanganar;
