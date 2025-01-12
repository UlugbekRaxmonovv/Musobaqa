import React, { useState } from "react";
import { Button } from "antd";
import { Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import TableComponents from "../table";

const EmployesComponents = () => {
  const [openModal, setOpenModal] = useState(false);

  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  return (
    <div className="py-8 px-2">
      <div className="flex flex-col gap-8">
        <Button
          onClick={toggleModal}
          className=" w-[12%] bg-[rgb(20,184,144)] text-[#FFF] hover:!bg-[rgb(20,184,144)] border-none hover:!text-[#FFF]"
        >
          + Add Employee
        </Button>
        <Input
          className="w-[30%]"
          placeholder="Search by Last Name"
          prefix={<SearchOutlined />}
        />
      </div>

      <Modal
        title=" Add Employee"
        open={openModal}
        onCancel={() => setOpenModal(false)}
      >
        <p className="border-[1px] w-full mt-[20px]"></p>
        <div>
          <div className="mt-4">
            <label htmlFor="FirstName">FirstName</label>
            <Input
              className="my-2"
              type="text"
              id="FirstName"
              placeholder="FirstName"
            />
          </div>
          <div className="mt-4">
            <label htmlFor="LastName">LastName</label>
            <Input
              className="my-2"
              type="text"
              id="LastName"
              placeholder="LastName"
            />
          </div>

          <div className="mt-4">
            <label htmlFor="role">Select Role</label>
            <select
              className="w-full h-[30px] rounded-md my-2 border-[1px] border-gray-300 text-gray-600 outline-none "
              name="role"
              id="role"
            >
              <option value="managers">Managers</option>
              <option value="employees">Employes</option>
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="Email">Email</label>
            <Input
              className="my-2   "
              type="email"
              id="Email"
              placeholder="Email"
            />
          </div>
        </div>
      </Modal>
      <TableComponents />
    </div>
  );
};

export default EmployesComponents;
