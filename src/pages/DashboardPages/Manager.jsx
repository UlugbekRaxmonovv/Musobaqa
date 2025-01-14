import React, { useState, useEffect, useRef, useContext } from "react";
import { UserOutlined } from "@ant-design/icons";
import { Avatar, Layout, Menu, Dropdown, Space } from "antd";
import { Link, useNavigate } from "react-router-dom";
import DashboardContent from "../../components/content/Content";
import { FiMenu } from "react-icons/fi";
const { Header, Sider } = Layout;
import logo from "../../assets/images/logo.png";
import logo1 from "../../assets/images/logo1.svg";
import { MdOutlineAddTask } from "react-icons/md";
import { IoMdCheckboxOutline } from "react-icons/io";
import { TbUsersPlus } from "react-icons/tb";
import { LuLayoutDashboard } from "react-icons/lu";
import { HiOutlineUsers } from "react-icons/hi";
import axios from "../../api/index";
import { RiMoonLine, RiSunLine } from "react-icons/ri";
import { Context } from "../../components/darkMode/Context";
import { TfiStatsUp } from "react-icons/tfi";

function getItem(label, key, icon, onClick) {
  return {
    key,
    icon,
    label,
    onClick,
  };
}

const Manager = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, setTheme } = useContext(Context);
  const navigate = useNavigate();
  const sidebarRef = useRef(null);
  const [user, setUser] = useState(null);
  let token = localStorage.getItem("x-auth-token");
  let users = localStorage.getItem("user");
  useEffect(() => {
    axios
      .get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("x-auth-token");
    navigate("/signin");
  };

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        if (isMobile && !collapsed) {
          setCollapsed(true);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobile, collapsed]);

  const sidebarStyle = {
    position: isMobile ? "fixed" : "relative",
    height: "100vh",
    zIndex: 1001,
    left: collapsed && isMobile ? "-200px" : "0",
    transition: "all 0.3s ease-in-out",
    width: isMobile
      ? collapsed
        ? "0"
        : "200px"
      : collapsed
      ? "80px"
      : "200px",
  };

  const items = [
    getItem(
      "Statestika",
      "1",
      <TfiStatsUp
        style={{ color: theme ? "white" : "black", fontSize: "18px" }}
      />,
      () => {
        navigate("/dashboard/statestika");
        setCollapsed(!collapsed);
      }
    ),
    getItem(
      "General",
      "1",
      <LuLayoutDashboard
        style={{ color: theme ? "white" : "black", fontSize: "18px" }}
      />,
      () => {
        navigate("/dashboard/general");
        setCollapsed(!collapsed);
      }
    ),
    getItem(
      "BlockLanganar",
      "4",
      <IoMdCheckboxOutline
        style={{ color: theme ? "white" : "black", fontSize: "18px" }}
      />,
      () => {
        navigate("/dashboard/blockLanganar");
        setCollapsed(!collapsed);
      }
    ),
    getItem(
      "Employees",
      "5",
      <HiOutlineUsers
        style={{ color: theme ? "white" : "black", fontSize: "18px" }}
      />,
      () => {
        navigate("/dashboard/managers");
        setCollapsed(!collapsed);
      }
    ),

    getItem(
      "Managers",
      "3",
      <TbUsersPlus
        style={{ color: theme ? "white" : "black", fontSize: "18px" }}
      />,
      () => {
        navigate("/dashboard/employees");
        setCollapsed(!collapsed);
      }
    ),
    getItem(
      "Tasks",
      "2",
      <MdOutlineAddTask
        style={{ color: theme ? "white" : "black", fontSize: "18px" }}
      />,
      () => {
        navigate("/dashboard/tasks");
        setCollapsed(!collapsed);
      }
    ),
  ];

  const userMenuItems = [
    {
      key: "1",
      label: (
        <div className="flex items-center flex-col">
          <span className="text-sm">{users}</span>
        </div>
      ),
    },
    {
      key: "2",
      label: (
        <div className="flex items-center flex-col">
          <span className="text-sm" onClick={logout}>
            Logout
          </span>
        </div>
      ),
    },
  ];

  const getSelectedKey = () => {
    switch (location.pathname) {
      case "/dashboard/general":
        return "1";
      case "/dashboard/tasks":
        return "2";
      case "/dashboard/employees":
        return "3";
      case "/dashboard/blockLanganar":
        return "4";
      case "/dashboard/managers":
        return "5";
      default:
        return "1";
    }
  };

  return (
    <>
      <Layout className=" bg-[#F4F1EC]">
        <Sider
          onCollapse={(value) => setCollapsed(value)}
          style={{
            ...sidebarStyle,
            backgroundColor: theme ? "#1f2937" : "rgb(244,241,236)",
          }}
          ref={sidebarRef}
          className={`${
            theme ? "bg-[#1f2937] border-gray-700" : "bg-[rgb(244,241,236)]  "
          } border-gray-100 border-r-[1px]`}
        >
          <div className="flex justify-center items-center">
            <Link to="/dashboard/statestika" className="cursor-pointer">
              {theme ? (
                <img
                  src={logo1}
                  alt=""
                  className="w-[150px] h-[150px] -mt-10 object-contain rounded-full"
                />
              ) : (
                <img
                  src={logo}
                  alt=""
                  className="w-[150px] h-[150px] -mt-10 object-contain rounded-full"
                />
              )}
            </Link>
          </div>
          <Menu
            selectedKeys={[getSelectedKey()]}
            theme={theme ? "menu.theme" : "menu"}
            defaultSelectedKeys={[getSelectedKey()]}
            mode="inline"
            items={items.map((item) => ({
              ...item,
              label: (
                <div
                  className={`${
                    theme ? "text-white" : "text-black"
                  } text-[16px] font-poppins hover:text-blue-500 hover:font-semibold 
        transition-colors duration-300`}
                >
                  {item.label}
                </div>
              ),
            }))}
          />
        </Sider>

        <Layout>
          <Header
            className={`border-b-[1px] border-gray-100 px-4' ${
              theme ? "bg-[#1f2937] border-gray-700" : "bg-[rgb(244,241,236)]"
            }`}
          >
            <div className="flex justify-between items-center h-full">
              <div className="flex items-center gap-2 ">
                <div
                  className={`${
                    theme ? "bg-gray-700" : " bg-gray-200"
                  } cursor-pointer p-2 rounded-md   transition-colors`}
                  onClick={() => setCollapsed(!collapsed)}
                >
                  <FiMenu
                    className={`${
                      theme ? "text-white" : "text-black"
                    } text-xl font-bold cursor-pointer `}
                  />
                </div>
              </div>
              <div className="flex items-center justify-end gap-2">
                <div
                  className={`w-10 h-10 flex items-center justify-center rounded-full cursor-pointer transition-colors ${
                    theme ? "bg-gray-700" : "bg-gray-200"
                  }`}
                  onClick={() => setTheme(!theme)}
                >
                  {theme ? (
                    <RiMoonLine className="w-6 h-6 text-white translate-x-0" />
                  ) : (
                    <RiSunLine className="w-6 h-6 text-black translate-x-0" />
                  )}
                </div>

                <Space direction="vertical">
                  <Space wrap>
                    <Dropdown
                      menu={{ items: userMenuItems }}
                      placement="bottomLeft"
                    >
                      <Avatar
                        src={user?.imageUrl}
                        size="large"
                        icon={<UserOutlined />}
                        className={`${
                          theme
                            ? "text-white bg-gray-700"
                            : "text-black bg-gray-200"
                        }`}
                      />
                    </Dropdown>
                  </Space>
                </Space>
              </div>
            </div>
          </Header>
          <DashboardContent />
        </Layout>
      </Layout>
    </>
  );
};

export default Manager;
