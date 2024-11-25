import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { useState } from 'react';
import { toast } from 'sonner';
import { useUpdateOrderMutation } from '../../../provider/queries/Orders.query'; // Custom hook for updating orders

const EditOrder = ({ data, visible, setVisible }: any) => {
  const [updateOrder, { isLoading }] = useUpdateOrderMutation();

  // Local state for editing fields
  const [formData, setFormData] = useState({
    consumerName: data?.consumer?.name || '',
    consumerEmail: data?.consumer?.email || '',
    items: data?.items.map((item: any) => ({
      name: item?.productId?.name || '',
      quantity: item?.quantity || 0,
      status: item?.status || '',
    })),
  });

  const statuses = ['Pending', 'Shipped', 'Delivered', 'Cancelled'];

  const handleInputChange = (e: any, field: string, index?: number) => {
    if (field === 'items') {
      const updatedItems = [...formData.items];
      updatedItems[index!] = {
        ...updatedItems[index!],
        [e.target.name]: e.target.value,
      };
      setFormData({ ...formData, items: updatedItems });
    } else {
      setFormData({ ...formData, [field]: e.target.value });
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        _id: data._id,
        consumer: {
          name: formData.consumerName,
          email: formData.consumerEmail,
        },
        items: formData.items.map((item) => ({
          productId: item.name, // Assuming this is how product ID is identified
          quantity: item.quantity,
          status: item.status,
        })),
      };

      const { data: response, error }: any = await updateOrder(payload);

      if (error) {
        toast.error(error.data.message);
        return;
      }
      toast.success('Order updated successfully!');
      setVisible(false);
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  return (
    <Dialog
      header="Edit Order"
      visible={visible}
      onHide={() => setVisible(false)}
      className="w-[90%] lg:w-1/2"
    >
      <div className="p-4 space-y-4">
        {/* Consumer Details */}
        <div className="flex flex-col gap-4">
          <span className="p-float-label">
            <InputText
              id="consumerName"
              value={formData.consumerName}
              onChange={(e) => handleInputChange(e, 'consumerName')}
            />
            <label htmlFor="consumerName">Consumer Name</label>
          </span>
          <span className="p-float-label">
            <InputText
              id="consumerEmail"
              value={formData.consumerEmail}
              onChange={(e) => handleInputChange(e, 'consumerEmail')}
            />
            <label htmlFor="consumerEmail">Consumer Email</label>
          </span>
        </div>

        {/* Items Section */}
        {formData.items.map((item, index) => (
          <div key={index} className="border p-4 rounded-md space-y-2">
            <span className="p-float-label">
              <InputText
                id={`itemName-${index}`}
                name="name"
                value={item.name}
                onChange={(e) => handleInputChange(e, 'items', index)}
              />
              <label htmlFor={`itemName-${index}`}>Item Name</label>
            </span>
            <span className="p-float-label">
              <InputText
                id={`quantity-${index}`}
                name="quantity"
                type="number"
                value={item.quantity}
                onChange={(e) => handleInputChange(e, 'items', index)}
              />
              <label htmlFor={`quantity-${index}`}>Quantity</label>
            </span>
            <Dropdown
              value={item.status}
              name="status"
              options={statuses}
              onChange={(e) => handleInputChange(e, 'items', index)}
              placeholder="Select Status"
            />
          </div>
        ))}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button
            label={isLoading ? 'Updating...' : 'Update Order'}
            onClick={handleSubmit}
            className="p-button-success"
            disabled={isLoading}
          />
        </div>
      </div>
    </Dialog>
  );
};

export default EditOrder;
