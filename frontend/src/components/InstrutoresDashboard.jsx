import React, { useEffect, useState, useRef } from 'react';
import { fetchInstrutores, createInstrutor, updateInstrutor } from '../services/instrutoresApi';
import { fetchGraduacoes } from '../services/alunosApi';
import useInstrutorForm from '../hooks/useInstrutorForm';
import { filterData, sortData, renderSortIndicator } from '../utils/sorting';
import SearchBar from './SearchBar';
import SpanCard from './SpanCard';

const InstrutoresDashboard = () => {
    const [instrutores, setInstrutores] = useState([]);
    const [graduacoes, setGraduacoes] = useState([]);
    const [selectedInstrutor, setSelectedInstrutor] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc');
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [cardPosition, setCardPosition] = useState({ x: 0, y: 0 });
    const cardRef = useRef(null);


    const {
        username,
        nome,
        setNome,
        is_active,
        setIsActive,
        graduacao,
        email,
        contato,
        setUsername,
        editingId,
        setEditingId,
        setGraduacao,
        setEmail,
        setContato,
        resetForm,
        handleFileChange,
        setFotoPreview,
        fotoPreview,
        foto,
        password,
        setPassword,
        passwordConfirm,
        setPasswordConfirm,

    } = useInstrutorForm();

    const loadData = async () => {
        const instrutoresData = await fetchInstrutores();
        setInstrutores(instrutoresData.results);
        const graduacoesData = await fetchGraduacoes();
        setGraduacoes(graduacoesData.results);
    };

    useEffect(() => {
        loadData();
    }, []);


    const handleMouseEnter = (instrutor, e) => {
        setSelectedInstrutor(instrutor);

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
        setSelectedInstrutor(null);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('nome', nome);
            formData.append('email', email);
            formData.append('graduacao', graduacao);
            formData.append('contato', contato);
            formData.append('is_active', is_active,);
            formData.append('password', password);

            if (foto) {
                formData.append('foto', foto);
            }

            if (editingId) {
                await updateInstrutor(editingId, formData);
            } else {
                await createInstrutor(formData);
            }

            resetForm();
            const instrutoresData = await fetchInstrutores();
            setInstrutores(instrutoresData.results);
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (instrutor) => {
        setUsername(instrutor.username);
        setIsActive(instrutor.is_active === true || instrutor.is_active === "true");
        setNome(instrutor.nome);
        setContato(instrutor.contato || '');
        setEmail(instrutor.email || '');
        setGraduacao(instrutor.graduacao || '');
        setFotoPreview(instrutor.foto);
        setEditingId(instrutor.id);
        setPassword(instrutor.password || '');
    };

    const toggleAtivoStatus = async (instrutor) => {
        const newStatus = !(instrutor.is_active === true || instrutor.is_active === "true");
        const formData = new FormData();
        formData.append('username', instrutor.username);
        formData.append('nome', instrutor.nome || '');
        formData.append('contato', instrutor.contato || '');
        formData.append('email', instrutor.email || '');
        formData.append('graduacao', instrutor.graduacao || '');
        formData.append('is_active', newStatus);

        await updateInstrutor(instrutor.id, formData);
        const instrutoresData = await fetchInstrutores();
        setInstrutores(instrutoresData.results);
    };

    const filteredInstrutores = filterData(instrutores, searchTerm);


    const sortedInstrutores = sortData(filteredInstrutores, sortDirection);




    return (
        <div className="p-4 relative">
            <h1 className="text-2xl font-bold mb-4">Instrutors</h1>
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
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">{editingId ? 'Editar Instrutor' : 'Adicionar Novo Instrutor'}</h2>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        if (password !== passwordConfirm) {
                            alert("As senhas não coincidem!");
                            return;
                        }
                        handleSubmit(e);
                    }}>

                        <input type="text" name="username" placeholder="Nome de Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="password" name="password" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)}
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="password" name="passwordConfirm" placeholder="Confirmação de Senha" value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} required={!!password}
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />

                        <input type="text" name="nome" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)}
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="text" name="contato" placeholder="Contato" value={contato} onChange={(e) => setContato(e.target.value)}
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />

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

                        <div className="flex items-center mb-3">
                            <input
                                id="ativo-checkbox"
                                type="checkbox"
                                checked={is_active}
                                onChange={(e) => setIsActive(e.target.checked)}
                                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                            />
                            <label htmlFor="ativo-checkbox" className="ml-2 block text-sm text-gray-700 font-bold">
                                Ativo
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

            <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

            {/* tabela de instrutores */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                <div className="flex items-center space-x-1">
                                    <span>Status</span>
                                </div>
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Username</th>



                            <th
                                scope="col"
                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                            >
                                Nome
                                {renderSortIndicator(sortDirection)}
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Graduação</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Ações
                            </th>
                        </tr>
                    </thead>

                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedInstrutores.map((instrutor) => {
                            const graduacaoObj = graduacoes.find(grad => grad.id === instrutor.graduacao);
                            const isActive = instrutor.is_active === true || instrutor.is_active === "true";


                            return (

                                <tr key={instrutor.id} className="hover:bg-gray-50 transition-all duration-200 cursor-pointer"
                                    onMouseEnter={(e) => handleMouseEnter(instrutor, e)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <input
                                            type="checkbox"
                                            checked={instrutor.is_active === true || instrutor.is_active === "true"}
                                            onChange={() => toggleAtivoStatus(instrutor)}
                                            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                                        />
                                        <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${isActive
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {isActive ? 'Ativo' : 'Inativo'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{instrutor.username}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instrutor.nome}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{graduacaoObj ? graduacaoObj.faixa : 'N/A'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instrutor.contato}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{instrutor.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(instrutor)}
                                            className="bg-amber-500 hover:bg-amber-600 text-white rounded px-3 py-1 transition-colors duration-200"
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                        }

                    </tbody>
                </table>
            </div>

            {selectedInstrutor && (
                <SpanCard data={selectedInstrutor} position={cardPosition} setCardPosition={setCardPosition} />
            )}
        </div>
    );
};

export default InstrutoresDashboard;