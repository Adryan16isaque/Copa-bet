const API_URL = 'http://localhost:3000/api';

const api = {
    async get(endpoint) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { 
                    success: false, 
                    message: errorData.message || `Erro do servidor: ${response.status}` 
                };
            }
            return await response.json();
        } catch (error) {
            console.error('API GET Error:', error);
            return { success: false, message: 'Erro de conexão com o servidor. Verifique se o backend está rodando.' };
        }
    },

    async post(endpoint, data) {
        try {
            const response = await fetch(`${API_URL}${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                return { 
                    success: false, 
                    message: errorData.message || `Erro do servidor: ${response.status}` 
                };
            }
            return await response.json();
        } catch (error) {
            console.error('API POST Error:', error);
            return { success: false, message: 'Erro de conexão com o servidor. Verifique se o backend está rodando.' };
        }
    }
};
