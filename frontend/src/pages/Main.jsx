import React, { useState, useEffect } from 'react';

import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import AlunosDashboard from '../components/AlunosDashboard';
import TurmasDashboard from '../components/TurmasDashboard';
import InstrutoresDashboard from '../components/InstrutoresDashboard';
import FrequenciaDashboard from '../components/FrequenciaDashboard';
import GraduacoesDashboard from '../components/GraduacoesDashboard';

const Main = ({ onLogout }) => {
    const userId = useState(localStorage.getItem('userId'))[0];
    const token = localStorage.getItem('token');
    const apiUri = 'http://localhost:8000/api/';
    const [selectedDashboard, setSelectedDashboard] = useState('alunos'); // Default dashboard

    useEffect(() => {
        if (window.location.pathname === '/main/') { 
            const fetchData = async () => {
                try {
                    const response = await fetch(apiUri, {
                        headers: {
                            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
                        },
                    });

                    if (!response.ok) {
                        const errorData = await response.json();
                        if (errorData.code === 'token_not_valid') {
                            window.alert('Sessão expirada!')
                            onLogout(); 
                        }
                    }
                } catch (error) {
                    console.error('Error fetching data:', error);
                }
            };

            fetchData();
        }
    }, [ onLogout ,token]); // Add an empty dependency array

    const renderDashboard = () => {
        switch (selectedDashboard) {
            case 'alunos':
                return <AlunosDashboard />;
            case 'turmas':
                return <TurmasDashboard />;
            case 'instrutores':
                return <InstrutoresDashboard />;
            case 'frequencia':
                return <FrequenciaDashboard />;
            case 'graduacoes':
                return <GraduacoesDashboard />;
            default:
                return <AlunosDashboard />;
        }
    };

    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar selectedDashboard={selectedDashboard} setSelectedDashboard={setSelectedDashboard} /> {/* Pass function to Sidebar */}
            <div className="flex flex-1 flex-col">
                <TopBar onLogout={onLogout} userId={userId} />
                <div className="flex-1 overflow-auto">
                    {renderDashboard()} {/* Render the selected dashboard */}
                </div>
                <Footer
                    developerName="Victor Kelvin"
                    githubUrl="https://github.com/victorkelvin"
                    linkedinUrl="https://linkedin.com/in/victor-kelvin"
                    whatsappUrl="https://wa.me/5561985702670"
                />
            </div>
        </div>
    );
};

export default Main;