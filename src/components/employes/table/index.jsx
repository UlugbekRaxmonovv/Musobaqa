import React, { useEffect, useState } from "react";
import { Button, Table, notification, Modal, Input, Select } from "antd";
import axios from "../../../api";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";

const TableComponents = ({ reflesh }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editedEmployeeData, setEditedEmployeeData] = useState({
    name: "",
    email: "",
    type: "",
  });

  const columns = [
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
        const response = await axios.get("/employees", {
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

    fetchEmployees();
  }, [reflesh]);

  const handleDelete = async (id) => {
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
    <div className="px-2">
      <Table columns={columns} dataSource={data} rowKey="id" />

      <Modal
        title="Xodimni tahrirlash"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
      >
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
      </Modal>
    </div>
  );
};

export default TableComponents;
