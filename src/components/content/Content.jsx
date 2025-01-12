import React from 'react';
import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
const { Content } = Layout;


const DashboardContent = () => {

  return (
    <Content
      style={{
        padding: 14,
        overflowY: 'auto',
        background: '#F4F1EC',
      }}
    >
     <Outlet/>
    </Content>
  );
};

export default DashboardContent;