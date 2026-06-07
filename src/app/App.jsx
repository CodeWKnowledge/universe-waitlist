import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Toast from '../components/shared/Toast';
import WaitlistApp from '../features/waitlist/WaitlistApp';
import { ThemeProvider } from './providers/ThemeContext';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { DashboardHome } from '../features/dashboard/DashboardHome';
import { Marketplace } from '../features/marketplace/Marketplace';
import { ProductDetails } from '../features/marketplace/ProductDetails';
import { CreateListing } from '../features/marketplace/CreateListing';
import { StudyHub } from '../features/study-hub/StudyHub';
import { ResourceDetails } from '../features/study-hub/ResourceDetails';
import { UploadResource } from '../features/study-hub/UploadResource';
import { Messages } from '../features/dashboard/Messages';
import { SavedItems } from '../features/user/SavedItems';
import { MyListings } from '../features/user/MyListings';
import { Notifications } from '../features/user/Notifications';
import { Profile } from '../features/user/Profile';
import { Settings } from '../features/user/Settings';

export default function App() {
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState('success');

  const triggerToast = (msg, type = 'success') => {
    setToastMessage(msg);
    setToastType(type);
  };

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<WaitlistApp triggerToast={triggerToast} />} />
          
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
          </Route>
          
          {/* We will route all the dashboard pages at the root to avoid rewriting all the internal links, or we rewrite internal links. Actually, let's keep them at the root level inside DashboardLayout for now so we don't have to rewrite every single <Link to="/"> */}
          
          <Route element={<DashboardLayout />}>
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<ProductDetails />} />
            <Route path="/create-listing" element={<CreateListing />} />
            <Route path="/study-hub" element={<StudyHub />} />
            <Route path="/study-hub/:id" element={<ResourceDetails />} />
            <Route path="/upload-resource" element={<UploadResource />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/saved" element={<SavedItems />} />
            <Route path="/my-listings" element={<MyListings />} />
            <Route path="/notifications" element={<Notifications />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>

        <Toast 
          message={toastMessage} 
          type={toastType} 
          onClose={() => setToastMessage('')} 
        />
      </BrowserRouter>
    </ThemeProvider>
  );
}
