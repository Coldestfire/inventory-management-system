import { Dialog } from 'primereact/dialog';
import { ErrorMessage, Field, Formik, FieldArray } from 'formik';  
import { toast } from 'sonner';
import * as yup from 'yup';
import { useGetForSearchUserQuery } from '../../../provider/queries/Users.query';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { FaTrashAlt } from "react-icons/fa";
import Loader from '../../../components/Loader';
import { useCreateOrderMutation } from '../../../provider/queries/Orders.query';
import {useGetAllProductsQuery} from '../../../provider/queries/Products.query'

const AddOrderModel = ({ visible, setVisible }: any) => { 
    const [CreateOrder] = useCreateOrderMutation();
    const { isLoading, isFetching, data } = useGetForSearchUserQuery({});
    const { data: productData, isLoading: isProductLoading, isFetching: isProductFetching } = useGetAllProductsQuery({query:'',page:1});

    console.log("Loading States:", { isLoading, isFetching, isProductLoading, isProductFetching });  // Log loading states

    // Log the entire data object to check the structure
    console.log("Fetched products Data:", productData);

    if (isLoading || isFetching || isProductLoading || isProductFetching) {
        return <Loader />;
    }

  
    console.log("Available Products:", productData);  // Log available products to verify

    const validationSchema = yup.object({
        user: yup.mixed().required("User is required"),
    });

    const initialValues = {
        user: null,
        items: [{ productId: null, quantity: 1 }], // Initialize with one empty item
    };

    const onSubmitHandler = async (e: any, { resetForm }: any) => {
        try {
            console.log("Form Submit Data:", e);  // Log form submission data
            const payload = {
                user: e.user._id,
                items: e.items.map((item: any) => ({
                    productId: item.productId._id, // MongoDB Product ID
                    quantity: item.quantity,
                })),
            };

            console.log("Payload:", payload);  // Log the payload before sending to CreateOrder

            const { data, error }: any = await CreateOrder(payload);

            if (error) {
                console.error("Order Creation Error:", error);  // Log error if order creation fails
                toast.error(error.data.message);
                return;
            }

            console.log("Order Created Successfully:", data);  // Log the response data from CreateOrder
            toast.success("Order Created Successfully");
            resetForm();
            setVisible(false);
        } catch (e: any) {
            console.error("Error during order creation:", e);  // Log any unexpected errors
            toast.error(e.message);
        }
    };

    return (
        <Dialog 
    draggable={false} 
    header="Add Order" 
    position="top" 
    visible={visible} 
    className="w-full md:w-[70%] lg:w-[60%]" 
    onHide={() => setVisible(false)}
>
    <Formik 
        onSubmit={onSubmitHandler} 
        initialValues={initialValues} 
        validationSchema={validationSchema}
    >
        {({ values, setFieldValue, handleSubmit }) => (
            <form onSubmit={handleSubmit} className="w-full">
                {/* User Selection */}
                <div className="mb-3">
                    <label htmlFor="user">
                        User <span className="text-red-500 text-sm">*</span>
                    </label>
                    <Dropdown
                        value={values.user}
                        onChange={(e) => {
                            console.log("Selected User:", e.value); 
                            setFieldValue('user', e.value);
                        }}
                        filterBy="name"
                        options={data?.users.map(user => ({
                            label: user.name,
                            value: user, // Store entire user object for reference
                        })) || []}
                        filterPlaceholder="Search User By Name"
                        optionLabel="label"
                        placeholder="Select a User"
                        emptyFilterMessage="No User Found"
                        emptyMessage="You Have No User"
                        className="w-full my-2 border outline-none ring-0"
                    />
                    <ErrorMessage 
                        name="user" 
                        className="text-red-500 capitalize" 
                        component="p" 
                    />
                </div>

                {/* Items Selection */}
                <div className="mb-3">
                    <label htmlFor="items">
                        Items <span className="text-red-500 text-sm">*</span>
                    </label>
                    <FieldArray name="items">
                        {({ push, remove }) => (
                            <>
                                {/* Add New Item */}
                                <div className="mb-3 flex justify-end">
                                    <button
                                        type="button"
                                        onClick={() => push({ productId: null, quantity: 1 })}
                                        className="bg-accent px-4 text-white py-2 rounded-lg"
                                    >
                                        Add +
                                    </button>
                                </div>

                                {/* Render Each Item */}
                                {values.items.length > 0 &&
                                    values.items.map((_, i) => (
                                        <div
                                            className="w-full flex items-center justify-between gap-x-4"
                                            key={i}
                                        >
                                            {/* Product Selection */}
                                            <div className="w-1/2">
    <Dropdown
        name={`items[${i}].productId`}
        value={values.items[i]?.productId}
        onChange={(e) => {
            console.log(`Selected Product for Item ${i}:`, e.value); 
            setFieldValue(`items[${i}].productId`, e.value);
        }}
        options={productData?.data?.map(product => ({
            label: product.name, // Display the name as the label in the dropdown
            value: product, // Store the entire product object for reference
        })) || []}
        optionLabel="label"
        placeholder="Select Product"
        className="w-full my-2 border outline-none py-3 px-4"
    />
</div>

                                            {/* Quantity */}
                                            <div className="w-1/2">
                                                <Field
                                                    type="number"
                                                    name={`items[${i}].quantity`}
                                                    className="w-full my-2 border outline-none py-3 px-4"
                                                    placeholder="Quantity"
                                                />
                                            </div>

                                            {/* Remove Item */}
                                            <div>
                                                <button
                                                    onClick={() => {
                                                        console.log(`Removing Item ${i}`); 
                                                        remove(i);
                                                    }}
                                                    type="button"
                                                    className="px-3 py-3 rounded-full bg-black text-white"
                                                >
                                                    <FaTrashAlt />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                            </>
                        )}
                    </FieldArray>
                    <ErrorMessage 
                        name="items" 
                        className="text-red-500 capitalize" 
                        component="p" 
                    />
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <Button
                        className="text-white px-5 rounded-sm bg-accent py-3 text-center"
                        type="submit"
                    >
                        Add Consumer
                    </Button>
                </div>
            </form>
        )}
    </Formik>
</Dialog>

    );
};


export default AddOrderModel;
