import React, { useState } from 'react';

import TopBar from '../components/TopBar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';

import AlunosDashboard from '../components/AlunosDashboard';
import TurmasDashboard from '../components/TurmasDashboard';
import InstrutoresDashboard from '../components/InstrutoresDashboard';
import AulaDashboard from '../components/AulaDashboard';
import GraduacoesDashboard from '../components/GraduacoesDashboard';

const Main = ({ onLogout }) => {
    const user_id = useState(localStorage.getItem('user_id'))[0];
    const [selectedDashboard, setSelectedDashboard] = useState(''); // Default dashboard


    const renderDashboard = () => {
        switch (selectedDashboard) {
            case 'alunos':
                return <AlunosDashboard />;
            case 'turmas':
                return <TurmasDashboard />;
            case 'instrutores':
                return <InstrutoresDashboard />;
            case 'aulas':
                return <AulaDashboard />;
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
                <TopBar onLogout={onLogout} userId={user_id} />
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