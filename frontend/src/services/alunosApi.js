import { apiRequest, apiFormDataRequest } from './baseApi';

const alunosEndpoint = 'alunos/';
const graduacoesEndpoint = 'graduacoes/';
const turmasEndpoint = 'turmas/';

export const fetchAlunos = async () => {
    return await apiRequest(alunosEndpoint, 'get');
};

export const fetchGraduacoes = async () => {
    return await apiRequest(graduacoesEndpoint, 'get');
};

export const fetchTurmas = async () => {
    return await apiRequest(turmasEndpoint, 'get');
};


export const createAluno = async (formData) => {
    return await apiFormDataRequest(alunosEndpoint, 'post', formData);
};

export const updateAluno = async (id, formData) => {
    return await apiFormDataRequest(`${alunosEndpoint}${id}/`, 'put', formData);
};