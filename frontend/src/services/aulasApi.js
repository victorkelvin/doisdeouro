import { apiRequest, apiFormDataRequest } from './baseApi';

const aulasEndpoint = 'atendimento/aulas/';

export const fetchAulas = async () => {
    return await apiRequest(aulasEndpoint);
};

export const createAula = async (data) => {
    return await apiFormDataRequest(aulasEndpoint, 'post', data);
};

export const updateAula = async (id, data) => {
    return await apiFormDataRequest(`${aulasEndpoint}${id}/`, 'put', data);
};

