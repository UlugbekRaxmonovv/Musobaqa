import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";

import { Button, Input, Modal, Pagination } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import axios from "../../api/index";
import { Table, Dropdown } from "antd";

const BlockLanganar = () => {
  const [data, setData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);

  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPage(1);
  };

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
        const response = await axios.get(
          `/managers?_limit=${pageSize}&_page=${page}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const filteredData = response?.data?.filter((item) => !item.isActive);
        setData(filteredData);
        setFilteredData(filteredData);
        setTotalOrders(response.headers["x-total-count"]);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
      }
    };

    fetchTasks();
  }, [page, pageSize]);

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
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="id"
          size="middle"
          pagination={false}
        />

        <div className="flex items-center justify-between mt-7">
          <div>
            <h2>
              {pageSize * (page - 1) + 1}–
              {Math.min(pageSize * page, totalOrders)}
              из {totalOrders}
            </h2>
          </div>

          <Pagination
            className="flex justify-center items-center mt-2"
            pageSize={pageSize}
            total={totalOrders}
            current={page}
            onChange={(newPage) => setPage(newPage)}
          />

          <div>
            <select
              className="outline-none w-[120px] h-[40px] rounded-md"
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
      </div>
    </div>
  );
};

export default BlockLanganar;
