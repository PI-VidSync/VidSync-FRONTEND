import { Outlet } from 'react-router-dom';
import MainHeader from '../headers/MainHeader';
import './MainLayout.scss';

const MainLayout = () => {
  return (
    <div className='main-layout'>
      <MainHeader />
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;