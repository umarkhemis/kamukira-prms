import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <span className="text-8xl">🏥</span>
        <h1 className="mt-6 text-4xl font-bold text-gray-900">404</h1>
        <p className="mt-2 text-lg text-gray-600">Page not found</p>
        <Link to="/dashboard" className="mt-6 inline-block btn-primary">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
