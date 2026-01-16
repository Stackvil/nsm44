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
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import Member from './pages/Member';

// About Pages
import About from './pages/about/About';
import AboutOverview from './pages/about/AboutOverview';
import PresidentsMessage from './pages/about/PresidentsMessage';
import ExecutiveCommittee from './pages/about/ExecutiveCommittee';
import AlumniChapters from './pages/about/AlumniChapters';
import AlumniBenefits from './pages/about/AlumniBenefits';
import AnnualReports from './pages/about/AnnualReports';

// Connect Pages
import Connect from './pages/connect/Connect';
import MyProfile from './pages/connect/MyProfile';
import AlumniEvent from './pages/connect/AlumniEvent';
import AlumniDirectoryConnect from './pages/connect/AlumniDirectory';
import BusinessDirectory from './pages/connect/BusinessDirectory';
import HowToGive from './pages/connect/HowToGive';
import ConnectWithUs from './pages/connect/ConnectWithUs';

// Reunion Pages
import Reunion from './pages/reunion/Reunion';
import AboutReunion from './pages/reunion/AboutReunion';
import ReunionGallery from './pages/reunion/ReunionGallery';

// Gallery Pages
import Gallery from './pages/gallery/Gallery';
import PhotoGallery from './pages/gallery/PhotoGallery';
import VideoGallery from './pages/gallery/VideoGallery';

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
            </Router>
        </QueryClientProvider>
    );
}

export default App;
