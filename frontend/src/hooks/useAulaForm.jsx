import { useState } from 'react';

const useAulaForm = () => {
    const [data, setData] = useState('');
    const [alunos_presentes, setAlunosPresentes] = useState([]);
    const [horario_inicio, setHorarioInicio] = useState('');
    const [horario_fim, setHorarioFim] = useState('');
    const [observacao, setObservacao] = useState('');
    const [turma, setTurma] = useState('');
    const [instrutores_aula, setInstrutoresAula] = useState([]);
    const [editingId, setEditingId] = useState(null);

    const resetForm = () => {
        setData('');
        setAlunosPresentes([]);
        setHorarioInicio('');
        setHorarioFim('');
        setObservacao('');
        setTurma('');
        setInstrutoresAula([]);
        setEditingId(null);
    };

    return {
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
    };
};

export default useAulaForm;