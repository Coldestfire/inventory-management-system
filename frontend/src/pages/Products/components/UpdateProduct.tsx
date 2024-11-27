import * as yup from 'yup';
import { ErrorMessage, Field, Formik } from 'formik';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { toast } from 'sonner';
import { useGetProductQuery, useUpdateProductMutation } from '../../../provider/queries/Products.query';
import Loader from '../../../components/Loader';

const UpdateProduct = ({ visible, setVisible, _id }: any) => {
  const { isLoading, data } = useGetProductQuery(_id); // Fetch product data based on ID
  const [updateProduct, updateProductResponse] = useUpdateProductMutation();

  if (isLoading) {
    return <Loader />;
  }

 
  const validationSchema = yup.object({
    name: yup.string().required('Name is required'),
    price: yup.number().min(0, 'Price must be a positive number').required('Price is required'),
    stock: yup.number().min(0, 'Stock must be at least 0').required('Stock is required'),
    description: yup.string().required('Description is required'),
    lowStockThreshold: yup.number().min(0, 'Low stock threshold must be at least 0'),
  });

  const initialValues = {
    name: data.product.name,
    price: data.product.price,
    stock: data.product.stock,
    description: data.product.description,
    lowStockThreshold: data.product.lowStockThreshold || 10,
  };

  const onSubmitHandler = async (e: any, { setValues }: any) => {
    try {
        console.log("this is E: ",e); // Log the submitted form values
        console.log("this is data: ", _id); // Log the submitted form values

        

        // Make an API call to update the product with the new data and product ID
        const { data, error }: any = await updateProduct({ id : _id, data: e });

        // If there's an error in the response, show an error toast and return
        if (error) {
            toast.error(error.data.message);
            return;
        }

        // Update form fields with the new values after the successful update
        setValues({
            name: e.name,
            price: e.price,
            stock: e.stock,
            description: e.description,
            lowStockThreshold: e.lowStockThreshold || 10, // Default value if not provided
        });

        // Show a success toast with the returned message from the API
        toast.success(data.msg);

        // Optionally, you can reset the form, but for now, the form just closes
        setVisible(false);

    } catch (error: any) {
        console.log(error); // Log the error to the console

        // Show a toast with the error message if the API call fails
        toast.error(error.message);
    }
};


  return (
    <Dialog
      draggable={false}
      visible={visible}
      className="w-[90%] mx-auto lg:mx-0 lg:w-1/2"
      onHide={() => setVisible(false)}
      header="Update Product Details"
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
                placeholder="Enter Product Name"
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
