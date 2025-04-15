import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

import TopBar from '../components/TopBar';
import Footer from '../components/Footer';

import AlunosDashboard from './AlunosDashboard';
import TurmasDashboard from './TurmasDashboard';
import InstrutoresDashboard from './InstrutoresDashboard';
import AulasDashboard from './AulasDashboard';
import RelatoriosDashboard from './RelatoriosDashboard';

const Main = () => {
    const user_id = localStorage.getItem('user_id');
    const location = useLocation();
    const [selectedDashboard, setSelectedDashboard] = useState('aulas');

    // Update selected dashboard based on current path
    useEffect(() => {
        const pathSegments = location.pathname.split('/');
        const currentDashboard = pathSegments[pathSegments.length - 1];
        if (currentDashboard && ['alunos', 'turmas', 'instrutores', 'aulas', 'relatorios'].includes(currentDashboard)) {
            setSelectedDashboard(currentDashboard);
        }
    }, [location.pathname]);

    return (
        <div className="flex h-screen overflow-hidden">
            <div className="flex flex-1 flex-col">
                <TopBar 
                    userId={user_id} 
                    selectedDashboard={selectedDashboard} 
                    setSelectedDashboard={setSelectedDashboard}
                />
                <div className="flex-1 overflow-auto">
                    <Routes>
                        <Route path="alunos" element={<AlunosDashboard />} />
                        <Route path="turmas" element={<TurmasDashboard />} />
                        <Route path="instrutores" element={<InstrutoresDashboard />} />
                        <Route path="aulas" element={<AulasDashboard />} />
                        <Route path="relatorios" element={<RelatoriosDashboard />} />
                        <Route path="/" element={<Navigate to="aulas" replace />} />
                        <Route path="*" element={<Navigate to="aulas" replace />} />
                    </Routes>
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