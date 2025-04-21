import React, { useState } from 'react';
// Commenting out authentication for now
// import useAuth from '@/hooks/useAuth';
import Link from 'next/link';

export default function Navbar() {
  // Comment out auth functionality
  // const { user, loading, login, logout, isAuthenticated, displayName, photoURL } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <span className="text-2xl font-extrabold text-gray-900">
                <span className="text-primary">Trend</span>Check
              </span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-4">
              <Link href="/" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                Home
              </Link>
              {/* API Tester link removed for production */}
              {/* <Link href="/test" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                API Tester
              </Link> */}
              <a href="#features" className="text-gray-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition duration-200">
                Features
              </a>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-primary hover:bg-gray-100 focus:outline-none"
            >
              <svg 
                className={`${mobileMenuOpen ? 'hidden' : 'block'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg 
                className={`${mobileMenuOpen ? 'block' : 'hidden'} h-6 w-6`} 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          {/* Comment out auth UI */}
          {/*
          <div className="hidden md:flex items-center">
            {loading ? (
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            ) : isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-gray-50 py-1 px-3 rounded-full">
                  {photoURL ? (
                    <img
                      src={photoURL}
                      alt={displayName}
                      className="h-8 w-8 rounded-full border-2 border-primary"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                      {displayName?.charAt(0) || 'U'}
                    </div>
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    {displayName || 'User'}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="text-sm text-gray-500 hover:text-primary transition duration-200"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <button
                  onClick={() => login('google')}
                  className="text-sm bg-primary text-white px-5 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
                  </svg>
                  Sign In with Google
                </button>
                <button
                  onClick={() => login('anonymous')}
                  className="text-sm text-gray-700 px-5 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200"
                >
                  Use Anonymously
                </button>
              </div>
            )}
          </div>
          */}
        </div>
      </div>
      
      {/* Mobile menu */}
      <div className={`${mobileMenuOpen ? 'block' : 'hidden'} md:hidden bg-white border-t`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          <Link href="/" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium">
            Home
          </Link>
          {/* API Tester link removed for production */}
          {/* <Link href="/test" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium">
            API Tester
          </Link> */}
          <a href="#features" className="block text-gray-600 hover:text-primary px-3 py-2 rounded-md text-base font-medium">
            Features
          </a>
        </div>
        
        {/* Comment out mobile auth section */}
        {/*
        <div className="pt-4 pb-3 border-t border-gray-200">
          {isAuthenticated ? (
            <div className="px-4 space-y-3">
              <div className="flex items-center">
                {photoURL ? (
                  <img
                    src={photoURL}
                    alt={displayName}
                    className="h-8 w-8 rounded-full border-2 border-primary"
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                    {displayName?.charAt(0) || 'U'}
                  </div>
                )}
                <span className="ml-3 text-base font-medium text-gray-700">
                  {displayName || 'User'}
                </span>
              </div>
              <button
                onClick={logout}
                className="w-full text-left block text-gray-500 hover:text-primary px-3 py-2 rounded-md text-base font-medium"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <div className="px-4 space-y-3">
              <button
                onClick={() => login('google')}
                className="w-full text-sm bg-primary text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-200 flex items-center"
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" fill="currentColor"/>
                </svg>
                Sign In with Google
              </button>
              <button
                onClick={() => login('anonymous')}
                className="w-full text-sm text-gray-700 px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition duration-200"
              >
                Use Anonymously
              </button>
            </div>
          )}
        </div>
        */}
      </div>
    </nav>
  );
} 