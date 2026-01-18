import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User } from 'firebase/auth';
import { onAuthStateChange, getUserData } from '../services/authService';
import { AlumniUser } from '../services/authService';

interface AuthContextType {
    currentUser: User | null;
    userData: AlumniUser | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
    currentUser: null,
    userData: null,
    loading: false // Start with false to not block initial render
});

export const useAuth = () => {
    return useContext(AuthContext);
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [userData, setUserData] = useState<AlumniUser | null>(null);
    const [loading, setLoading] = useState<boolean>(false); // Start with false to not block render

    useEffect(() => {
        let unsubscribe: (() => void) | undefined;
        let loadingTimeout: NodeJS.Timeout;

        // Defer auth initialization to allow immediate render
        const initAuth = () => {
            unsubscribe = onAuthStateChange(async (user) => {
                setCurrentUser(user);
                
                if (user) {
                    // Fetch additional user data from Firestore asynchronously
                    // Don't block rendering while fetching
                    getUserData(user.uid).then((data) => {
                        setUserData(data);
                    }).catch((error) => {
                        console.error('Error fetching user data:', error);
                        setUserData(null);
                    });
                } else {
                    setUserData(null);
                }
                
                setLoading(false);
            });
        };

        // Use requestIdleCallback if available, otherwise setTimeout
        if ('requestIdleCallback' in window) {
            requestIdleCallback(() => {
                initAuth();
            });
        } else {
            setTimeout(() => {
                initAuth();
            }, 0);
        }

        // Fallback: ensure loading state is cleared
        loadingTimeout = setTimeout(() => {
            setLoading(false);
        }, 300);

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
            if (loadingTimeout) {
                clearTimeout(loadingTimeout);
            }
        };
    }, []);

    const value: AuthContextType = {
        currentUser,
        userData,
        loading
    };

    // Render children immediately - don't wait for auth
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
