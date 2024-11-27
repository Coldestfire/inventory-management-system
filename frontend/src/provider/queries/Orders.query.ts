import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const OrdersApi = createApi({
    reducerPath: 'OrdersApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    tagTypes: ['getAllOrders'],
    endpoints: (builder) => ({
        CreateOrder: builder.mutation<any, any>({
            
            query: (obj) => ({
                url: '/orders/create-order',
                method: 'POST',
                body: obj,
                 headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
            invalidatesTags:['getAllOrders']
        }),

        getAllOrders: builder.query<any, any>({
            query: (obj) => {
              const params = new URLSearchParams({
                query: obj.query || "",
                page: obj.page?.toString() || "1",
              });
          
              if (obj.startDate) params.append("startDate", obj.startDate);
              if (obj.endDate) params.append("endDate", obj.endDate);
          
              return {
                url: `/orders/get-orders?${params.toString()}`,
                method: 'GET',
                headers: {
                  'Authorization': 'Bearer ' + localStorage.getItem("token"),
                },
              };
            },
            providesTags: ['getAllOrders'],
          }),
          

        updateById: builder.mutation<any, any>({
            query: ({id,data}) => ({
                url: `/orders/${id}`,
                method: 'PATCH',
                body: data,
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
        }),

        DeleteOrder: builder.mutation<any, any>({
            query: (obj) => ({
                url: `/orders/delete/${obj}`,
                method: 'DELETE',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }), 
            invalidatesTags: ['getAllOrders']
        }),
        getInvoiceById: builder.query<any, any>({
            query: (obj) => ({
                url: `/orders/get-invoice/${obj}`,
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            }),
        }),

        
        dashboardData: builder.query<any, any>({
            query: () => ({
                url: '/consumer/dashboard/' ,
                method: 'GET', 
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
        }),
         
        getMostAppeared: builder.query<any, any>({
            query: () => ({
                url: '/orders/getmost/' ,
                method: 'GET', 
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
        }),

        getWeeklyRevenue: builder.query<any, any>({
            query: () => ({
                url: '/orders/weekly-revenue/' ,
                method: 'GET', 
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token")
                }
            })
        })

    }),
})


export const { useCreateOrderMutation,useGetAllOrdersQuery ,useUpdateByIdMutation , useDeleteOrderMutation ,useGetInvoiceByIdQuery, useGetMostAppearedQuery, useGetWeeklyRevenueQuery} = OrdersApi