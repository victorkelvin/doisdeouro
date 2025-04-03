const BASE_URL = 'http://localhost:8000/api/';

const getToken = () => {
    return localStorage.getItem('token');
};

const handleResponse = async (response) => {
    if (!response.ok) {
        const errorData = await response.json();

        if (errorData.code === 'token_not_valid') {
            window.alert('Sessão expirada!');
            window.localStorage.clear(); // Clear all info in LocalStorage
            window.location.href = '/login'; // Redirect to login page

        }
        console.error('Error:', errorData);
    }
    return response.json();
};

const apiRequest = async (endpoint, method , body = null) => {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json',
        },
        body: body ? JSON.stringify(body) : null,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return handleResponse(response);
};

const apiFormDataRequest = async (endpoint, method, formData) => {
    const options = {
        method,
        headers: {
            'Authorization': `Bearer ${getToken()}`,
        },
        body: formData,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    return handleResponse(response);
};


export { apiRequest, apiFormDataRequest };