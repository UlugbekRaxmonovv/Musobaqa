import React, { useContext, useState } from "react";
import { Button, Input, Modal, Form, Select, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import TableComponents from "../table";
import axios from "../../../api";
import { FaPlus } from "react-icons/fa6";
import { Context } from "../../darkMode/Context";

const EmployeesComponents = () => {
  const [reflesh, setReflesh] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [form] = Form.useForm();
  const { theme } = useContext(Context);
  const toggleModal = () => {
    setOpenModal(!openModal);
  };

  const handleAddEmployee = async (values) => {
    const token = localStorage.getItem("x-auth-token");
    if (!token) {
      notification.error({
        message: "Xatolik",
        description: "Token topilmadi! Iltimos, tizimga qayta kiring.",
      });
      return;
    }

    try {
      const response = await axios.post(
        "/employees",
        {
          name: values.name,
          last_name: values.last_name,
          type: values.type,
          email: values.email,
          isActive: values.isActive,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 201) {
        notification.success({
          message: "Muvaffaqiyat",
          description: "Xodim muvaffaqiyatli qo‘shildi.",
        });
        setReflesh(!reflesh);
        form.resetFields();
        setOpenModal(false);
      }
    } catch (err) {
      notification.error({
        message: "Xatolik",
        description: err.response?.data || "Xatolik yuz berdi.",
      });
    }
  };

  return (
    <div className="">
      <div className="flex items-center justify-between gap-[20px] py-8 px-2">
        <Button
          onClick={toggleModal}
          type="primary"
          className={`add-user w-[152px] h-[40px] ${
            theme ? 'bg-[#1f2937] hover:!bg-[#374151]' : 'bg-[#14B890] hover:!bg-[#129c7a]'
          }`}
        >
          <FaPlus className="add-user-active !transform !transition-transform !duration-300 group-hover:!rotate-90 " />
          Manager add
        </Button>
        <Input
          type="search"
          className="w-[30%] h-[40px]"
          placeholder="Поиск по фамилии"
          prefix={<SearchOutlined />}
        />
      </div>

      <Modal
        title="Xodim Qo'shish"
        open={openModal}
        onCancel={() => setOpenModal(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleAddEmployee}
          initialValues={{
            isActive: true,
          }}
        >
          <Form.Item
            name="name"
            label="Ism"
            rules={[
              { required: true, message: "Iltimos, ismingizni kiriting!" },
            ]}
          >
            <Input placeholder="Ism" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Familiya"
            rules={[
              { required: true, message: "Iltimos, familiyangizni kiriting!" },
            ]}
          >
            <Input placeholder="Familiya" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Lavozim"
            rules={[
              { required: true, message: "Iltimos, lavozimingizni tanlang!" },
            ]}
          >
            <Select placeholder="Lavozimni tanlang">
              <Select.Option value="managers">Boshqaruvchilar</Select.Option>
              <Select.Option value="employees">Xodimlar</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              {
                required: true,
                message: "Iltimos, email manzilingizni kiriting!",
              },
              {
                type: "email",
                message: "Iltimos, to'g'ri email manzilini kiriting!",
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="isActive"
            label="Holat"
            valuePropName="checked"
            rules={[
              { required: true, message: "Iltimos, holatingizni tanlang!" },
            ]}
          >
            <Select placeholder="Holatni tanlang">
              <Select.Option value={true}>Faol</Select.Option>
              <Select.Option value={false}>Faol emas</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" className="w-full">
              Saqlash
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <TableComponents reflesh={reflesh} />
    </div>
  );
};

export default EmployeesComponents;

