import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = ({ setIsAuthenticated }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8000/api/token/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('token', data.access); // Store the JWT token
            localStorage.setItem('userId', username); // Store the username
            setIsAuthenticated(true); // Set authentication state
            navigate('/main', { state: { userId: username } }); // Pass username to Main
        } else {
            alert('Falha no login. Verifique suas credenciais.');
        }
    };

    return (
        <div className="flex h-screen justify-center items-center">
<div className="flex flex-col items-center container w-96">
    <img src={require('../assets/logo.png')} alt="Academy Logo" className="mb-4" />
    <span className="text-lg font-bold ">ACADEMIA</span>
    <span className="text-4xl font-bold leading-tight text-[#d4af37]">DOIS DE OURO</span>
                <h1 className="mt-5 text-center text-2xl font-bold">Login</h1>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div className="form-group">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                        <input
                            type="text"
                            className="p-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group mt-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Senha</label>
                        <input
                            type="password"
                            className="p-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="mt-4 w-full bg-blue-500 text-white font-bold py-2 rounded hover:bg-blue-600">Login</button>
                </form>
            </div>
        </div>
    );
};

export default Login;
