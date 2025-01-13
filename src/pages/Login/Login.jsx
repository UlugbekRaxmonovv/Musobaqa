import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "../../api/index";
import { MdEmail } from 'react-icons/md'

const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post("/login", {
        email: values.email,
        password: values.password,
      });

      if (response.data?.accessToken) {
        localStorage.setItem("x-auth-token",response.data?.accessToken )
        toast.success("Muvaffaqiyatli kirildi");
        console.log(response.data?.accessToken);
        navigate("/dashboard/general");
      } else {
        toast.error("Login yoki parol notog'ri");
      }
    } catch (error) {
      console.error("Xato:", error);
      toast.error("Server bilan bog'lanishda xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
    toast.error("Iltimos, barcha kerakli maydonlarni to'g'ri to'ldiring");
  };

  return (
    <div className="w-full min-h-screen bg-[#fff] flex justify-center items-center p-4">
      <div className="w-full max-w-[400px] bg-white p-10 rounded-xl shadow-2xl">
        <Link to="/" className="block text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800">Tizimga kirish</h2>
        </Link>
        <Form
          name="basic"
          layout="vertical"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="space-y-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Username kiriting!" }]}
          >
            <Input
              placeholder="Username"
              className="h-12 text-lg"
              prefix={<MdEmail className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Parolni kiriting!" }]}
          >
            <Input.Password
              placeholder="Parol"
              className="h-12 text-lg"
              prefix={<LockOutlined className="text-gray-400" />}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              style={{ width: "100%" }}
              loading={loading}
              htmlType="submit"
              className="w-full h-12 text-lg bg-[#1C59F9] border-0 hover:from-blue-600 hover:to-purple-700"
            >
              {loading ? "Kirish..." : "Kirish"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

