import React, { useContext, useEffect, useState } from "react";
import { Button, Input, Modal, Table, Pagination } from "antd";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { SearchOutlined } from "@ant-design/icons";
import axios from "../../../api/index";
import { Context } from "../../../components/darkMode/Context";

const BlockLanganar = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalItems, setTotalItems] = useState(0);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const { theme } = useContext(Context);

  const fetchBlockedManagers = async () => {
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

      const blockedUsers = response.data.filter((item) => !item.isActive);
      setTotalItems(blockedUsers.length);
      const paginatedData = blockedUsers.slice(
        (page - 1) * pageSize,
        page * pageSize
      );
      setData(paginatedData);
      setFilteredData(paginatedData);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  useEffect(() => {
    fetchBlockedManagers();
  }, [page, pageSize]);

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
      fetchBlockedManagers();
      setIsModalOpen(false);
    } catch (error) {
      console.error("Xatolik yuz berdi:", error);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    const searchResults = data.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(searchResults);
  };

  const openModal = (type, id) => {
    setModalType(type);
    setSelectedId(id);
    setIsModalOpen(true);
  };

  const columns = [
    {
      title: "№",
      render: (_, __, index) => pageSize * (page - 1) + index + 1,
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
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            className="bg-teal-500 text-white"
            icon={<CiEdit />}
            onClick={() => openModal("unblock", record.id)}
          />
          <Button
            className="bg-red-500 text-white"
            icon={<RiDeleteBin7Line />}
            onClick={() => openModal("delete", record.id)}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className={`py-8 px-2 min-h-[510px] ${
        theme ? "bg-gray-900" : "bg-[rgb(244,241,236)]"
      }`}
    >
      <Input
        placeholder="Ismi bo'yicha qidirish"
        prefix={<SearchOutlined />}
        value={searchValue}
        onChange={handleSearch}
        className={`border px-4 py-2 w-full sm:w-64 ${
          theme ? "bg-[#1f2937] text-white" : "bg-white"
        }`}
      />
      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        pagination={false}
        style={{ marginTop: 20 }}
      />
      {searchValue ? (
        ""
      ) : (
        <div className="flex justify-between mt-4">
          <span className={`${theme ? "text-white" : "text-black"} font-bold`}>
            {" "}
            {`${pageSize * (page - 1) + 1}–${Math.min(
              pageSize * page,
              totalItems
            )} из ${totalItems}`}
          </span>
          <Pagination
            pageSize={pageSize}
            total={totalItems}
            current={page}
            onChange={(newPage) => setPage(newPage)}
          />
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className={`outline-none w-[120px] h-[40px] rounded-md ${
              theme ? "bg-gray-800 text-white" : "bg-white text-black"
            }`}
          >
            <option value={5}>5 / стр.</option>
            <option value={10}>10 / стр.</option>
            <option value={20}>20 / стр.</option>
          </select>
        </div>
      )}
      <Modal
        title={
          modalType === "unblock" ? "Blockdan chiqarish" : "Xodimni o'chirish"
        }
        open={isModalOpen}
        onOk={handleAction}
        onCancel={() => setIsModalOpen(false)}
      >
        {modalType === "unblock"
          ? "Xodimni rostan ham blockdan chiqarishni xohlaysizmi?"
          : "Xodimni o'chirib yuborishni xohlaysizmi?"}
      </Modal>
    </div>
  );
};

export default BlockLanganar;
