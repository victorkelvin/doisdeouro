import React, { useEffect, useState, useRef } from 'react';
import { fetchInstrutores, createInstrutor, updateInstrutor } from '../services/instrutoresApi';
import { fetchGraduacoes } from '../services/alunosApi';
import useInstrutorForm from '../hooks/useInstrutorForm';
// import SearchBar from './SearchBar';
// import InstrutorCard from './InstrutorCard'; // Create this component for displaying individual instrutor details

const InstrutoresDashboard = () => {
    const [instrutores, setInstrutores] = useState([]);
    const [graduacoes, setGraduacoes] = useState([]);
    // const [selectedInstrutor, setSelectedInstrutor] = useState(null);
    const [isFormVisible, setIsFormVisible] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [formData, setFormData] = useState({
        username: '',
        first_name: '',
        last_name: '',
        is_active: false,
        graduacao: '',
        email: '',
        contato: ''
    });

    const {
        username,
        first_name,
        last_name,
        is_active,
        setIsActive,
        graduacao,
        email,
        contato,
        setUsername,
        setFirstName,
        setLastName,
        editingId,
        setEditingId,
        setGraduacao,
        setEmail,
        setContato,
        resetForm,
        handleFileChange,
        setFotoPreview,
        fotoPreview,
        foto
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


    {/* handle selected instrutor  */ }
    /*     const handleMouseEnter = (instrutor, e) => {
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
        }; */

    // const handleMouseLeave = () => {
    //     setSelectedInstrutor(null);
    // };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('first_name', first_name);
            formData.append('last_name', last_name);
            formData.append('email', email);
            formData.append('graduacao', graduacao);
            formData.append('contato', contato);
            formData.append('is_active,', is_active,);
            // if (foto) {
            //     formData.append('foto', foto);
            // }

            if (editingId) {
                await updateInstrutor(editingId, formData);
            } else {
                await createInstrutor(formData);
            }

            resetForm();
            fetchInstrutores();
        } catch (error) {
            console.error('Error submitting form:', error);
            // Handle error appropriately (show message to user, etc.)
        }
    };

    // const handleEdit = (aluno) => {
    //     setNome(aluno.nome);
    //     setIsActive(aluno.is_active, === true || aluno.is_active, === "true"); // Convert to boolean
    //     setDataNascimento(aluno.data_nascimento);
    //     setContato(aluno.contato || '');
    //     setEmail(aluno.email || '');
    //     setGraduacao(aluno.graduacao || '');
    //     setTurma(aluno.turma || '');
    //     setEditingId(aluno.id);
    //     setFotoPreview(aluno.foto);
    // };

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
                    <form onSubmit={handleSubmit}>
                        {/* <input type="text" placeholder="Nome" value={nome} onChange={(e) => s(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                        /> */}
                        <input type="text" name="username" placeholder="Nome de Usuário" value={username} onChange={(e) => setUsername(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="text" name="first_name" placeholder="Nome" value={first_name} onChange={(e) => setFirstName(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="text" name="last_name" placeholder="Sobrenome" value={last_name} onChange={(e) => setLastName(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="email" name="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />
                        <input type="text" name="contato" placeholder="Contato" value={contato} onChange={(e) => setContato(e.target.value)} required
                            className="border rounded p-2 mb-3 w-full focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent" />


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

            <div>
                {instrutores.filter(instrutor => instrutor.username.includes(searchTerm)).map(instrutor => (
                    <div key={instrutor.id}>
                        {/* <InstrutorCard instrutor={instrutor} onEdit={handleEdit} /> */}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InstrutoresDashboard;