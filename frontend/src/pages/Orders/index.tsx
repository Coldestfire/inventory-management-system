import { FormEvent, useState } from 'react';
import BredCrums from '../../components/BredCrums';
import Loader from '../../components/Loader';
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddOrderModel from './components/AddOrder.model'; // You may or may not have this component, adjust as needed
import { useGetAllOrdersQuery } from '../../provider/queries/Orders.query'; // Assuming you have a query to fetch orders
import OrderCard from './components/Card.order'; // Assuming there's a component to display each order


const OrdersPage = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const [Search, setSearch] = useState(SearchParams.get("query") || '');
  
  const { data, isLoading, isError } = useGetAllOrdersQuery({
    query: SearchParams.get("query") || '',
    page: Number(SearchParams.get("page")) || 1,
  });

  if (isLoading) {
    return <Loader />;
  }

  // console.log("DATA: ", data);

  if (isError) {
    return <h1>Something went wrong</h1>;
  }




  const SearchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let string = `?query=${Search}&page=${1}`;
    navigate(`/orders` + string);
  };

  const OnNextPageHandler = () => {
    const page = Number(SearchParams.get("page")) || 1;
    const query = SearchParams.get("query") || '';
    let string = query ? `?query=${query}&page=${page + 1}` : `?page=${page + 1}`;
    navigate(`/orders` + string);
  };

  const onPrevPageHandler = () => {
    const page = Number(SearchParams.get("page")) || 1;
    const query = SearchParams.get("query") || '';
    let string = query ? `?query=${query}&page=${page - 1}` : `?page=${page - 1}`;
    navigate(`/orders` + string);
  };

  return (
    <>
      <BredCrums PageLink='/orders' PageName='Orders' />
      <div className="mb-3 flex justify-end w-[90%] mx-auto">
        <button onClick={() => setVisible(!visible)} className="px-5 py-2 bg-accent text-white rounded-lg">Add Order</button>
      </div>
      <form onSubmit={SearchHandler} className="mb-3 flex justify-end w-[90%] mx-auto">
        <input 
          value={Search} 
          onChange={(e: any) => setSearch(e.target.value)} 
          className="w-[90%] mx-auto lg:mx-0 lg:w-1/2 rounded-sm border py-3 px-5 outline-none" 
          placeholder="Search Orders" 
        />
      </form>
      <div className={`mb-3 flex ${(Number(SearchParams.get("page")) || 1) > 1 ? 'justify-between' : 'justify-end'} w-[90%] mx-auto`}>
        {(Number(SearchParams.get("page")) || 1) > 1 && <button onClick={onPrevPageHandler} title='Prev Page' className="text-black text-xl lg:text-3xl p-2"><BsArrowLeftCircle /></button>}
        {data && data.hasMore && <button onClick={OnNextPageHandler} title='Next Page' className="text-black text-xl lg:text-3xl p-2"><BsArrowRightCircle /></button>}
      </div>
      <div className="relative overflow-x-auto shadow">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3">ID</th>
              <th scope="col" className="px-6 py-3">Name</th>
              <th scope="col" className="px-6 py-3">Email</th>
              <th scope="col" className="px-6 py-3">Items</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data && data.data.length > 0 && data.data.map((order: any, i: number) => (
              <OrderCard key={order._id} id={i + 1} data={order} />
            ))}
          </tbody>
        </table>
      </div>
      <AddOrderModel visible={visible} setVisible={setVisible} />
    </>
  );
};

export default OrdersPage;
