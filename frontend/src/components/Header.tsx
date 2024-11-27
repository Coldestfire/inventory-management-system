import { useDispatch } from 'react-redux';
import { collapsedSidebar, toggleSidebar } from '../provider/slice/Sidebar.slice';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoLogOutOutline } from 'react-icons/io5';
import { removeUser } from '../provider/slice/user.slice';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Header = () => {
  const dispatch = useDispatch();
  const sidebarHandler = () => dispatch(collapsedSidebar());
  const sidebarHandlerToggle = () => dispatch(toggleSidebar());
  const navigate = useNavigate();

  const logoutHandler = () => {
    try {
      localStorage.removeItem('token');
      dispatch(removeUser());
      navigate('/login');
      toast.success('Logged out successfully', { duration: 1000 });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  return (
    <header className="py-4 shadow-md px-7 bg-secondary">
      <div className="flex items-center justify-between">
        {/* Left Section: Sidebar toggle and Title */}
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden"
            onClick={sidebarHandlerToggle}
          >
            <AiOutlineMenu className="text-2xl" />
          </button>
          <button
            className="hidden lg:flex"
            onClick={sidebarHandler}
          >
            <AiOutlineMenu className="text-2xl" />
          </button>
          <h1 className="text-4xl text-[#5B4636] mb-3 ml-2 tracking-wide font-stylish">Caffy</h1>
        </div>

        {/* Right Section: Logout button */}
        <div>
          <button
            title="Logout"
            className="lg:flex"
            onClick={logoutHandler}
          >
            <IoLogOutOutline className="text-2xl" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
