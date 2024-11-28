import { Dialog } from 'primereact/dialog';
import { useGetEveryOrderQuery } from '../../../provider/queries/Orders.query';
import Loader from '../../../components/Loader';
import moment from 'moment';
import Barcode from 'react-barcode';
import { usePDF } from 'react-to-pdf';

const ShowAndPrintModel = ({ setVisible, visible, id }: any) => {
  // Fetch all orders and filter the one with the given ID
  const { data: orderData, isLoading, isError } = useGetEveryOrderQuery({});

  const order = orderData?.data?.find((o: any) => o._id === id); // Filter order by ID

console.log("Order Data:", orderData);
console.log("Order ID:", id);
console.log("Filtered Order:", order);

  const { toPDF, targetRef } = usePDF();

  if (isLoading) {
    return <Loader />;
  }

  if (isError || !order) {
    return <div>X</div>;
  }

  // Calculate total price
  const totalPrice = order.items.reduce((total: number, item: any) => total + (item.quantity * item.productId.price), 0);

  return (
    <>
      <Dialog
        draggable={false}
        visible={visible}
        className="w-[90%] mx-auto lg:mx-0 lg:w-1/2"
        onHide={() => setVisible(false)}
      >
        <div ref={targetRef} className="m-0 px-5">
          {/* Consumer and Supplier Details */}
          <div className="flex items-start gap-x-10 py-5 justify-between">
            <div className="w-1/2 flex flex-col gap-y-2">
              <h1 className="font-semibold text-xl capitalize">{order.consumer.name}</h1>
              <p className="text-sm">{order.consumer.email}</p>
              <p className="font-semibold">
                Date: {moment(order.createdAt).format('lll')}
              </p>
            </div>
            <div className="w-1/2">
              <Barcode displayValue={false} width={1} height={50} value={order._id} />
              <h1 className="font-semibold">Supplier: {order.user?.name || 'N/A'}</h1>
            </div>
          </div>

          {/* Items Table */}
          <div className="items py-2">
            <table className="border w-full">
              <thead className="border">
                <tr>
                  <th className="border py-2">ID</th>
                  <th className="border py-2">Item</th>
                  <th className="border py-2">Price (&#8377;)</th>
                  <th className="border py-2">Quantity</th>
                  <th className="border py-2">Total (&#8377;)</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item: any, i: number) => (
                  <tr key={i} className="py-2">
                    <td className="border text-center py-2">{i + 1}</td>
                    <td className="border text-center py-2 capitalize">{item.productId.name}</td>
                    <td className="border text-center py-2">&#8377; {item.productId.price}</td>
                    <td className="border text-center py-2">{item.quantity}</td>
                    <td className="border text-center py-2">&#8377; {item.quantity * item.productId.price}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4} className="border capitalize text-center py-2">Total</th>
                  <th className="border capitalize text-center py-2">
                    &#8377; {totalPrice} /-
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Footer with Generate PDF Button */}
        <footer className="mt-4">
          <button
            className="px-6 py-2 outline-none bg-red-500 rounded-md text-white"
            onClick={() => toPDF({ method: 'open', page: { format: 'A4' } })}
          >
            Generate PDF
          </button>
        </footer>
      </Dialog>
    </>
  );
};

export default ShowAndPrintModel;
