import React, { useState, useEffect } from 'react';
import { formatDate } from '../utils/utils';
import MultiSelect from '../components/MultiSelect';
import SearchBar from '../components/SearchBar';
import { fetchTurmas } from '../services/turmasApi';
import { fetchAlunos } from '../services/alunosApi';
import { fetchInstrutores } from '../services/instrutoresApi';
import { fetchRelatorios } from '../services/relatoriosApi';

const RelatoriosDashboard = () => {
    // States for filters
    const [dataInicio, setDataInicio] = useState('');
    const [dataFim, setDataFim] = useState('');
    const [tipoRelatorio, setTipoRelatorio] = useState('presenca');
    const [turmasSelecionadas, setTurmasSelecionadas] = useState([]);
    const [alunosSelecionados, setAlunosSelecionados] = useState([]);
    const [instrutoresSelecionados, setInstrutoresSelecionados] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    
    // States for data
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [instrutores, setInstrutores] = useState([]);
    const [resultados, setResultados] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // State to control filters visibility
    const [isFiltersVisible, setIsFiltersVisible] = useState(true);

    // Load initial data
    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [turmasData, alunosData, instrutoresData] = await Promise.all([
                    fetchTurmas(),
                    fetchAlunos(),
                    fetchInstrutores(),
                ]);
                
                setTurmas(turmasData);
                setAlunos(alunosData.results || alunosData);
                setInstrutores(instrutoresData);
            } catch (error) {
                console.error('Error fetching initial data:', error);
                setError('Erro ao carregar dados iniciais. Por favor, tente novamente.');
            }
        };

        fetchInitialData();
    }, []);

    // Format options for MultiSelect components
    const formatTurmaOptions = (turmas) => {
        return turmas.map((turma) => ({
            value: turma.id,
            label: turma.nome,
            data: turma,
        }));
    };

    const formatAlunoOptions = (alunos) => {
        return alunos.map((aluno) => ({
            value: aluno.id,
            label: `${aluno.nome} (${aluno.faixa || 'N/A'} - ${aluno.turma?.nome || 'Sem turma'})`,
            data: aluno,
        }));
    };

    const formatInstrutorOptions = (instrutores) => {
        return instrutores.map((instrutor) => ({
            value: instrutor.id,
            label: instrutor.nome,
            data: instrutor,
        }));
    };

    // Handler to generate report
    const handleGerarRelatorio = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            const filters = {
                dataInicio,
                dataFim,
                tipo: tipoRelatorio,
                turmas: turmasSelecionadas,
                alunos: alunosSelecionados,
                instrutores: instrutoresSelecionados
            };
            
            const response = await fetchRelatorios(filters);
            setResultados(response.results || response);
        } catch (error) {
            console.error('Error generating report:', error);
            setError('Erro ao gerar relatório. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Handler to export report to XLS
    const handleExportarXLS = async () => {
        setIsLoading(true);
        setError(null);
        
        try {
            // Prepare query parameters
            const params = new URLSearchParams();
            
            if (dataInicio) params.append('data_inicio', dataInicio);
            if (dataFim) params.append('data_fim', dataFim);
            
            if (turmasSelecionadas.length > 0) {
                turmasSelecionadas.forEach(turma => {
                    params.append('turmas', turma.id);
                });
            }
            
            if (alunosSelecionados.length > 0) {
                alunosSelecionados.forEach(aluno => {
                    params.append('alunos', aluno.id);
                });
            }
            
            if (instrutoresSelecionados.length > 0) {
                instrutoresSelecionados.forEach(instrutor => {
                    params.append('instrutores', instrutor.id);
                });
            }
            
            params.append('tipo', tipoRelatorio);
            params.append('format', 'xlsx');  // Request XLS format
            
            // Create a download link and trigger download
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/atendimento/relatorios/export/?${params.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });
            
            if (!response.ok) {
                throw new Error('Falha ao exportar relatório');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            
            // Set filename based on report type and date
            const today = new Date().toISOString().split('T')[0];
            a.download = `relatorio_${tipoRelatorio}_${today}.xlsx`;
            
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error) {
            console.error('Error exporting report:', error);
            setError('Erro ao exportar relatório. Por favor, tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    // Filter results based on search term
    const filteredResultados = resultados.filter(item => {
        if (!searchTerm) return true;
        
        // Adjust search logic based on data structure
        const searchFields = [];
        
        // Add fields based on report type
        if (tipoRelatorio === 'presenca') {
            searchFields.push(
                item.aluno?.nome,
                item.turma?.nome,
                formatDate(item.data)
            );
        } else if (tipoRelatorio === 'aulas') {
            searchFields.push(
                item.turma?.nome,
                formatDate(item.data),
                item.instrutores?.map(i => i.nome).join(' ')
            );
        } else if (tipoRelatorio === 'instrutores') {
            searchFields.push(
                item.instrutor?.nome
            );
        }
        
        // Add common fields
        if (item.observacao) searchFields.push(item.observacao);
        
        return searchFields.filter(Boolean).some(field => 
            field.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    // Render columns based on report type
    const renderColumns = () => {
        switch (tipoRelatorio) {
            case 'presenca':
                return (
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aluno</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Presente</th>
                    </tr>
                );
            case 'aulas':
                return (
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrutores</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Alunos</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observação</th>
                    </tr>
                );
            case 'instrutores':
                return (
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Instrutor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Aulas</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Média Alunos/Aula</th>
                    </tr>
                );
            default:
                return (
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Detalhes</th>
                    </tr>
                );
        }
    };

    // Render row data based on report type
    const renderRowData = (item) => {
        switch (tipoRelatorio) {
            case 'presenca':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(item.data)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.aluno?.nome || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.turma?.nome || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.presente ? (
                                <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">Sim</span>
                            ) : (
                                <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded">Não</span>
                            )}
                        </td>
                    </>
                );
            case 'aulas':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(item.data)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.turma?.nome || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {item.instrutores?.map(inst => inst.nome).join(' | ') || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                {item.alunos_presentes?.length || 0}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.observacao || '-'}</td>
                    </>
                );
            case 'instrutores':
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.instrutor?.nome || 'N/A'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.total_aulas || 0}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.media_alunos?.toFixed(1) || '0.0'}</td>
                    </>
                );
            default:
                return (
                    <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{formatDate(item.data)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.detalhes || 'N/A'}</td>
                    </>
                );
        }
    };

    return (
        <div className="p-4 relative">
            <h1 className="text-2xl font-bold mb-4">Relatórios</h1>
            
            {/* Toggle filters visibility */}
            <button
                onClick={() => setIsFiltersVisible(!isFiltersVisible)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 mb-4 flex items-center transition-all duration-200 shadow-md"
            >
                {isFiltersVisible ? (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Ocultar Filtros</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span>Mostrar Filtros</span>
                    </>
                )}
            </button>

            {/* Filters section */}
            {isFiltersVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Filtros do Relatório</h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Tipo de Relatório</label>
                            <select
                                value={tipoRelatorio}
                                onChange={(e) => setTipoRelatorio(e.target.value)}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                            >
                                <option value="presenca">Frequência de Alunos</option>
                                <option value="aulas">Resumo de Aulas</option>
                                <option value="instrutores">Desempenho de Instrutores</option>
                            </select>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Data Início</label>
                                <input
                                    type="date"
                                    value={dataInicio}
                                    onChange={(e) => setDataInicio(e.target.value)}
                                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Data Fim</label>
                                <input
                                    type="date"
                                    value={dataFim}
                                    onChange={(e) => setDataFim(e.target.value)}
                                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <MultiSelect
                                label="Turmas"
                                options={formatTurmaOptions(turmas)}
                                value={turmasSelecionadas.map((turma) => ({
                                    value: turma.id,
                                    label: turma.nome,
                                }))}
                                onChange={(selectedOptions) =>
                                    setTurmasSelecionadas(
                                        selectedOptions.map((option) => ({
                                            id: option.value,
                                            nome: option.label,
                                        }))
                                    )
                                }
                                placeholder="Selecione as turmas..."
                            />
                        </div>
                        
                        <div>
                            <MultiSelect
                                label="Alunos"
                                options={formatAlunoOptions(alunos)}
                                value={alunosSelecionados.map((aluno) => ({
                                    value: aluno.id,
                                    label: aluno.nome,
                                }))}
                                onChange={(selectedOptions) =>
                                    setAlunosSelecionados(
                                        selectedOptions.map((option) => ({
                                            id: option.value,
                                            nome: option.label.split(' (')[0],
                                        }))
                                    )
                                }
                                placeholder="Selecione os alunos..."
                            />
                        </div>
                        
                        <div>
                            <MultiSelect
                                label="Instrutores"
                                options={formatInstrutorOptions(instrutores)}
                                value={instrutoresSelecionados.map((instrutor) => ({
                                    value: instrutor.id,
                                    label: instrutor.nome,
                                }))}
                                onChange={(selectedOptions) =>
                                    setInstrutoresSelecionados(
                                        selectedOptions.map((option) => ({
                                            id: option.value,
                                            nome: option.label,
                                        }))
                                    )
                                }
                                placeholder="Selecione os instrutores..."
                            />
                        </div>
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                        <button
                            onClick={handleGerarRelatorio}
                            disabled={isLoading}
                            className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-md transition-all duration-200 disabled:opacity-50"
                        >
                            {isLoading ? 'Gerando...' : 'Gerar Relatório'}
                        </button>
                        
                        <button
                            onClick={handleExportarXLS}
                            disabled={isLoading || resultados.length === 0}
                            className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded shadow-md transition-all duration-200 disabled:opacity-50 flex items-center"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Exportar XLS
                        </button>
                    </div>
                </div>
            )}

            {/* Error message */}
            {error && (
                <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
                    <p>{error}</p>
                </div>
            )}

            {/* Search bar */}
            {resultados.length > 0 && (
                <div className="mb-4">
                    <SearchBar 
                        searchTerm={searchTerm} 
                        setSearchTerm={setSearchTerm} 
                        placeholder="Buscar nos resultados..." 
                    />
                </div>
            )}

            {/* Results table */}
            {resultados.length > 0 && (
                <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            {renderColumns()}
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredResultados.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    {renderRowData(item)}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* No results message */}
            {!isLoading && resultados.length === 0 && (
                <div className="bg-gray-50 p-4 text-center rounded-lg border border-gray-200">
                    <p className="text-gray-500">Nenhum resultado encontrado. Utilize os filtros acima para gerar um relatório.</p>
                </div>
            )}
        </div>
    );
};

export default RelatoriosDashboard;