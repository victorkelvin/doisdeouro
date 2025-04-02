import React, { useState } from 'react';

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
    const [selectedDashboard, setSelectedDashboard] = useState(''); // Default dashboard


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