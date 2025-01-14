import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Table,
  notification,
  Modal,
  Input,
  Select,
  Pagination,
} from "antd";
import axios from "../../../api";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";
import { Context } from "../../darkMode/Context";

const TableComponents = ({ reflesh, searchdata }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { theme } = useContext(Context);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalOrders, setTotalOrders] = useState(0);
  const [editedEmployeeData, setEditedEmployeeData] = useState({
    name: "",
    email: "",
    type: "",
  });



  const handlePageSizeChange = (value) => {
    setPageSize(value);
    setPage(1);
  };



  const columns = [
    {
      title: <div className="text-center">{"№"}</div>,
      width: 20,
      render: (_, record, index) => (
        <div className="text-center w-full">{index + 1}</div>
      ),
    },
    {
      title: "FullName",
      dataIndex: "name",
      key: "fullName",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "E-mail",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div className="flex items-center gap-4">
          <Button
            className="bg-teal-500 hover:bg-teal-600 text-white"
            icon={<CiEdit />}
            onClick={() => handleEdit(record)}
          />
          <Button
            className="bg-red-500 hover:bg-red-600 text-white"
            icon={<RiDeleteBin7Line />}
            onClick={() => handleDelete(record.id)}
          />
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchEmployees = async () => {
      const token = localStorage.getItem("x-auth-token");
      if (!token) {
        console.error("Token topilmadi! Iltimos, tizimga qayta kiring.");
        return;
      }

      try {
        let api = searchdata
          ? `/employees?name_like=${searchdata}`
          : `/employees?_limit=${pageSize}&_page=${page}`;
        const response = await axios.get(api, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setData(response.data);
        setTotalOrders(response.headers["x-total-count"]);
      } catch (err) {
        console.error("Xatolik yuz berdi:", err);
        setError(err.response?.data || "Xatolik");
      }
    };

    fetchEmployees();
  }, [reflesh, searchdata, page, pageSize]);

  const handleDelete = (id) => {
    
    if (!id) {
      notification.error({
        message: "Xatolik",
        description: "Xodimning ID raqami topilmadi.",
      });
      return;
    }

    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      notification.error({
        message: "Xatolik",
        description: "Token topilmadi! Iltimos, tizimga qayta kiring.",
      });
      return;
    }

    Modal.confirm({
      title: "Xodimni o'chirishni tasdiqlaysizmi?",
      content: "Ushbu xodimni o'chirishni xohlaysizmi?",
      okText: "Ha",
      cancelText: "Yo'q",
      onOk: async () => {
        try {
          const response = await axios.delete(`/employees/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

          if (response.status === 200) {
            setData(data.filter((item) => item.id !== id));
            notification.success({
              message: "Muvaffaqiyat",
              description: "Xodim muvaffaqiyatli o'chirildi.",
            });
          }
        } catch (err) {
          console.error("Error during deletion:", err);
          notification.error({
            message: "Xatolik",
            description: err.response?.data || "Xatolik yuz berdi.",
          });
        }
      },
    });
  };

  const handleEdit = (employee) => {
    setEditingEmployee(employee);
    setEditedEmployeeData({
      name: employee.name,
      email: employee.email,
      type: employee.type,
    });
    setIsModalVisible(true);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      notification.error({
        message: "Xatolik",
        description: "Token topilmadi! Iltimos, tizimga qayta kiring.",
      });
      return;
    }

    try {
      const response = await axios.put(
        `/employees/${editingEmployee.id}`,
        editedEmployeeData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedData = data.map((item) =>
          item.id === editingEmployee.id
            ? { ...item, ...editedEmployeeData }
            : item
        );
        setData(updatedData);
        notification.success({
          message: "Muvaffaqiyat",
          description: "Xodim ma'lumotlari muvaffaqiyatli yangilandi.",
        });
        setIsModalVisible(false);
      }
    } catch (err) {
      console.error("Error during editing:", err);
      notification.error({
        message: "Xatolik",
        description: err.response?.data || "Xatolik yuz berdi.",
      });
    }
  };

  return (
    <div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        pagination={false}
        className={theme ? "custom-table theme" : "custom-table"}
        rowClassName={() => (theme ? "dark-row" : "light-row")}
      />

      {searchdata ? (
        ""
      ) : (
        <div className="flex items-center justify-between mt-7">
          <div>
            <h2 className={`${theme ? "text-white" : "text-black"} font-bold`}>
              {pageSize * (page - 1) + 1}–
              {Math.min(pageSize * page, totalOrders)} из {totalOrders}
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
                handlePageSizeChange(parseInt(Number(e.target.value)))
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
        title="Xodimni tahrirlash"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="1">FirstName</label>
          <Input
            placeholder="Full Name"
            value={editedEmployeeData.name}
            onChange={(e) =>
              setEditedEmployeeData({
                ...editedEmployeeData,
                name: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="2">Email</label>
          <Input
            placeholder="Email"
            value={editedEmployeeData.email}
            onChange={(e) =>
              setEditedEmployeeData({
                ...editedEmployeeData,
                email: e.target.value,
              })
            }
          />
        </div>

        <div className="flex flex-col gap-2 mt-4">
          <label htmlFor="3">Role</label>

          <Select
            placeholder="Select Type"
            value={editedEmployeeData.type}
            onChange={(value) =>
              setEditedEmployeeData({
                ...editedEmployeeData,
                type: value,
              })
            }
            style={{ width: "100%" }}
          >
            <Select.Option value="Manager">Manager</Select.Option>
            <Select.Option value="Xodimlar">Xodimlar</Select.Option>
          </Select>
        </div>
      </Modal>
    </div>
  );
};

export default TableComponents;
