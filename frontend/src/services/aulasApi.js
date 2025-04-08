import { apiRequest } from './baseApi';

const aulasEndpoint = 'atendimento/aulas/';

export const fetchAulas = async () => {
    try {
        return await apiRequest(aulasEndpoint);
    } catch (error) {
        console.error('Error fetching aulas:', error);
    }
};

export const createAula = async (data) => {
    try {
        return await apiRequest(aulasEndpoint, 'post', data);

    } catch (error) {
        console.error('Error creating aula:', error);
    }
};

export const updateAula = async (id, data) => {
    try {
        return await apiRequest(`${aulasEndpoint}${id}/`, 'put', data);
    } catch (error) {
        console.error('Error updating aula:', error);
    }
};

