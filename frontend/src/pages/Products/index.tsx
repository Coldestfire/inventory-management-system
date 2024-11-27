import { FormEvent, useState } from 'react';
import BredCrums from '../../components/BredCrums';
import Loader from '../../components/Loader';
import { BsArrowRightCircle, BsArrowLeftCircle } from "react-icons/bs";
import { useNavigate, useSearchParams } from 'react-router-dom';
import AddProductModel from './components/AddProduct.model';
import { useGetAllProductsQuery } from '../../provider/queries/Products.query';
import TableCard from './components/Card.product';


const ProductsPage = () => {
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const [SearchParams] = useSearchParams();
  const [Search, setSearch] = useState(SearchParams.get("query") || '');
  const { data, isLoading, isError } = useGetAllProductsQuery({
    query: SearchParams.get("query") || '',
    page: Number(SearchParams.get("page")) || 1,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return <h1>Something went wrong</h1>;
  }

  const SearchHandler = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let string = `?query=${Search}&page=${1}`;
    navigate(`/products` + string);
  };

  const OnNextPageHandler = () => {
    const page = Number(SearchParams.get("page")) || 1;
    const query = SearchParams.get("query") || '';
    let string = query ? `?query=${query}&page=${page + 1}` : `?page=${page + 1}`;
    navigate(`/products` + string);
  };

  const onPrevPageHandler = () => {
    const page = Number(SearchParams.get("page")) || 1;
    const query = SearchParams.get("query") || '';
    let string = query ? `?query=${query}&page=${page - 1}` : `?page=${page - 1}`;
    navigate(`/products` + string);
  };

  return (
    <>
      <BredCrums PageLink='/products' PageName='Products' />
      <div className="mb-3 flex justify-end w-[90%] mx-auto">
        <button onClick={() => setVisible(!visible)} className="px-5 py-2 bg-accent text-white rounded-lg">Add Product</button>
      </div>
      <form onSubmit={SearchHandler} className="mb-3 flex justify-end w-[90%] mx-auto">
        <input value={Search} onChange={(e: any) => setSearch(e.target.value)} className="w-[90%] mx-auto lg:mx-0 lg:w-1/2 rounded-lg border py-3 px-5 outline-none" placeholder="Search Products" />
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
              <th scope="col" className="px-6 py-3">Price</th>
              <th scope="col" className="px-6 py-3">Stock</th>
              <th scope="col" className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data?.data && data.data.length > 0 && data.data.map((product: any, i: number) => (
              <TableCard key={i} id={i + 1} data={product} />
            ))}
          </tbody>
        </table>
      </div>
      <AddProductModel visible={visible} setVisible={setVisible} />
    </>
  );
};

export default ProductsPage;
