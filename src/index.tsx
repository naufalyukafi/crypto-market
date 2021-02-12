import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {QueryClientProvider, QueryClient} from "react-query"
import {ReactQueryDevtools} from "react-query/devtools"
import 'antd/dist/antd.css';
const queryClient = new QueryClient()
ReactDOM.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools />
  </QueryClientProvider>,
  document.getElementById('root')
);

reportWebVitals();
