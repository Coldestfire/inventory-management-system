import { ConfirmDialog } from 'primereact/confirmdialog';
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
  
  // console.log("Order items: ", orderData);
  // console.log("OrderData.DATA items: ", orderData?.data);
  console.log("DATA: ", data);

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

  console.log("ORDER ID : ", data._id);

  // Displaying the order items (product name and price)
  const orderItems = data?.items.map((item: any) => {
    // Assuming each item has a `productId` with product details
    return item.productId;
  });

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

        {/* Display Consumer's Email */}
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
                 {/* data?.items[i].status USED TO GET STATUS */}
                </li>
              ))}
          </ul>
        </td>


        {/* Actions */}
        <td className="px-6 py-4 flex space-x-2">

            {/* <button
        onClick={() => setEditVisible(true)}
        title="Edit"
        className="p-4 bg-blue-500 text-white rounded-sm"
      >
        Edit
      </button> */}


          <button
            onClick={() => setVisible(!visible)}
            title="View"
            className="p-4 bg-teal-500 text-white rounded-sm"
          >
            <BsPrinter className="text-xl" />
          </button>
          <Button
            loading={DeleteOrderResponse.isLoading}
            onClick={() => deleteHandler(data._id)}
            title="Delete"
            className="p-4 bg-red-500 text-white rounded-sm"
          >
            <FaRegTrashAlt className="text-xl" />
          </Button>

          {/* <EditOrder
    data={data}
    visible={editVisible}
    setVisible={setEditVisible}
  /> */}


        </td>
        

      </tr>

      {/* Show and Print Modal */}
      <ShowAndPrintModel id={data._id} visible={visible} setVisible={setVisible} />
      {console.log("DATA id: ", data._id, [id].toString())}
      {/* <ConfirmDialog id="order.queries" acceptClassName="" className=" " contentClassName="py-2 " closable /> */}
    </>
  );
};

export default TableCard;
