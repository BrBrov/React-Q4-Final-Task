import { configureStore } from '@reduxjs/toolkit';
import { graphQLApi } from '../rtk-query/fetchApI';
import urlSlice from '../url/urlSlice';

const storeApp = configureStore({
  reducer: {
    [urlSlice.reducerPath]: urlSlice.reducer,
    [graphQLApi.reducerPath]: graphQLApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(graphQLApi.middleware),
});

export default storeApp;
