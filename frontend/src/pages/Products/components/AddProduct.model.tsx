import { Dialog } from 'primereact/dialog';
import { ErrorMessage, Field, Formik } from 'formik';
import { toast } from 'sonner';
import * as yup from 'yup';
import { Button } from 'primereact/button';
import Loader from '../../../components/Loader';
import { useCreateProductMutation} from '../../../provider/queries/Products.query'; // <-- Import here

const AddProductModel = ({ visible, setVisible }: any) => {
  const [createProduct, { isLoading, error }] = useCreateProductMutation();


  
  
  if (isLoading) {
    return <Loader />;
  }

  const validationSchema = yup.object({
    name: yup.string().required("Product name is required"),
    price: yup.number().required("Price is required").min(0, "Price must be a positive number"),
    stock: yup.number().required("Stock is required").min(0, "Stock must be a positive number"),
    description: yup.string().optional(),
  });

  const initialValues = {
    name: '',
    price: '',
    stock: '',
    description: '',
  };

  const onSubmitHandler = async (e: any, { resetForm }: any) => {
    try {
      const payload = {
        name: e.name,
        price: e.price,
        stock: e.stock,
        lowStockThreshold: e.lowStockThreshold,
        description: e.description,
      };

      console.log("Payload to be sent: ", payload);

      const { data } = await createProduct(payload);

      console.log("Data received from backend: ", data);

      if (data) {
        toast.success("Product Created Successfully");
        resetForm();
        setVisible(false);
      }
    } catch (e: any) {
      toast.error(error?.data?.message || e.message);
    }
  };

  return (
    <Dialog draggable={false} header="Add Product" position="top" visible={visible} className="w-full md:w-[70%] lg:w-[60%]" onHide={() => setVisible(false)}>
      <Formik onSubmit={onSubmitHandler} initialValues={initialValues} validationSchema={validationSchema}>
        {({ values, setFieldValue, handleSubmit }) => (
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-3">
              <label htmlFor="name">Product Name <span className="text-red-500 text-sm">*</span></label> 
              <Field
                name="name"
                type="text"
                className="w-full my-2 border outline-none py-3 px-4"
                placeholder="Enter Product Name"
              />
              <ErrorMessage name="name" className="text-red-500 capitalize" component="p" />
            </div>

            <div className="mb-3">
              <label htmlFor="price">Price <span className="text-red-500 text-sm">*</span></label>
              <Field 
                name="price" 
                type="number" 
                className="w-full my-2 border outline-none py-3 px-4"
                placeholder="Enter Product Price"
              />
              <ErrorMessage name="price" className="text-red-500 capitalize" component="p" />
            </div>

            <div className="mb-3">
              <label htmlFor="stock">Stock <span className="text-red-500 text-sm">*</span></label>
              <Field 
                name="stock" 
                type="number" 
                className="w-full my-2 border outline-none py-3 px-4"
                placeholder="Enter Product Stock"
              />
              <ErrorMessage name="stock" className="text-red-500 capitalize" component="p" />
            </div>

            <div className="mb-3">
              <label htmlFor="stock">Low Stock Threshold</label>
              <Field 
                name="lowStockThreshold" 
                type="number" 
                className="w-full my-2 border outline-none py-3 px-4"
                placeholder="Enter Low Stock Threshold"
              />
              <ErrorMessage name="stock" className="text-red-500 capitalize" component="p" />
            </div>

            <div className="mb-3">
              <label htmlFor="description">Description</label>
              <Field 
                name="description" 
                as="textarea" 
                className="w-full my-2 border outline-none py-3 px-4"
                placeholder="Enter Product Description"
              />
            </div>

            <div className="flex justify-end">
              <Button className="text-white px-5 bg-accent py-3 text-center rounded-lg">
                {isLoading ? "Creating..." : "Add Product"}
              </Button>
            </div>
          </form>
        )}
      </Formik>
    </Dialog>
  );
};

export default AddProductModel;
