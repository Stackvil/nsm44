// Frontend-only API using localStorage
// No backend required - all data stored in browser localStorage

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
            // Check localStorage for credentials
            const credentials = JSON.parse(localStorage.getItem('admin_credentials') || '[]');
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
