import React, { useEffect, useState } from 'react';

const apiUri = 'http://localhost:8000/api/turmas/';
const TurmasDashboard = () => {
    const [turmas, setTurmas] = useState([]);
    const [nome, setNome] = useState('');
    const [diasDaSemana, setDiasDaSemana] = useState([]);
    const [horario, setHorario] = useState('');
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchTurmas();
    }, []);

    const fetchTurmas = async () => {
        const token = localStorage.getItem('token'); // Assuming you store the token in local storage
        const response = await fetch(apiUri, {
            headers: {
                'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
            },
        });
        
        if (!response.ok) {
            const errorData = await response.json(); // Get the error response
            console.error('Failed to fetch turmas:', response.statusText, errorData); // Log the error details
            return;
        }
        
        const data = await response.json();
        setTurmas(data.results);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const method = editingId ? 'PUT' : 'POST';
        const url = editingId ? `${apiUri}${editingId}/` : apiUri;
        
        //CRUD de turmas finalizado. Seguir para CRUD de Alunos.
        
        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`, // Include the token here as well
            },
            body: JSON.stringify({ nome, dias_da_semana: diasDaSemana, horario }),
        });
        
        resetForm();
        fetchTurmas();
    };

    const handleEdit = (turma) => {
        setNome(turma.nome);
        setDiasDaSemana(turma.dias_da_semana); // Assuming dias_da_semana is a comma-separated string
        setHorario(turma.horario);
        setEditingId(turma.id);
    };

    const resetForm = () => {
        setNome('');
        setDiasDaSemana([]);
        setHorario('');
        setEditingId(null);
    };

    const handleCheckboxChange = (day) => {
        setDiasDaSemana((prev) => 
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
        );
    };

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Turmas</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <input
                    type="text"
                    placeholder="Nome da Turma"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="border rounded p-2 mb-2 w-full"
                />
                <div className="mb-2">
                    <span className="block mb-1">Dias:</span>
                    {['1', '2', '3', '4', '5', '6', '7'].map((day) => (
                        <label key={day} className="inline-flex items-center mr-4">
                            <input
                                type="checkbox"
                                value={day}
                                checked={diasDaSemana.includes(day)}
                                onChange={() => handleCheckboxChange(day)}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{day === '1' ? 'Segunda-feira' : day === '2' ? 'Terça-feira' : day === '3' ? 'Quarta-feira' : day === '4' ? 'Quinta-feira' : day === '5' ? 'Sexta-feira' : day === '6' ? 'Sábado' : 'Domingo'}</span>
                        </label>
                    ))}
                </div>
                <input
                    type="time"
                    value={horario}
                    onChange={(e) => setHorario(e.target.value)}
                    required
                    className="border rounded p-2 mb-2 w-full"
                />
                <button type="submit" className="bg-blue-500 text-white rounded p-2">{editingId ? 'Atualizar' : 'Adicionar'}</button>
                <button type="button" onClick={resetForm} className="bg-gray-300 text-black rounded p-2 ml-2">Cancelar</button>
            </form>
            <table className="min-w-full bg-white border border-gray-300">
                <thead>
                    <tr>
                        <th className="border px-4 py-2">Nome</th>
                        <th className="border px-4 py-2">Dias</th>
                        <th className="border px-4 py-2">Horário</th>
                        <th className="border px-4 py-2">Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {turmas.map((turma) => (
                        <tr key={turma.id}>
                            <td className="border px-4 py-2">{turma.nome}</td>
                            <td className="border px-4 py-2">{Array.isArray(turma.dias) ? turma.dias.join(', ') : turma.dias.split(',').join(', ')}</td>
                            <td className="border px-4 py-2">{turma.horario}</td>
                            <td className="border px-4 py-2">
                                <button onClick={() => handleEdit(turma)} className="bg-yellow-500 text-white rounded p-1">Editar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TurmasDashboard;