// src/components/ProtectedRoute.jsx
import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export default function ProtectedRoute({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      setIsAuthenticated(!!user);
    });
  }, []);

  if (isAuthenticated === null) return(  <>
              <div className="fixed inset-0 flex items-center justify-center bg-white z-50">

                  <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-solid mx-auto mb-6" />
                      <p className="text-xl font-semibold text-gray-700">Loading...</p>
                  </div>
              </div>
          </>
            );

  return isAuthenticated ? children : <Navigate to="/login" replace />;
}
