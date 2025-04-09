import React, { useState } from 'react';

const AlunoCardModal = ({ 
    isOpen, 
    onClose, 
    alunos, 
    selectedAlunos, 
    onSelectAluno 
}) => {
    const [searchTerm, setSearchTerm] = useState('');
    
    if (!isOpen) return null;

    const filteredAlunos = alunos.filter(aluno => 
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.faixa?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        aluno.turma_nome?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const isSelected = (alunoId) => {
        return selectedAlunos.some(aluno => aluno.id === alunoId);
    };

    const handleSelectAluno = (aluno) => {
        onSelectAluno(aluno);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-black bg-opacity-50">
            <div className="relative bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="flex justify-between items-center px-6 py-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">Selecionar Alunos</h2>
                    <button 
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                
                {/* Search Box */}
                <div className="px-6 py-3 border-b">
                    <input
                        type="text"
                        placeholder="Buscar alunos..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                    />
                </div>
                
                {/* Cards Grid */}
                <div className="flex-grow overflow-y-auto p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {filteredAlunos.map(aluno => (
                            <div 
                                key={aluno.id}
                                onClick={() => handleSelectAluno(aluno)}
                                className={`cursor-pointer rounded-lg overflow-hidden shadow-md border ${
                                    isSelected(aluno.id) 
                                    ? 'border-blue-500 ring-2 ring-blue-300' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                            >
                                <div className="relative">
                                    {/* Placeholder for photo */}
                                    <div className="bg-gray-200 h-40 flex items-center justify-center">
                                        {aluno.foto ? (
                                            <img 
                                                src={aluno.foto} 
                                                alt={aluno.nome} 
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        )}
                                    </div>
                                    
                                    {/* Selected indicator */}
                                    {isSelected(aluno.id) && (
                                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="p-3">
                                    <h3 className="font-medium text-gray-800 truncate">{aluno.nome}</h3>
                                    <div className="text-sm text-gray-500 mt-1">
                                        <p>{aluno.faixa || "Sem faixa"}</p>
                                        <p>{aluno.turma_nome || "Sem turma"}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                
                {/* Footer with actions */}
                <div className="px-6 py-4 border-t flex justify-between items-center bg-gray-50">
                    <div className="text-sm text-gray-600">
                        {selectedAlunos.length} aluno(s) selecionado(s)
                    </div>
                    <div className="flex space-x-2">
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-300 hover:bg-gray-400 text-gray-800 rounded transition-colors duration-200"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={onClose}
                            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors duration-200"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AlunoCardModal;