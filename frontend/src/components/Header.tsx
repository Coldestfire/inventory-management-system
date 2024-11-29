import { useDispatch } from 'react-redux';
import { collapsedSidebar, toggleSidebar } from '../provider/slice/Sidebar.slice';
import { AiOutlineMenu } from 'react-icons/ai';
import { IoLogOutOutline } from 'react-icons/io5';
import { removeUser, setUser } from '../provider/slice/user.slice';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useGetProfileQuery } from '../provider/queries/Auth.query';

const Header = () => {
  // Fetch user profile data using the query hook inside the component
  const { data: user, isLoading, isError } = useGetProfileQuery({});

  // Extract the first name (first word) from user.name
  const firstName = user ? user.user.name.split(' ')[0] : '';

  const dispatch = useDispatch();
  const sidebarHandler = () => dispatch(collapsedSidebar());
  const sidebarHandlerToggle = () => dispatch(toggleSidebar());
  const navigate = useNavigate();

  const logoutHandler = () => {
    try {
      localStorage.removeItem('token');
      // dispatch(setUser(null));
      dispatch(removeUser());
      navigate('/login');
      toast.success('Logged out successfully', { duration: 1000 });
    } catch (error: any) {
      console.log(error.message);
    }
  };

  // Conditional rendering based on loading and error states
  if (isLoading) {
    return <div></div>; // You can replace with a loading spinner
  }

  if (isError) {
    return <div>Error loading profile.</div>; // Handle error gracefully
  }

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
          <h1 className="text-4xl text-[#5B4636] mb-3 ml-2 tracking-wide font-stylish"><Link to="/">Caffy</Link></h1>
        </div>

        {/* Right Section: User name and Logout button */}
        <div className="flex items-center gap-4">
          {/* Display the first name if available */}
          {user && (
            <span className="text-lg font-medium bg-secondary border-black border-2 rounded-lg px-4 py-2 mr-3">
              Logged in as: {firstName}
            </span>
          )}
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
