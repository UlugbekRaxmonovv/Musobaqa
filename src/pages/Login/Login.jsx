import React, { useState } from "react";
import { Button, Form, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { LockOutlined } from "@ant-design/icons";
import toast from "react-hot-toast";
import axios from "../../api/index";
import { MdEmail } from "react-icons/md";
import { FaChevronLeft } from "react-icons/fa6";
import rasm from  '../../assets/images/lo1.png'

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
        localStorage.setItem("x-auth-token", response.data?.accessToken);
        localStorage.setItem("user", response.data?.user?.email);
        toast.success("Muvaffaqiyatli kirildi");
        console.log(response.data?.accessToken);
        navigate("/dashboard/statestika");
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
    <>
      <div className="bg-slate-50 ">
        <div className="flex  items-center px-4 gap-2 cursor-pointer">
          <FaChevronLeft className=" text-[12px] text-gray-600" />
          <p className="text-center text-[16px] text-gray-600">
            Вернуться на главную
          </p>
        </div>
        <div className="min-h-screen flex flex-col items-center justify-center px-4">
          <div className="w-full max-w-[320px] bg-white rounded-[20px] shadow-2xl">
            <div className="flex items-center justify-center border-b border-gray-100 py-4 bg-white rounded-t-[20px]">
              <div className="flex items-center">
             <img width={50} height={50} src={rasm} alt="" />
                <span className=" text-xl font-bold text-gray-900">
                  Сравни
                </span>
                
              </div>
            </div>

            <div className="px-6 py-4">
              <Link to="/" className="block text-center mb-6">
                <h2 className="text-xl font-bold text-center text-gray-900">
                  Вход и регистрация
                </h2>
                <p className="text-center text-[12px] text-gray-600 mt-2">
                  Введите ваш номер телефона. На него мы отправим код
                  подтверждения
                </p>
              </Link>

              <Form
                name="basic"
                layout="vertical"
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
                className="space-y-2"
              >
                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: "Введите номер телефона!" },
                  ]}
                >
                  <Input
                    placeholder="Телефон"
                    className="h-12 text-lg rounded-xl"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="black"
                    style={{ width: "100%" }}
                    loading={loading}
                    htmlType="submit"
                    className="w-full h-12 text-lg bg-blue-950 text-white rounded-xl -mt-2"
                  >
                    {loading ? "" : "Войти"}
                  </Button>
                  <p className="text-center text-[12px] text-gray-600 mt-2">
                    или войти через
                  </p>

                  <div className="flex justify-center space-x-4 py-3 px-4 mt-2">
                    <button className="p-2 border-[1px] rounded-lg  transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-6 h-6 fill-blue-600"
                      >
                        <path d="M15.073 2H8.938C3.332 2 2 3.333 2 8.927v6.136C2 20.667 3.323 22 8.927 22h6.136C20.667 22 22 20.677 22 15.073V8.938C22 3.332 20.677 2 15.073 2zm.74 14.702h-1.189c-.447 0-.578-.307-1.373-1.076-.698-.656-.969-.735-1.136-.735-.246 0-.319.044-.413.149-.092.105-.09.287-.09.531v.99c0 .223-.068.545-.992.545-1.285 0-2.53-.679-3.51-1.94-1.33-1.77-2.306-4.839-2.306-4.839s-.031-.078-.031-.199c0-.248.19-.384.438-.384h1.19c.328 0 .446.15.558.514.588 1.915 1.57 3.626 1.993 3.626.167 0 .245-.08.245-.518v-1.792c-.058-.98.431-1.109.431-1.482 0-.141-.112-.254-.254-.254-.225 0-1.203.09-2.47.09-.282 0-.369-.036-.369-.254 0-.26.822-3.026.958-3.497.09-.316.192-.446.526-.446h1.677c.372 0 .45.193.45.531v2.799c0 .298.135.394.225.394.168 0 .301-.112.59-.406.82-.836 1.427-2.138 1.427-2.138.09-.18.224-.315.44-.315h1.19c.26 0 .39.13.32.41-.136.541-1.462 2.494-1.462 2.494-.113.182-.169.298 0 .534.112.158.5.485.758.787.58.551 1.018 1.018 1.018 1.309 0 .223-.112.24-.279.24-.494 0-1.35-.758-1.838-1.385-.149-.205-.26-.298-.372-.298-.094 0-.149.044-.149.27v2.058c0 .305-.056.46.106.46.309 0 .958-.306 1.756-1.096.59-.578 1.099-1.353 1.099-1.353.09-.135.224-.226.39-.226h1.19c.372 0 .45.193.39.465-.09.406-1.056 1.755-1.733 2.435-.747.748-.884.823-.884 1.058 0 .223.167.316.39.316.56 0 1.212-.447 1.746-1.008.533-.56 1.008-1.203 1.008-1.203.112-.15.246-.24.435-.24z" />
                      </svg>
                    </button>

                    <button className="p-2 border-[1px] rounded-lg  transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="#EA4335"
                      >
                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                      </svg>
                    </button>

                    <button className="p-2 border-[1px] rounded-lg  transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5"
                        fill="#000"
                      >
                        <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.09997 22C7.78997 22.05 6.79997 20.68 5.95997 19.47C4.24997 17 2.93997 12.45 4.69997 9.39C5.56997 7.87 7.12997 6.91 8.81997 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
                      </svg>
                    </button>

                    <button className="p-2 border-[1px] rounded-lg  transition">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="w-5 h-5 fill-orange-500"
                      >
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.091 17.415c-.184.184-.48.184-.664 0l-3.427-3.427c-.184-.184-.48-.184-.664 0l-3.427 3.427c-.184.184-.48.184-.664 0l-.664-.664c-.184-.184-.184-.48 0-.664l3.427-3.427c-.184-.184-.184-.48 0-.664l-3.427-3.427c-.184-.184-.184-.48 0-.664l.664-.664c.184-.184.48-.184.664 0l3.427 3.427c.184.184.48.184.664 0l3.427-3.427c.184-.184.48-.184.664 0l.664.664c.184.184.184.48 0 .664L14.427 12c.184.184.184.48 0 .664l3.427 3.427c.184.184.184.48 0 .664l-.664.664z" />
                      </svg>
                    </button>
                  </div>
                </Form.Item>
              </Form>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-blue-500 cursor-pointer text-center">
              Войти по почте
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
