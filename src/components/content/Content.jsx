import React, { useContext } from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Context } from '../darkMode/Context';
const { Content } = Layout;


const DashboardContent = () => {
  const { theme } = useContext(Context);
  return (
    <Content
      style={{
        padding: 14,
        overflowY: 'auto',
        background: '#F4F1EC',
      }}
      className={`Content ${theme ? 'theme' : ''} h-full`}
    >
     <Outlet/>
    </Content>
  );
};

export default DashboardContent;