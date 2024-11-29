/* eslint-disable @typescript-eslint/no-explicit-any */
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const AuthApi = createApi({
    reducerPath: 'AuthApi',
    baseQuery: fetchBaseQuery({ baseUrl: import.meta.env.VITE_BACKEND_URL }),
    endpoints: (builder) => ({
        registerUser: builder.mutation<any,any>({
            query: (obj) => ({
                url:'/auth/register',
                method:'POST',
                body: obj
            })
        }),
        loginUser: builder.mutation<any, any>({
            query: (obj) => ({
                url: '/auth/login',
                method: 'POST',
                body: obj
            })
        }),
        getProfile: builder.query<any, any>({
            query: () => ({
                url: '/auth/profile',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("token"),
                  }
            })
        }),
    }),
})


export const { useRegisterUserMutation,useLoginUserMutation, useGetProfileQuery } = AuthApi