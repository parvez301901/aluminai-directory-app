import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function ProtectedRoute({ children }) {
  return (
    <SignedIn>{children}</SignedIn>
    || <SignedOut><RedirectToSignIn /></SignedOut>
  );
}

function Home() {
  return <h1 className="text-2xl font-bold">Alumni Directory Home</h1>;
}

function Directory() {
  return <h1>Alumni Directory Page (to be built)</h1>;
}

function Profile() {
  return <h1>Profile Page (to be built)</h1>;
}

function Feed() {
  return <h1>Social Feed (to be built)</h1>;
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
