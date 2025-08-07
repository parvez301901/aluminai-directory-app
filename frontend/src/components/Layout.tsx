import React, { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  const { pathname } = useLocation();
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow px-4 py-2 flex justify-between items-center">
        <div className="font-bold text-xl text-blue-700">Alumni Directory</div>
        <div className="space-x-4">
          <Link to="/directory" className={pathname === '/directory' ? 'text-blue-700 font-semibold' : 'text-gray-700'}>Directory</Link>
          <Link to="/feed" className={pathname === '/feed' ? 'text-blue-700 font-semibold' : 'text-gray-700'}>Feed</Link>
          <Link to="/profile" className={pathname === '/profile' ? 'text-blue-700 font-semibold' : 'text-gray-700'}>Profile</Link>
        </div>
      </nav>
      <main className="max-w-4xl mx-auto p-4">
        {children}
      </main>
    </div>
  );
}
