export const sortAlunos = (alunos, sortOption, sortDirection) => {

    return alunos.sort((a, b) => {
        let comparison = 0;
        comparison = a.nome.localeCompare(b.nome);

        return sortDirection === 'desc' ? -comparison : comparison;
    });
};

export const filterAlunos = (alunos, searchTerm) => {
    return alunos.filter(aluno =>
        aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
};