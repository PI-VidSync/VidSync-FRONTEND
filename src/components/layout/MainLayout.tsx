import { Outlet } from 'react-router-dom';
import MainHeader from '../headers/MainHeader';

const MainLayout = () => {
  return (
    <>
      <MainHeader />
      <Outlet />
    </>
  );
};

export default MainLayout;