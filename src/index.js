import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import App from './App';
import AdminPortal from './AdminPortal';
import AdminFuel from './AdminFuel';
import AdminStudents from './AdminStudents';
import AdminTravel from './AdminTravel';
import AdminWaste from './AdminWaste';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/admin" element={<AdminPortal />} />
        <Route path="/admin/fuel" element={<AdminFuel />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/admin/travel" element={<AdminTravel />} />
        <Route path="/admin/waste" element={<AdminWaste />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
