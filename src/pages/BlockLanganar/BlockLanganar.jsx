import React from "react";
import { FaPlus } from "react-icons/fa6";
import { Button, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

// import antd table
import { Table } from "antd";
const columns = [
  {
    title: "Name",
    dataIndex: "name",
  },
  {
    title: "Age",
    dataIndex: "age",
  },
  {
    title: "Address",
    dataIndex: "address",
  },
];
const data = [
  {
    key: "1",
    name: "John Brown",
    age: 32,
    address: "New York No. 1 Lake Park",
  },
  {
    key: "2",
    name: "Jim Green",
    age: 42,
    address: "London No. 1 Lake Park",
  },
  {
    key: "3",
    name: "Joe Black",
    age: 32,
    address: "Sydney No. 1 Lake Park",
  },
];

const BlockLanganar = () => {
  return (
    <div className="">
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
          <Table columns={columns} dataSource={data} size="middle" />
        </div>
      </div>
    </div>
  );
};

export default BlockLanganar;
