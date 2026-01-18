// Frontend-only API using localStorage
// No backend required - all data stored in browser localStorage

// Initialize admin credentials with default users
const initializeAdminCredentials = () => {
    const stored = localStorage.getItem('admin_credentials');
    if (!stored) {
        const defaultCredentials = [
            {
                id: '1',
                username: 'superadmin',
                email: 'superadmin@nsmosa.org',
                password: 'SuperAdmin@2024!',
                role: 'SUPER_ADMIN',
                name: 'Super Administrator'
            },
            {
                id: '2',
                username: 'admin',
                email: 'admin@nsmosa.org',
                password: 'Admin@2024!',
                role: 'ADMIN',
                name: 'Administrator'
            },
            {
                id: '3',
                username: 'gurjeet',
                email: 'vjwgurjeet@gmail.com',
                password: '12345678',
                role: 'ADMIN',
                name: 'Gurjeet Singh Sahni',
                phone: '9848529755',
                batchYear: '1998'
            }
        ];
        localStorage.setItem('admin_credentials', JSON.stringify(defaultCredentials));
        return defaultCredentials;
    }
    
    // Check if Gurjeet's account exists, if not add it
    const credentials = JSON.parse(stored);
    const gurjeetExists = credentials.find((c: any) => 
        c.email === 'vjwgurjeet@gmail.com' || c.username === 'gurjeet'
    );
    
    if (!gurjeetExists) {
        credentials.push({
            id: '3',
            username: 'gurjeet',
            email: 'vjwgurjeet@gmail.com',
            password: '12345678',
            role: 'ADMIN',
            name: 'Gurjeet Singh Sahni',
            phone: '9848529755',
            batchYear: '1998'
        });
        localStorage.setItem('admin_credentials', JSON.stringify(credentials));
    }
    
    return credentials;
};

// Initialize on module load
initializeAdminCredentials();

const api = {
    get: async (url: string) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const key = url.replace('/api/', '').replace('/content/', 'content_');
        const data = localStorage.getItem(key);
        
        if (data) {
            try {
                const parsed = JSON.parse(data);
                return { data: { content: parsed } };
            } catch (e) {
                return { data: { content: data } };
            }
        }
        
        // Return empty if not found
        return { data: { content: null } };
    },
    
    post: async (url: string, payload: any) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        // Handle auth login
        if (url.includes('/auth/login')) {
            // Initialize and get credentials
            const credentials = initializeAdminCredentials();
            const user = credentials.find((c: any) => 
                (c.username === payload.username || c.email === payload.username) && 
                c.password === payload.password
            );
            
            if (user) {
                const token = `mock_token_${Date.now()}`;
                const userData = {
                    id: user.id || '1',
                    email: user.email || payload.username,
                    role: user.role || 'ADMIN',
                    username: user.username || payload.username
                };
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));
                return { 
                    data: { 
                        data: {
                            token,
                            user: userData
                        }
                    } 
                };
            }
            
            throw new Error('Invalid credentials');
        }
        
        return { data: { success: true } };
    },
    
    put: async (url: string, payload: any) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const key = url.replace('/api/', '').replace('/content/', 'content_');
        localStorage.setItem(key, JSON.stringify(payload.content || payload));
        
        return { data: { success: true } };
    },
    
    delete: async (url: string) => {
        await new Promise(resolve => setTimeout(resolve, 200));
        
        const key = url.replace('/api/', '').replace('/content/', 'content_');
        localStorage.removeItem(key);
        
        return { data: { success: true } };
    }
};

export default api;
