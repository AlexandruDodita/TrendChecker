import React from 'react';
import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function Navbar() {
  const { user, loading, login, logout, isAuthenticated, displayName, photoURL } = useAuth();

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-xl font-bold text-gray-800">
              TrendCheck
            </Link>
            <div className="hidden md:flex space-x-4">
              <Link href="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </Link>
              <Link href="/test" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">
                API Tester
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            {loading ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                {photoURL && (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="h-8 w-8 rounded-full"
                  />
                )}
                <span className="text-sm font-medium text-gray-700">
                  {displayName}
                </span>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => login('google')}
                  className="text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600"
                >
                  Sign In with Google
                </button>
                <button
                  onClick={() => login('anonymous')}
                  className="text-sm text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
                >
                  Use Anonymously
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 