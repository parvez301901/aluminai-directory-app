import React, { ReactNode } from 'react';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Directory from './pages/Directory';
import Profile from './pages/Profile';
import Feed from './pages/Feed';
/// <reference types="vite/client" />

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

type ProtectedRouteProps = {
  children: ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  return (
    <SignedIn>{children}</SignedIn>
    || <SignedOut><RedirectToSignIn /></SignedOut>
  );
}

function Home() {
  return <h1 className="text-2xl font-bold">Alumni Directory Home</h1>;
}

import Layout from './components/Layout';
import { SignInPage, SignUpPage } from './pages/AuthPages';

function App() {
  return (
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/directory" element={<ProtectedRoute><Directory /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/profile/:id" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            <Route path="/feed" element={<ProtectedRoute><Feed /></ProtectedRoute>} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Layout>
      </Router>
    </ClerkProvider>
  );
}

export default App;
