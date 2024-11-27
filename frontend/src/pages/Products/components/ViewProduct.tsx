import { Dialog } from 'primereact/dialog';
import { useGetProductQuery } from '../../../provider/queries/Products.query'; // Assuming useGetProductQuery fetches product data
import Loader from '../../../components/Loader';

const ViewProduct = ({ visible, setVisible, _id }: any) => {
  const { isLoading, data } = useGetProductQuery(_id); // Fetch product data based on ID

  if (isLoading) {
    return <Loader />;
  }

  const product = data?.product || {}; // Destructure the product data

  return (
    <Dialog
      draggable={false}
      visible={visible}
      className="w-[90%] mx-auto lg:mx-0 lg:w-1/2"
      onHide={() => setVisible(false)}
      header="View Product Details"
    >
      <div className="p-4 space-y-4">
        <div className="mb-3">
          <label className="font-bold text-gray-700">Name:</label>
          <p className="text-gray-800">{product.name || 'N/A'}</p>
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">Price:</label>
          <p className="text-gray-800">&#8377;{product.price || 'N/A'}</p>
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">Stock:</label>
          <p className="text-gray-800">{product.stock || 'N/A'}</p>
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">Description:</label>
          <p className="text-gray-800">{product.description || 'N/A'}</p>
        </div>
        <div className="mb-3">
          <label className="font-bold text-gray-700">Low Stock Threshold:</label>
          <p className="text-gray-800">{product.lowStockThreshold || 'N/A'}</p>
        </div>
      </div>
    </Dialog>
  );
};

export default ViewProduct;
