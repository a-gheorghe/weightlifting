import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import AddMedia from './routes/AddMedia';
import { UserContextProvider } from './UserContext';
import { Header } from './Header';


const queryClient = new QueryClient()

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <QueryClientProvider client={queryClient}>

    <UserContextProvider>
      <Header />
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/add" element={<AddMedia />} />
      </Routes>
    </UserContextProvider>
    </QueryClientProvider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
