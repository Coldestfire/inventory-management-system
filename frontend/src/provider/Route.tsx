import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Login from "../pages/Login";
import Register from "../pages/Register";

import HomePage from "../pages/Home";
import ErrorPage from "../pages/Error";
import Invoice from "../pages/Invoice";
import UserPage from "../pages/Users";
import OrdersPage from "../pages/Orders";
import ProductsPage from "../pages/Products";



export const Routes = createBrowserRouter([
    {
    path: "/",
    Component: App,
    children: [

        // {
        //     path:'/about',
        //     Component: About
        // },

            {
                path:'/',
                // Component: HomePage,
                Component: () => <HomePage key={Date.now()} />, // Add a dynamic key here
            },
            {
                path: '/invoice',
                Component: Invoice
            },
            {
                path: '/user',
                Component: UserPage
            },
            {
                path: '/orders',
                Component: OrdersPage
            },
            
            {
                path:'*',
                Component: ErrorPage
            },

            {
                path:'/products',
                Component: ProductsPage
            }
        ]
},
{
    path: '/login',
    Component: Login,
    
},
{
    path: '/register',
    Component: Register
}


])