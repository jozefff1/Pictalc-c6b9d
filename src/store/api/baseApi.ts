import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Base API configuration — auth handled by NextAuth session cookies
export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
  }),
  tagTypes: ['User', 'Message', 'Session', 'Pairing', 'Preferences'],
  endpoints: () => ({}),
});
