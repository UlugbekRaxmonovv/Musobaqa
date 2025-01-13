import React, { useEffect, useState } from "react";
import { Button, Space, Table, Tag } from "antd";
import axios from "../../../api";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin7Line } from "react-icons/ri";

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
        />
        <Button
          className="bg-red-500 hover:bg-red-600 text-white"
          icon={<RiDeleteBin7Line />}
        />
      </div>
    ),
  },
];
const TableComponents = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
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

    fetchTasks();
  }, []);

  return <Table className="mt-[60px]" columns={columns} dataSource={data} />;
};
export default TableComponents;
