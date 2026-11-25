import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BookList } from './pages/BookList';
import { BookCreate } from './pages/BookCreate';
import { BookDetail } from './pages/BookDetail';
import { BookEdit } from './pages/BookEdit';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { ProtectedRoute } from './auth/ProtectedRoute';
import { isAuthenticated, clearTokens } from './auth/token';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function Nav() {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    queryClient.clear();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold text-gray-900 hover:text-indigo-600">
          Bukus
        </Link>
        {isAuthenticated() && (
          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />
      <main className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<ProtectedRoute><BookList /></ProtectedRoute>} />
            <Route path="/books/new" element={<ProtectedRoute><BookCreate /></ProtectedRoute>} />
            <Route path="/books/:id" element={<ProtectedRoute><BookDetail /></ProtectedRoute>} />
            <Route path="/books/:id/edit" element={<ProtectedRoute><BookEdit /></ProtectedRoute>} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
