import React, { useEffect, useState, useRef } from 'react';
import { sortData, renderSortIndicator, filterAlunos } from '../utils/sorting';
import useAlunoForm from '../hooks/useAlunoForm';
import { fetchAlunos, fetchGraduacoes, createAluno, updateAluno } from '../services/alunosApi';
import { fetchTurmas } from '../services/turmasApi';
import SearchBar from './SearchBar';
import AlunoCard from './AlunoCard';


const AlunosDashboard = () => {
    const [alunos, setAlunos] = useState([]);
    const [graduacoes, setGraduacoes] = useState([]);
    const [turmas, setTurmas] = useState([]);
    const [selectedAluno, setSelectedAluno] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortDirection, setSortDirection] = useState('asc');
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);

    const {
        nome,
        data_nascimento,
        contato,
        email,
        graduacao,
        turma,
        ativo,
        foto,
        fotoPreview,
        editingId,
        setNome,
        setDataNascimento,
        setContato,
        setEmail,
        setGraduacao,
        setTurma,
        setAtivo,
        setFotoPreview,
        resetForm,
        handleFileChange,
        setEditingId,
    } = useAlunoForm();

    const loadData = async () => {
        const alunosData = await fetchAlunos();
        setAlunos(alunosData.results);
        const graduacoesData = await fetchGraduacoes();
        setGraduacoes(graduacoesData.results);
        const turmasData = await fetchTurmas();
        setTurmas(turmasData.results);
    };

    useEffect(() => {
        loadData();
    }, []);



    const handleMouseEnter = (aluno, e) => {
        setSelectedAluno(aluno);

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
        setSelectedAluno(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('data_nascimento', data_nascimento);
            formData.append('contato', contato);
            formData.append('email', email);
            formData.append('graduacao', graduacao);
            formData.append('turma', turma);
            formData.append('ativo', ativo);
            if (foto) {
                formData.append('foto', foto);
            }

            if (editingId) {
                await updateAluno(editingId, formData);
            } else {
                await createAluno(formData);
            }

            resetForm();
            fetchAlunos();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error appropriately (show message to user, etc.)
        }
    };

    const handleEdit = (aluno) => {
        setNome(aluno.nome);
        setAtivo(aluno.ativo === true || aluno.ativo === "true"); // Convert to boolean
        setDataNascimento(aluno.data_nascimento);
        setContato(aluno.contato || '');
        setEmail(aluno.email || '');
        setGraduacao(aluno.graduacao || '');
        setTurma(aluno.turma || '');
        setEditingId(aluno.id);
        setFotoPreview(aluno.foto);
    };

    // Function to toggle active status directly from the table
    const toggleAtivoStatus = async (aluno) => {
        const newStatus = !(aluno.ativo === true || aluno.ativo === "true");
        const formData = new FormData();
        formData.append('nome', aluno.nome);
        formData.append('data_nascimento', aluno.data_nascimento || '');
        formData.append('contato', aluno.contato || '');
        formData.append('email', aluno.email || '');
        formData.append('graduacao', aluno.graduacao || '');
        formData.append('turma', aluno.turma || '');
        formData.append('ativo', newStatus);

        await updateAluno(aluno.id, formData);
        const alunosData = await fetchAlunos();
        setAlunos(alunosData.results);
    };

    const filteredAlunos = filterAlunos(alunos, searchTerm);


    // Handle sorting
    // const handleSort = (option) => {
    //     if (sortOption === option) {
    //         // If clicking the same column, toggle direction
    //         setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    //     } else {
    //         // New column, default to ascending
    //         setSortOption(option);
    //         setSortDirection('asc');
    //     }
    // };

    const sortedAlunos = sortData(filteredAlunos, sortDirection);


    return (
        <div className="p-4 relative">
            <h1 className="text-2xl font-bold mb-4">Alunos</h1>
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
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">{editingId ? 'Editar Aluno' : 'Adicionar Novo Aluno'}</h2>
                    <form onSubmit={handleSubmit}>
                        <input
                            type="text"
                            placeholder="Nome"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                        />
                        <input
                            type="date"
                            value={data_nascimento}
                            onChange={(e) => setDataNascimento(e.target.value)}
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                        />
                        <input
                            type="text"
                            placeholder="Contato"
                            value={contato}
                            onChange={(e) => setContato(e.target.value)}
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                        />



                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Foto</label>
                            <input
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={handleFileChange}
                                className="border rounded p-2 w-full bg-white"
                            />
                            {fotoPreview && (
                                <div className="mt-2">
                                    <img src={fotoPreview} alt="Preview" className="w-32 h-32 object-cover rounded border border-gray-300" />
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Graduação</label>
                            <select
                                value={graduacao}
                                onChange={(e) => setGraduacao(e.target.value)}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                            >
                                <option value="">Selecione a Graduação</option>
                                {graduacoes.map((grad) => (
                                    <option key={grad.id} value={grad.id}>
                                        {grad.faixa}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">Turma</label>
                            <select
                                value={turma}
                                onChange={(e) => setTurma(e.target.value)}
                                className="border rounded p-2 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                            >
                                <option value="">Selecione a Turma</option>
                                {turmas.map((turma) => (
                                    <option key={turma.id} value={turma.id}>
                                        {turma.nome}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Add the checkbox for "Ativo" status */}
                        <div className="flex items-center mb-3">
                            <input
                                id="ativo-checkbox"
                                type="checkbox"
                                checked={ativo}
                                onChange={(e) => setAtivo(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="ativo-checkbox" className="ml-2 block text-sm text-gray-700 font-bold">
                                Aluno Ativo
                            </label>
                        </div>

                        <div className="flex space-x-2">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded shadow-md transition-all duration-200"
                            >
                                {editingId ? 'Atualizar' : 'Adicionar'}
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

            <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center space-x-1">
                                    <span>Status</span>
                                </div>
                            </th>

                            <th
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer  hover:bg-gray-100`}
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Nome</span>
                                    {renderSortIndicator(sortDirection)}
                                </div>
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer  hover:bg-gray-100`}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Graduação</span>
                                </div>
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer  hover:bg-gray-100`}
                            >
                                <div className="flex items-center space-x-1">
                                    <span>Turma</span>
                                </div>
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedAlunos.map((aluno) => {
                            // Find the corresponding graduation object
                            const graduacaoObj = graduacoes.find(grad => grad.id === aluno.graduacao);
                            const turmaObj = turmas.find(turma => turma.id === aluno.turma);
                            // Convert ativo to boolean for display
                            const isAtivo = aluno.ativo === true || aluno.ativo === "true";

                            return (
                                <tr
                                    key={aluno.id}
                                    onMouseEnter={(e) => handleMouseEnter(aluno, e)}
                                    onMouseLeave={handleMouseLeave}
                                    className={`hover:bg-gray-50 ${!isAtivo ? 'bg-gray-50' : ''}`}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <input
                                                type="checkbox"
                                                checked={isAtivo}
                                                onChange={() => toggleAtivoStatus(aluno)}
                                                className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out cursor-pointer"
                                            />
                                            <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isAtivo
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                                }`}>
                                                {isAtivo ? 'Ativo' : 'Inativo'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{aluno.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{graduacaoObj ? graduacaoObj.faixa : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{turmaObj ? turmaObj.nome : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(aluno)}
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

            {
                selectedAluno && (
                    <AlunoCard aluno={selectedAluno} position={cardPosition} setCardPosition={setCardPosition} />
                    
/*                     <div
                        ref={cardRef}
                        className="fixed bg-white rounded-lg border p-4 shadow-lg max-w-xs z-50"
                        style={{
                            left: `${cardPosition.x}px`,
                            top: `${cardPosition.y}px`
                        }}
                    >
                        <div className="flex flex-col items-center">
                            <img
                                src={selectedAluno.foto}
                                alt={selectedAluno.nome}
                                className="w-32 h-32 object-cover rounded-lg mb-2 border border-gray-200"
                            />
                            <h2 className='font-bold text-lg text-gray-900'>{selectedAluno.nome}</h2>
                            <div className="w-full mt-2">
                                <p className="text-sm"><span className="font-semibold">Graduação:</span> {graduacoes.find(grad => grad.id === selectedAluno.graduacao)?.faixa || 'N/A'}</p>
                                <p className="text-sm"><span className="font-semibold">Status:</span>
                                    <span className={`ml-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${selectedAluno.ativo === true || selectedAluno.ativo === "true"
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {selectedAluno.ativo === true || selectedAluno.ativo === "true" ? 'Ativo' : 'Inativo'}
                                    </span>
                                </p>
                                <p className="text-sm"><span className="font-semibold">Data de Nascimento:</span> {selectedAluno.data_nascimento ? formatDate(selectedAluno.data_nascimento) : 'N/A'}</p>
                                <p className="text-sm"><span className="font-semibold">Contato:</span> {selectedAluno.contato || 'N/A'}</p>
                            </div>
                        </div>
                    </div> */
                )
            }
        </div >
    );
};

export default AlunosDashboard;