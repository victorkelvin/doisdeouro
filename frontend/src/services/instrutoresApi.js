import { apiRequest, apiFormDataRequest } from './baseApi';


const instrutoresEndpoint = 'contas/instrutores/';

export const fetchInstrutores = async () => {
    return await apiRequest(instrutoresEndpoint);
 
};

export const createInstrutor = async (data) => {
    return await apiFormDataRequest(instrutoresEndpoint, 'post', data);
 
};

export const updateInstrutor = async (id, data) => {
    return await apiFormDataRequest(`${instrutoresEndpoint}${id}/`, 'put', data);
 
};