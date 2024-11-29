import { confirmDialog, ConfirmDialog } from 'primereact/confirmdialog';
import { useState } from 'react';
import { FaRegEdit, FaRegTrashAlt } from 'react-icons/fa';
import { LuView } from 'react-icons/lu';
import { useDeleteConsumerMutation } from '../../../provider/queries/Users.query';
import { toast } from 'sonner';
import { Button } from 'primereact/button';
import UpdateModel from './UpdateModel.user';
import ViewModel from './ViewModel.user';

const TableCard = ({ data, id }: any) => {
  const [DeleteConsumer, DeleteConsumerResponse] = useDeleteConsumerMutation();

  console.log("data_id : ", data._id)

  const [visible, setVisible] = useState(false);
  const [viewVisible, setViewVisible] = useState(false);

  const deleteHandler = (_id: string) => {
    confirmDialog({
      message: 'Do you want to delete this record?',
      header: 'Delete Confirmation',
      icon: 'pi pi-info-circle',
      defaultFocus: 'reject',
      acceptClassName: 'p-button-danger mx-2',
      rejectClassName: 'p-button-secondary mx-2',
      accept: async () => {
        console.log("accept for " + _id);

        try {
          const { data, error }: any = await DeleteConsumer(_id);

          if (error) {
            toast.error(error.data.message);
            return;
          }
          toast.success(data.msg);
        } catch (e: any) {
          toast.error(e.message);
        }
      },
      reject: () => {
        console.log("reject for " + _id);
      },
    });
  };

  return (
    <>
      <tr className="bg-white border-b">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          {id}
        </th>
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          {data.name}
        </th>
        <td className="px-6 py-4">{data.email}</td>
        <td className="px-6 py-4">{data.mobile}</td>
        <td className="px-6 py-4">
          <button
            onClick={() => setViewVisible(!viewVisible)}
            title="View"
            className="p-4 bg-[#4CAF50] text-white rounded-md mx-2 hover:bg-[#388E3C]" 
          >
            <LuView className="text-xl" />
          </button>
          <button
            onClick={() => setVisible(!visible)}
            title="Edit"
            className="p-4 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-md mx-2 mt-2"
          >
            <FaRegEdit className="text-xl" />
          </button>
          <Button
            loading={DeleteConsumerResponse.isLoading}
            onClick={() => deleteHandler(data._id)}
            title="Delete"
            className="p-4 bg-[#F44336] hover:bg-[#D32F2F] text-white rounded-md mx-2 mt-2"
          >
            <FaRegTrashAlt className="text-xl" />
          </Button>
        </td>
      </tr>
      <ViewModel visible={viewVisible} setVisible={setViewVisible} _id={data._id} />
      <UpdateModel visible={visible} setVisible={setVisible} _id={data._id} />

      <ConfirmDialog acceptClassName="" className="" contentClassName="py-2" closable />
    </>
  );
};

export default TableCard;
