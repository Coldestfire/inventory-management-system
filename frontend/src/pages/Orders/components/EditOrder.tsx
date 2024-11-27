import { useState, useEffect } from 'react';
import { Formik, Field, FieldArray, ErrorMessage } from 'formik';
import * as yup from 'yup';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { useGetAllOrdersQuery,useGet , useUpdateByIdMutation } from '../../../provider/queries/Orders.query';
import Loader from '../../../components/Loader';
import { Dialog } from 'primereact/dialog';

const UpdateProduct = ({ visible, setVisible, id }) => {
  const [updateOrder, updateOrderResponse] = useUpdateByIdMutation();

  const { data: productData, isLoading: isProductLoading } = useGetAllOrdersQuery({ query: '', page: 1 });


  const order = orderData?.data?.find((o) => o._id === id);
  console.log("IDasd", order)


  const initialValues = {
    user: order?.consumer,
    items: order?.items.map((item) => ({
      productId: item.productId, // Retains object structure for dropdown
      quantity: item.quantity,
      status: item.status,
    })),
  };

    console.log("initialValues", initialValues)
  const validationSchema = yup.object({ 
    user: yup.object().required('User is required'),
    items: yup.array().of(
      yup.object({
        productId: yup.object().required('Product is required'),
        quantity: yup.number().min(1, 'Quantity must be at least 1').required('Quantity is required'),
        status: yup
          .string()
          .oneOf(['pending', 'shipped', 'delivered', 'cancelled'], 'Invalid status')
          .required('Status is required'),
      })
    ),
  });

  const onSubmitHandler = async (values) => {
    try {
      const updatedOrderData = {
        orderId: order._id, // Ensure this is a valid ObjectId string
        consumer: values.user._id, // Ensure the consumer's _id is a string
        items: values.items.map((item) => ({
          productId: item.productId._id, // Use the MongoDB product _id
          quantity: item.quantity,
          status: item.status,
        })),
      };

      console.log('UPDATED ORDER DATA:', updatedOrderData);

      const { data, error } = await updateOrder(updatedOrderData);
      if (error) {
        toast.error(error.data.message);
        return;
      }

      toast.success('Order updated successfully!');
      setVisible(false); // Close the dialog
    } catch (error) {
      console.error('Error updating the order:', error);
      toast.error('Error updating the order: ' + error.message);
    }
  };

  if (isProductLoading || isLoading) {
    return <Loader />;
  }

  return (
    <Dialog
    draggable={false}
    visible={visible}
    className="w-[90%] mx-auto lg:mx-0 lg:w-1/2"
    onHide={() => setVisible(false)}
    header="Update Order Details"
  >
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmitHandler}
    >
      {({ handleSubmit, isSubmitting }) => (
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-3">
            <label htmlFor="name">Name <span className="text-red-500">*</span></label>
            <Field
              name="name"
              id="name"
              type="text"
              placeholder="Choose Consumer"
              className="w-full my-2 border outline-none py-3 px-4"
            />
            <ErrorMessage name="name" component="p" className="text-red-500" />
          </div>

          <div className="mb-3">
            <label htmlFor="price">Price <span className="text-red-500">*</span></label>
            <Field
              name="price"
              id="price"
              type="number"
              placeholder="Enter Product Price"
              className="w-full my-2 border outline-none py-3 px-4"
            />
            <ErrorMessage name="price" component="p" className="text-red-500" />
          </div>

          <div className="mb-3">
            <label htmlFor="stock">Stock <span className="text-red-500">*</span></label>
            <Field
              name="stock"
              id="stock"
              type="number"
              placeholder="Enter Product Stock"
              className="w-full my-2 border outline-none py-3 px-4"
            />
            <ErrorMessage name="stock" component="p" className="text-red-500" />
          </div>

          <div className="mb-3">
            <label htmlFor="description">Description <span className="text-red-500">*</span></label>
            <Field
              name="description"
              id="description"
              as="textarea"
              rows={3}
              placeholder="Enter Product Description"
              className="w-full my-2 border outline-none py-3 px-4"
            />
            <ErrorMessage name="description" component="p" className="text-red-500" />
          </div>

          <div className="mb-3">
            <label htmlFor="lowStockThreshold">Low Stock Threshold</label>
            <Field
              name="lowStockThreshold"
              id="lowStockThreshold"
              type="number"
              placeholder="Enter Low Stock Threshold"
              className="w-full my-2 border outline-none py-3 px-4"
            />
            <ErrorMessage name="lowStockThreshold" component="p" className="text-red-500" />
          </div>

          <div className="flex justify-end">
            <Button
              loading={isSubmitting || updateProductResponse.isLoading}
              className="bg-accent text-white px-5 py-3 rounded-lg"
            >
              Update Product
            </Button>
          </div>
        </form>
      )}
    </Formik>
  </Dialog>
  );
};

export default UpdateProduct;
