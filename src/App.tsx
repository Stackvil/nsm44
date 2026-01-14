import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AlumniDirectory from './pages/AlumniDirectory';
import CareerHub from './pages/CareerHub';
import Events from './pages/Events';
import Giving from './pages/Giving';
import Store from './pages/Store';
import Dashboard from './pages/Dashboard';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Admin Imports
import AdminLayout from './layouts/AdminLayout';
import AdminLogin from './pages/admin/AdminLogin';
import PageManager from './pages/admin/PageManager';
import PageEditor from './pages/admin/PageEditor';

const queryClient = new QueryClient();

// Layout wrapper for public pages to include Navbar/Footer
const PublicLayout = ({ children }: { children: React.ReactNode }) => (
    <div className="app">
        <Navbar />
        <main>{children}</main>
        <Footer />
    </div>
);

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <Router>
                <Routes>
                    {/* Admin Routes - No Navbar/Footer, has its own Layout */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<PageManager />} />
                        <Route path="page/:slug" element={<PageEditor />} />
                    </Route>

                    {/* Public Routes - Wrapped in PublicLayout */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    <Route path="/directory" element={<PublicLayout><AlumniDirectory /></PublicLayout>} />
                    <Route path="/career" element={<PublicLayout><CareerHub /></PublicLayout>} />
                    <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
                    <Route path="/giving" element={<PublicLayout><Giving /></PublicLayout>} />
                    <Route path="/store" element={<PublicLayout><Store /></PublicLayout>} />
                    <Route path="/dashboard" element={<PublicLayout><Dashboard /></PublicLayout>} />
                    <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                    <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
                </Routes>
            </Router>
        </QueryClientProvider>
    );
}

export default App;
