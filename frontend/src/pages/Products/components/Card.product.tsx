import { useState } from 'react';
import { useDeleteProductMutation } from '../../../provider/queries/Products.query';
import { BsPrinter } from "react-icons/bs";
import { FaRegTrashAlt } from "react-icons/fa";
import { Button } from 'primereact/button';
import { confirmDialog } from 'primereact/confirmdialog'; // Import the function
import { toast } from 'sonner';

const TableCard = ({ data, id }: any) => {
  const [DeleteProduct, DeleteProductResponse] = useDeleteProductMutation();

  
  const [visible, setVisible] = useState(false);

  const deleteHandler = async (_id: string) => {
    console.log(_id)
    try {
      const { data, error }: any = await DeleteProduct(_id);
      if (error) {
        toast.error(error.data.message);
        return;
      }
      toast.success("Product deleted", {duration:1000});
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <>
      <tr className="bg-white border-b">
        <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">{id}</th>
        <td className="px-6 py-4">{data.name}</td>
        <td className="px-6 py-4">&#8377;{data.price}</td>
        <td className="px-6 py-4">{data.stock}</td>
        <td className="px-6 py-4">
          <Button loading={DeleteProductResponse.isLoading} onClick={() => deleteHandler(data._id)} title="Delete" className="p-4 bg-red-500 text-white rounded-lg mx-2"><FaRegTrashAlt className="text-xl" /></Button>
        </td>
      </tr>
    </>
  );
};

export default TableCard;