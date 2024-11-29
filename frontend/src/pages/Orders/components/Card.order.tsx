import { useState } from 'react';
import { FaRegTrashAlt } from 'react-icons/fa';
import { toast } from 'sonner';
import { Button } from 'primereact/button';
import { BsPrinter } from 'react-icons/bs';
import { useDeleteOrderMutation } from '../../../provider/queries/Orders.query';
import { Loader } from 'lucide-react';
import ShowAndPrintModel from './ShowAndPrint.model';
import { useGetAllOrdersQuery } from '../../../provider/queries/Orders.query';
import EditOrder from './EditOrder';

const TableCard = ({ data, id }: any) => {
  const [DeleteOrder, DeleteOrderResponse] = useDeleteOrderMutation();
  const [visible, setVisible] = useState(false);

  // Fetch user data for the consumer
  const { isLoading: isOrderLoading, data: orderData } = useGetAllOrdersQuery({ query: '', page: 1 });

  const [editVisible, setEditVisible] = useState(false);
  
  if (isOrderLoading) {
    return <Loader />;
  }

  // Handle deletion of the order
  const deleteHandler = async (_id: string) => {
    try {
      const { data, error }: any = await DeleteOrder(_id);
      if (error) {
        toast.error(error.data.message);
        return;
      }
      toast.success(data.msg);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // Displaying the order items (product name and price)
  const orderItems = data?.items.map((item: any) => item.productId);

  return (
    <>
      <tr className="bg-white border-b">
        {/* Display Order ID */}
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
          {id}
        </th>

        {/* Display Consumer's Name and Email */}
        <td className="px-6 py-4">
          <p>{data?.consumer?.name}</p>
        </td>

        <td className="px-6 py-4">
          {data?.consumer?.email}
        </td>

        {/* Display Items */}
        <td className="px-6 py-4">
          <ul>
            {orderItems?.length > 0 &&
              orderItems.map((item: any, i: number) => (
                <li key={i}>
                 {i + 1}. {item?.name} - {data?.items[i].status}
                </li>
              ))}
          </ul>
        </td>

        {/* Actions */}
        <td className="px-6 py-4 flex space-x-2">
          {/* <Button
            onClick={() => setEditVisible(true)}
            title="Edit"
            className="p-4 bg-blue-500 text-white rounded-lg"
          >
            Edit
          </Button> */}

          <Button
            onClick={() => setVisible(!visible)}
            title="Print"
            className="p-4 bg-[#FF9800] hover:bg-[#F57C00] text-white rounded-lg"
          >
            <BsPrinter className="text-xl" />
          </Button>

          <Button
            loading={DeleteOrderResponse.isLoading}
            onClick={() => deleteHandler(data._id)}
            title="Delete"
            className="p-4 bg-[#F44336] hover:bg-[#D32F2F] text-white rounded-lg"
          >
            <FaRegTrashAlt className="text-xl" />
          </Button>
        </td>
      </tr>

      {/* Show and Print Modal */}
      <ShowAndPrintModel setVisible={setVisible} visible={visible} id={data._id} />

      {/* Edit Order Modal */}
      {/* <EditOrder  visible={editVisible}  setVisible={setEditVisible}id={data._id} /> */}
    </>
  );
};

export default TableCard;
