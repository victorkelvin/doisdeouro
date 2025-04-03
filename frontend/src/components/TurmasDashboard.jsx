import React, { useEffect, useState } from 'react';
import { fetchTurmas, createTurma, updateTurma } from '../services/turmasApi';

const TurmasDashboard = () => {
    const [turmas, setTurmas] = useState([]);
    const [nome, setNome] = useState('');
    const [diasDaSemana, setDiasDaSemana] = useState([]);
    const [horario, setHorario] = useState('');
    const [editingId, setEditingId] = useState(null);


    useEffect(() => {
        fetchTurmasData();
    }, []);

    const fetchTurmasData = async () => {
        const response = await fetchTurmas();
        setTurmas(response.results);
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('dias_da_semana', diasDaSemana);
            formData.append('horario', horario);

            const body = { nome, dias_da_semana: diasDaSemana, horario }

            if (editingId) {
                await updateTurma(editingId, body);
            } else {
                await createTurma(body);
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            throw new Error('Failed to submit form');
        }

        resetForm();
        fetchTurmasData();
    };

    const handleEdit = (turma) => {
        setNome(turma.nome);
        setDiasDaSemana(turma.dias_da_semana);
        setHorario(turma.horario);
        setEditingId(turma.id);
        console.log('Editing turma:', diasDaSemana);

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
                    {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                        <label key={day} className="inline-flex items-center mr-4">
                            <input
                                type="checkbox"
                                value={day}
                                checked={diasDaSemana.includes(day)}
                                onChange={() => handleCheckboxChange(day)}
                                className="form-checkbox"
                            />
                            <span className="ml-2">{day === 1 ? 'Segunda-feira' : day === 2 ? 'Terça-feira' : day === 3 ? 'Quarta-feira' : day === 4 ? 'Quinta-feira' : day === 5 ? 'Sexta-feira' : day === 6 ? 'Sábado' : 'Domingo'}</span>
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