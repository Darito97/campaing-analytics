import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Snowflake, Gift } from 'lucide-react';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login({ username, password });
            navigate('/');
        } catch (err) {
            setError('Credenciales inválidas');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-red-700 to-green-900 overflow-hidden relative">

            <div className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: 'radial-gradient(white 2px, transparent 2px)',
                    backgroundSize: '30px 30px'
                }}>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full relative z-10 border-4 border-yellow-400">
                <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 bg-white p-3 rounded-full border-4 border-red-600">
                    <Gift className="w-10 h-10 text-red-600" />
                </div>

                <h1 className="text-3xl font-bold text-center text-red-700 mt-6 mb-2 font-serif">¡Feliz Navidad!</h1>
                <p className="text-center text-gray-500 mb-6">Inicia sesión en Campaign Analytics</p>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Usuario</label>
                        <input
                            type="text"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contraseña</label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        {loading ? 'Entrando...' : 'Ingresar'}
                        {!loading && <Snowflake className="ml-2 w-4 h-4" />}
                    </button>

                </form>
                <div className="text-center text-gray-500 mt-4">
                    Las credenciales de acceso son: usuario: admin, contraseña: admin123
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
