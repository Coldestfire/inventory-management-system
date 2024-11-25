import { Dialog } from 'primereact/dialog'; 
import { useGetInvoiceByIdQuery } from '../../../provider/queries/Orders.query'; 
import Loader from '../../../components/Loader'; 
import moment from 'moment'; 
import Barcode from 'react-barcode'; 
import { usePDF } from 'react-to-pdf';

const ShowAndPrintModel = ({ setVisible, visible, id }: any) => {
  const { data, isLoading, isError, isFetching } = useGetInvoiceByIdQuery(id); // Fetch order details

  const { toPDF, targetRef } = usePDF();

  if (isFetching || isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <div>Something went wrong</div>;
  }

  // Order Document Type
  type OrderDoc = {
    name: string;
    id: string;
    price: number;
    quantity: number;
  };

  // Calculate the overall total price
  const grandTotal = data.items && data.items.length > 0
    ? data.items.map((item: OrderDoc) => item.price * item.quantity).reduce((a: number, b: number) => a + b, 0)
    : 0;

  return (
    <>
      <Dialog
        draggable={false}
        visible={visible}
        className="w-[90%] mx-auto lg:mx-0 lg:w-1/2"
        onHide={() => setVisible(false)}
      >
        <div ref={targetRef} className="m-0 px-5">
          <div className="flex items-start gap-x-10 py-5 justify-between">
            <div className="w-1/2 flex flex-col gap-y-2">
              <h1 className="font-semibold text-xl capitalize">{data?.consumer?.name}</h1>
              <p className="text-sm">{data?.consumer?.address}</p>
              <p className="font-semibold">
                Date: {moment(new Date(data.createdAt)).format('lll')}
              </p>
            </div>
            <div className="w-1/2">
              <Barcode displayValue={false} width={1} height={50} value={data._id} />
              <h1 className="font-semibold">Supplier: {data?.user?.name}</h1>
            </div>
          </div>

          <div className="items py-2">
            <table className="border w-full">
              <thead className="border">
                <tr>
                  <th className="border py-2">ID</th>
                  <th className="border py-2">Item</th>
                  <th className="border py-2">Price (in &#8377;)</th>
                  <th className="border py-2">Quantity</th>
                  <th className="border py-2">Total Price (in &#8377;)</th>
                </tr>
              </thead>

              <tbody>
                {data.items && data.items.length > 0 &&
                  data.items.map((item: OrderDoc, i: number) => (
                    <tr key={i} className="py-2">
                      <td className="border text-center py-2">{i + 1}</td>
                      <td className="border text-center py-2 capitalize">{item.name}</td>
                      <td className="border text-center py-2">&#8377; {item.price}</td>
                      <td className="border text-center py-2">{item.quantity}</td>
                      <td className="border text-center py-2">
                        &#8377; {item.price * item.quantity}
                      </td>
                    </tr>
                  ))
                }
              </tbody>
              <tfoot>
                <tr>
                  <th colSpan={4} className="border capitalize text-center py-2">Grand Total</th>
                  <th className="border capitalize text-center py-2">
                    &#8377; {grandTotal} /-
                  </th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        <footer>
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
