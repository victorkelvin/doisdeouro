import React, { useEffect, useState, useRef } from 'react';
import { sortData, renderSortIndicator } from '../utils/sorting';
import { formatDate } from '../utils/utils';
import useAulaForm from '../hooks/useAulaForm';
import { fetchAulas, createAula, updateAula } from '../services/aulasApi';
import { fetchTurmas } from '../services/turmasApi';
import { fetchAlunos } from '../services/alunosApi';
import { fetchInstrutores } from '../services/instrutoresApi';
import SearchBar from './SearchBar';
import SpanCard from './SpanCard';
import Select from 'react-select';
import MultiSelect from './MultiSelect';


const AulaDashboard = () => {
    const [aulas, setAulas] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [alunos, setAlunos] = useState([]);
    const [instrutores, setInstrutores] = useState([]);
    const [selectedAula, setSelectedAula] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });

    const cardRef = useRef(null);

    // Modified form state to handle multiple selections
    const {
        data,
        alunos_presentes,
        horario_inicio,
        horario_fim,
        observacao,
        turma,
        instrutores_aula,
        editingId,
        setData,
        setAlunosPresentes,
        setHorarioInicio,
        setHorarioFim,
        setObservacao,
        setTurma,
        setInstrutoresAula,
        resetForm,
        setEditingId,
    } = useAulaForm();

    const loadData = async () => {
        const aulasData = await fetchAulas();
        setAulas(aulasData.results);
        const alunosData = await fetchAlunos();
        setAlunos(alunosData.results);

        setTurmas(await fetchTurmas());
        setInstrutores(await fetchInstrutores());
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleMouseEnter = (aula, e) => {
        setSelectedAula(aula);

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let x = e.clientX + 10; // Offset from cursor
        let y = e.clientY + 10;

        setTimeout(() => {
            if (cardRef.current) {
                const cardWidth = cardRef.current.offsetWidth;
                const cardHeight = cardRef.current.offsetHeight;

                // Adjust horizontal position if needed
                if (x + cardWidth > viewportWidth) {
                    x = e.clientX - cardWidth - 10;
                }

                // Adjust vertical position if needed
                if (y + cardHeight > viewportHeight) {
                    y = e.clientY - cardHeight - 10;
                }

                setCardPosition({ x, y });
            }
        }, 0);

        setCardPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setSelectedAula(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const body = {
                data,
                alunos_presentes: alunos_presentes.map((aluno) => aluno.id),
                horario_inicio,
                horario_fim,
                observacao,
                turma: turma.id,
                instrutores: instrutores_aula.map((instrutor) => instrutor.id),
            };

            if (editingId) {
                await updateAula(editingId, body);
            } else {
                await createAula(body);
            }

            resetForm();
            const aulasData = await fetchAulas();
            setAulas(aulasData.results);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (aula) => {
        setData((aula.data));
        setAlunosPresentes(aula.alunos_presentes || []);
        setHorarioInicio(aula.horario_inicio);
        setHorarioFim(aula.horario_fim);
        setObservacao(aula.observacao || '');
        setTurma(aula.turma);
        setInstrutoresAula(aula.instrutores || []);
        setEditingId(aula.id);
    };

    const formatAlunoOptions = (alunos) => {
        return alunos.map((aluno) => ({
            value: aluno.id,
            label: `${aluno.nome} (${aluno.faixa} - ${aluno.turma_nome})`,
            data: aluno,
        }));
    };

    const formatInstrutorOptions = (instrutores) => {
        return instrutores.map((instrutor) => ({
            value: instrutor.id,
            label: `${instrutor.nome}`,
            data: instrutor,
        }));
    };


    return (
        <div className="p-4 relative">
            <h1 className="text-2xl font-bold mb-4">Registro de Aulas</h1>
            <button
                onClick={() => setIsFormVisible(!isFormVisible)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white rounded px-4 py-2 mb-4 flex items-center transition-all duration-200 shadow-md"
            >
                {isFormVisible ? (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <span>Ocultar Formulário</span>
                    </>
                ) : (
                    <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                        </svg>
                        <span>Mostrar Formulário</span>
                    </>
                )}
            </button>

            {isFormVisible && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200 transition-all duration-300">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">{editingId ? 'Editar Aula' : 'Registrar Nova Aula'}</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Data</label>
                                <input
                                    type="date"
                                    value={data ? data.split('T')[0] : ''}
                                    onChange={(e) => setData(e.target.value)}
                                    required
                                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Turma</label>
                                <select
                                    value={turma.id}
                                    onChange={(e) => setTurma(e.target.value)}
                                    required
                                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                >
                                    <option value="">Selecione a Turma</option>
                                    {turmas.map((t) => (
                                        <option key={t.id} value={t.id}>
                                            {t.nome}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <MultiSelect
                                    label="Instrutores"
                                    options={formatInstrutorOptions(instrutores)}
                                    value={instrutores_aula.map((instrutor) => ({
                                        value: instrutor.id,
                                        label: instrutor.nome,
                                    }))}
                                    onChange={(selectedOptions) =>
                                        setInstrutoresAula(
                                            selectedOptions.map((option) => ({
                                                id: option.value,
                                                nome: option.label,
                                            }))
                                        )
                                    }
                                    placeholder="Selecione os instrutores..."
                                />
                            </div>

                            <div>
                                <MultiSelect
                                    label="Alunos Presentes"
                                    options={formatAlunoOptions(alunos)}
                                    value={alunos_presentes.map((aluno) => ({
                                        value: aluno.id,
                                        label: aluno.nome,
                                    }))}
                                    onChange={(selectedOptions) =>
                                        setAlunosPresentes(
                                            selectedOptions.map((option) => ({
                                                id: option.value,
                                                nome: option.label,
                                            }))
                                        )
                                    }
                                    placeholder="Selecione os alunos..."
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Horário de Início</label>
                                <input
                                    type="time"
                                    value={horario_inicio}
                                    onChange={(e) => setHorarioInicio(e.target.value)}
                                    required
                                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 text-sm font-bold mb-2">Horário de Fim</label>
                                <input
                                    type="time"
                                    value={horario_fim}
                                    onChange={(e) => setHorarioFim(e.target.value)}
                                    required
                                    className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                />
                            </div>




                        </div>

                        <div className="mt-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Observação</label>
                            <textarea
                                value={observacao}
                                onChange={(e) => setObservacao(e.target.value)}
                                className="border rounded p-2 w-full h-24 focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                                placeholder="Adicione observações sobre a aula..."
                            />
                        </div>

                        <div className="flex space-x-2 mt-4">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-md transition-all duration-200"
                            >
                                {editingId ? 'Atualizar' : 'Registrar'}
                            </button>
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium py-2 px-4 rounded shadow-md transition-all duration-200"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="mb-4">
                <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} placeholder="Buscar por data (DD/MM/AAAA)" />
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer hover:bg-gray-100`}
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Data</span>
                                    {renderSortIndicator(sortDirection)}
                                </div>
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex items-center space-x-1">
                                    <span>Turma</span>
                                </div>
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex items-center space-x-1">
                                    <span>Instrutores</span>
                                </div>
                            </th>
                            <th className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider`}>
                                <div className="flex items-center space-x-1">
                                    <span>Alunos</span>
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {aulas.map((aula) => {
                            // Find related objects
                            return (
                                <tr
                                    key={aula.id}
                                    onMouseEnter={(e) => handleMouseEnter(aula, e)}
                                    onMouseLeave={handleMouseLeave}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                        {formatDate(aula.data)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {aula.turma ? aula.turma.nome : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {aula.instrutores ? aula.instrutores.map((inst) => { return inst.nome + ' | ' }) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                                            {aula.alunos_presentes.length}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(aula)}
                                            className="bg-amber-500 hover:bg-amber-600 text-white rounded px-3 py-1 transition-colors duration-200"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/*             {selectedAula && (
                <SpanCard
                    ref={cardRef}
                    data={{
                        ...selectedAula,
                        turmaNome: turmas.find(t => t.id === selectedAula.turma)?.nome,
                        alunosCount: selectedAula.alunos_presentes?.length || 0,
                        instrutoresNames: getInstrutorNames(selectedAula),
                        formattedDate: formatDate(selectedAula.data),
                        formattedHorario: `${formatTime(selectedAula.horario_inicio)} - ${formatTime(selectedAula.horario_fim)}`
                    }}
                    position={cardPosition}
                    setCardPosition={setCardPosition}
                />
            )} */}
        </div>
    );
};

export default AulaDashboard;