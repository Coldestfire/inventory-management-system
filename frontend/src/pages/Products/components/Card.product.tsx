import { useState } from 'react';
import { useDeleteProductMutation } from '../../../provider/queries/Products.query';
import { FaRegEdit, FaRegTrashAlt, FaEye } from "react-icons/fa";
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import UpdateProduct from './UpdateProduct';
import ViewProduct from './ViewProduct'; // Import the ViewProduct component
import { LuView } from 'react-icons/lu';

const TableCard = ({ data, id }: any) => {
  const [DeleteProduct, DeleteProductResponse] = useDeleteProductMutation();
  const [visibleUpdate, setVisibleUpdate] = useState(false); // State to control the visibility of the UpdateProduct modal
  const [visibleView, setVisibleView] = useState(false); // State to control the visibility of the ViewProduct modal

  // Delete handler for removing a product
  const deleteHandler = async (_id: string) => {
    try {
      const { data, error }: any = await DeleteProduct(_id);
      if (error) {
        toast.error(error.data.message);
        return;
      }
      toast.success("Product deleted", { duration: 1000 });
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  // Toggle the visibility of the UpdateProduct modal when the Update button is clicked
  const showUpdateModal = () => {
    setVisibleUpdate(true); // Open the UpdateProduct modal
  };

  // Toggle the visibility of the ViewProduct modal when the View button is clicked
  const showViewModal = () => {
    setVisibleView(true); // Open the ViewProduct modal
  };

  return (
    <>
      <tr className="bg-white border-b">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{id}</th>
        <td className="px-6 py-4">{data.name}</td>
        <td className="px-6 py-4">&#8377;{data.price}</td>
        <td className="px-6 py-4">{data.stock}</td>
        <td className="px-6 py-4">

          {/* View button */}
          <Button
            onClick={showViewModal}
            title="View"
            className="p-4 bg-[#4CAF50] hover:bg-[#388E3C] text-white rounded-md mx-2"
          >
           <LuView className="text-xl" />
          </Button> 

          {/* Update button */}
          <Button
            onClick={showUpdateModal}
            title="Update"
            className="p-4 bg-[#2196F3] hover:bg-[#1976D2] text-white rounded-lg mx-2 mt-2"
          >
            <FaRegEdit className="text-xl" />
          </Button>

          {/* Delete button */}
          <Button
            loading={DeleteProductResponse.isLoading}
            onClick={() => deleteHandler(data._id)}
            title="Delete"
            className="p-4 bg-[#F44336] hover:bg-[#D32F2F] text-white rounded-lg mx-2 mt-2"
          >
            <FaRegTrashAlt className="text-xl" />
          </Button>

          {/* UpdateProduct modal */}
          <UpdateProduct visible={visibleUpdate} setVisible={setVisibleUpdate} _id={data._id} />

          {/* ViewProduct modal */}
          <ViewProduct visible={visibleView} setVisible={setVisibleView} _id={data._id} />
        </td>
      </tr>
    </>
  );
};

export default TableCard;
