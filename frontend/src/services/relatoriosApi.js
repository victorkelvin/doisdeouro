import { apiRequest } from './baseApi';

const relatoriosEndpoint = 'atendimento/relatorios/';


/**
 * Fetches report based on provided filters
 * @param {Object} filters - Object containing filter parameters
 * @returns {Promise} Promise resolving to report data
 */
const fetchRelatorios = async (filters = {}) => {
    // Build query string from filters
    const queryParams = new URLSearchParams();
    
    if (filters.dataInicio) queryParams.append('data_inicio', filters.dataInicio);
    if (filters.dataFim) queryParams.append('data_fim', filters.dataFim);
    if (filters.tipo) queryParams.append('tipo', filters.tipo);
    
    if (filters.turmas && filters.turmas.length > 0) {
        filters.turmas.forEach(turma => {
            queryParams.append('turmas', turma.id);
        });
    }
    
    if (filters.alunos && filters.alunos.length > 0) {
        filters.alunos.forEach(aluno => {
            queryParams.append('alunos', aluno.id);
        });
    }
    
    if (filters.instrutores && filters.instrutores.length > 0) {
        filters.instrutores.forEach(instrutor => {
            queryParams.append('instrutores', instrutor.id);
        });
    }
    
    // Make the API request
    return apiRequest(`${relatoriosEndpoint}?${queryParams.toString()}`, 'GET');
};

export {
    fetchRelatorios
};