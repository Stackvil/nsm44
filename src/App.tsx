import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Lazy load all page components for better performance
const Home = lazy(() => import('./pages/Home'));
const AlumniDirectory = lazy(() => import('./pages/AlumniDirectory'));
const CareerHub = lazy(() => import('./pages/CareerHub'));
const Events = lazy(() => import('./pages/Events'));
const Giving = lazy(() => import('./pages/Giving'));
const Store = lazy(() => import('./pages/Store'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Auth/Login'));
const Register = lazy(() => import('./pages/Auth/Register'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const Member = lazy(() => import('./pages/Member'));

// About Pages
const About = lazy(() => import('./pages/about/About'));
const AboutOverview = lazy(() => import('./pages/about/AboutOverview'));
const PresidentsMessage = lazy(() => import('./pages/about/PresidentsMessage'));
const ExecutiveCommittee = lazy(() => import('./pages/about/ExecutiveCommittee'));
const AlumniChapters = lazy(() => import('./pages/about/AlumniChapters'));
const AlumniBenefits = lazy(() => import('./pages/about/AlumniBenefits'));
const AnnualReports = lazy(() => import('./pages/about/AnnualReports'));

// Connect Pages
const Connect = lazy(() => import('./pages/connect/Connect'));
const MyProfile = lazy(() => import('./pages/connect/MyProfile'));
const AlumniEvent = lazy(() => import('./pages/connect/AlumniEvent'));
const AlumniDirectoryConnect = lazy(() => import('./pages/connect/AlumniDirectory'));
const BusinessDirectory = lazy(() => import('./pages/connect/BusinessDirectory'));
const HowToGive = lazy(() => import('./pages/connect/HowToGive'));
const ConnectWithUs = lazy(() => import('./pages/connect/ConnectWithUs'));

// Reunion Pages
const Reunion = lazy(() => import('./pages/reunion/Reunion'));
const AboutReunion = lazy(() => import('./pages/reunion/AboutReunion'));
const ReunionGallery = lazy(() => import('./pages/reunion/ReunionGallery'));

// Gallery Pages
const Gallery = lazy(() => import('./pages/gallery/Gallery'));
const PhotoGallery = lazy(() => import('./pages/gallery/PhotoGallery'));
const VideoGallery = lazy(() => import('./pages/gallery/VideoGallery'));

// Admin Imports
const AdminLayout = lazy(() => import('./layouts/AdminLayout'));
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const PageManager = lazy(() => import('./pages/admin/PageManager'));
const PageEditor = lazy(() => import('./pages/admin/PageEditor'));

// Loading component for Suspense fallback
const PageLoader = () => (
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '50vh',
        fontSize: '16px',
        color: '#666'
    }}>
        Loading...
    </div>
);

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
            <AuthProvider>
                <Router>
                <Suspense fallback={<PageLoader />}>
                <Routes>
                    {/* Admin Routes - No Navbar/Footer, has its own Layout */}
                    <Route path="/admin/login" element={<AdminLogin />} />

                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<PageManager />} />
                        <Route path="page/:slug" element={<PageEditor />} />
                    </Route>

                    {/* Public Routes - Wrapped in PublicLayout */}
                    <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                    
                    {/* About NSMOSA Routes */}
                    <Route path="/about" element={<PublicLayout><About /></PublicLayout>} />
                    <Route path="/about/overview" element={<PublicLayout><AboutOverview /></PublicLayout>} />
                    <Route path="/about/president" element={<PublicLayout><PresidentsMessage /></PublicLayout>} />
                    <Route path="/about/executive-committee" element={<PublicLayout><ExecutiveCommittee /></PublicLayout>} />
                    <Route path="/about/chapters" element={<PublicLayout><AlumniChapters /></PublicLayout>} />
                    <Route path="/about/benefits" element={<PublicLayout><AlumniBenefits /></PublicLayout>} />
                    <Route path="/about/annual-reports" element={<PublicLayout><AnnualReports /></PublicLayout>} />
                    
                    {/* Connect Routes */}
                    <Route path="/connect" element={<PublicLayout><Connect /></PublicLayout>} />
                    <Route path="/connect/profile" element={<PublicLayout><MyProfile /></PublicLayout>} />
                    <Route path="/connect/alumni-event" element={<PublicLayout><AlumniEvent /></PublicLayout>} />
                    <Route path="/connect/alumni-directory" element={<PublicLayout><AlumniDirectoryConnect /></PublicLayout>} />
                    <Route path="/connect/business-directory" element={<PublicLayout><BusinessDirectory /></PublicLayout>} />
                    <Route path="/connect/how-to-give" element={<PublicLayout><HowToGive /></PublicLayout>} />
                    <Route path="/connect/connect-us" element={<PublicLayout><ConnectWithUs /></PublicLayout>} />
                    
                    {/* Events Route */}
                    <Route path="/events" element={<PublicLayout><Events /></PublicLayout>} />
                    
                    {/* Reunion Routes */}
                    <Route path="/reunion" element={<PublicLayout><Reunion /></PublicLayout>} />
                    <Route path="/reunion/about" element={<PublicLayout><AboutReunion /></PublicLayout>} />
                    <Route path="/reunion/gallery" element={<PublicLayout><ReunionGallery /></PublicLayout>} />
                    
                    {/* Gallery Routes */}
                    <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
                    <Route path="/gallery/photo" element={<PublicLayout><PhotoGallery /></PublicLayout>} />
                    <Route path="/gallery/video" element={<PublicLayout><VideoGallery /></PublicLayout>} />
                    
                    {/* Other Routes */}
                    <Route path="/faq" element={<PublicLayout><FAQ /></PublicLayout>} />
                    <Route path="/contact" element={<PublicLayout><Contact /></PublicLayout>} />
                    <Route path="/member" element={<PublicLayout><Member /></PublicLayout>} />
                    
                    {/* Legacy Routes (keeping for compatibility) */}
                    <Route path="/directory" element={<PublicLayout><AlumniDirectory /></PublicLayout>} />
                    <Route path="/career" element={<PublicLayout><CareerHub /></PublicLayout>} />
                    <Route path="/giving" element={<PublicLayout><Giving /></PublicLayout>} />
                    <Route path="/store" element={<PublicLayout><Store /></PublicLayout>} />
                    <Route path="/dashboard" element={<PublicLayout><Dashboard /></PublicLayout>} />
                    <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
                    <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
                </Routes>
                </Suspense>
            </Router>
            </AuthProvider>
        </QueryClientProvider>
    );
}

export default App;
