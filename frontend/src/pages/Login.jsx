import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const { login } = useAuth(); // Get login function from AuthContext

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        setError('');
        
        try {
            const result = await login(username, password);
            if (!result.success) {
                setError(result.error || 'Falha no login. Verifique suas credenciais.');
            }
        } catch (error) {
            setError('Erro de conexão. Verifique sua internet e tente novamente.');
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    // Rest of your component remains the same
    return (
        <div className="flex h-screen justify-center items-center">
            <div className="flex flex-col items-center container w-96">
                <img src={require('../assets/logo.png')} alt="Academy Logo" className="mb-4" />
                <span className="text-lg font-bold ">ACADEMIA</span>
                <span className="text-4xl font-bold leading-tight text-[#d4af37]">DOIS DE OURO</span>
                <h1 className="mt-5 text-center text-2xl font-bold">Login</h1>
                
                {error && (
                    <div className="w-full mt-2 p-2 bg-red-100 text-red-700 border border-red-300 rounded">
                        {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="mt-4 w-full">
                    <div className="form-group">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Nome de Usuário</label>
                        <input
                            type="text"
                            className="p-2 mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:ring focus:ring-blue-500"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>
                    <button 
                        type="submit" 
                        className={`mt-4 w-full font-bold py-2 rounded ${
                            isLoading 
                                ? 'bg-blue-300 cursor-not-allowed' 
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Entrando...' : 'Login'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;