import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import Loader from '../../../components/Loader';
import { useGetConsumersQuery } from '../../../provider/queries/Users.query';

const ViewModel = ({ visible, setVisible, _id }: any) => {
  const { isLoading, data } = useGetConsumersQuery(_id);

  if (isLoading) {
    return <Loader />;
  }

  const user = data?.user || {};

  return (
    <Dialog
      draggable={false}
      visible={visible}
      className="w-[90%] mx-auto lg:mx-0 lg:w-1/2"
      onHide={() => setVisible(false)}
      header="View Consumer Details"
    >
      <div className="p-4 space-y-4">
        <div className="mb-3">
          <label className="font-bold text-gray-700">Name:</label>
          <p className="text-gray-800">{user.name || 'N/A'}</p>
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">Email:</label>
          <p className="text-gray-800">{user.email || 'N/A'}</p>
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">Mobile No:</label>
          <p className="text-gray-800">{user.mobile || 'N/A'}</p>
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">DOB:</label>
          <Calendar
            id="dob"
            value={new Date(user.dob || Date.now())}
            readOnlyInput
            className="w-full border-none bg-transparent outline-none"
            dateFormat="dd/mm/yy"
          />
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">Address:</label>
          <p className="text-gray-800">{user.address || 'N/A'}</p>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewModel;
