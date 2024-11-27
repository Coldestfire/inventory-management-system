import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { useDispatch, useSelector } from 'react-redux';
import { SidebarSlicePath, toggleSidebar } from '../provider/slice/Sidebar.slice';
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FiUser } from "react-icons/fi";
import { MdOutlineReceiptLong } from "react-icons/md";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { FiBox } from "react-icons/fi";
import { Link } from 'react-router-dom';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  const selector = useSelector(SidebarSlicePath);
  const dispatch = useDispatch();

  return (
    <>
      <div className="flex bg-primary">
        {/* Sidebar with full height and background color */}
        <Sidebar
          collapsed={selector.collapsed}
          breakPoint="lg"
          toggled={selector.toggle}
          className="h-screen text-black"
          backgroundColor='#D6C0B3'
        >
          
          <Menu>
            {/* Toggle button */}
            <MenuItem
              className="lg:hidden flex justify-end"
              onClick={() => dispatch(toggleSidebar())}
            >
              {selector.toggle ? (
                <IoIosArrowDropleft className="text-2xl" />
              ) : (
                <IoIosArrowDropright className="text-2xl" />
              )}
            </MenuItem>

            {/* Menu items */}
            <MenuItem
              component={<Link to="/" />}
              icon={<MdOutlineSpaceDashboard className="text-2xl" />}
            >
              Dashboard
            </MenuItem>
            
            <MenuItem
              component={<Link to="/user" />}
              icon={<FiUser className="text-2xl" />}
            >
              Users
            </MenuItem>
            <MenuItem
              component={<Link to="/products" />}
              icon={<FiBox className="text-2xl" />}
            >
              Products
            </MenuItem>

            <MenuItem
              component={<Link to="/orders" />}
              icon={<MdOutlineReceiptLong className="text-2xl" />}
            >
              Orders
            </MenuItem>
          </Menu>
        </Sidebar>

        {/* Main content area */}
        <div className="w-full">{children}</div>
      </div>
    </>
  );
};

export default MainLayout;
