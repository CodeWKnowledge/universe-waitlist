import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Toast from '../components/shared/Toast';
import WaitlistApp from '../features/waitlist/WaitlistApp';
import PreferencesPage from '../features/waitlist/pages/PreferencesPage';
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

// Admin Imports
import AdminLayout from '../features/admin/layout/AdminLayout';
import RequireAdmin from '../features/admin/layout/RequireAdmin';
import Overview from '../features/admin/pages/Overview';
import WaitlistPage from '../features/admin/pages/WaitlistPage';
import SubscribersPage from '../features/admin/pages/SubscribersPage';
import AudiencesPage from '../features/admin/pages/AudiencesPage';
import CampaignsPage from '../features/admin/pages/CampaignsPage';
import AutomationsPage from '../features/admin/pages/AutomationsPage';
import TemplatesPage from '../features/admin/pages/TemplatesPage';
import AnalyticsPage from '../features/admin/pages/AnalyticsPage';
import ReferralsPage from '../features/admin/pages/ReferralsPage';
import SettingsPage from '../features/admin/pages/SettingsPage';
import BrandSettingsPage from '../features/admin/pages/BrandSettingsPage';

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
          <Route path="/preferences" element={<PreferencesPage />} />
          
          {/* User Dashboard */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
          </Route>
          
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

          {/* Admin Portal */}
          <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<Overview />} />
            <Route path="waitlist" element={<WaitlistPage />} />
            <Route path="subscribers" element={<SubscribersPage />} />
            <Route path="audiences" element={<AudiencesPage />} />
            <Route path="campaigns" element={<CampaignsPage />} />
            <Route path="automations" element={<AutomationsPage />} />
            <Route path="templates" element={<TemplatesPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="referrals" element={<ReferralsPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="brand" element={<BrandSettingsPage />} />
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

