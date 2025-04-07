import { apiRequest, apiFormDataRequest } from "./baseApi";

const turmasEndpoint = 'academia/turmas/';

/**
 * Fetches all turmas from the API.
 * 
 * @returns {Promise} A promise that resolves with the API response.
 */
export const fetchTurmas = async () => {
    try {
        return await apiRequest(turmasEndpoint, 'get');
    } catch (error) {
        console.error('Error fetching turmas:', error);
        throw error;
    }
};

/**
 * Creates a new turma on the API.
 * 
 * @param {FormData} formData The form data to send with the request.
 * @returns {Promise} A promise that resolves with the API response.
 */
export const createTurma = async (formData) => {
    try {
        return await apiFormDataRequest(turmasEndpoint, 'post', formData);
    } catch (error) {
        console.error('Error creating turma:', error);
        throw error;
    }
};

/**
 * Updates an existing turma on the API.
 * 
 * @param {number} id The ID of the turma to update.
 * @param {FormData} formData The form data to send with the request.
 * @returns {Promise} A promise that resolves with the API response.
 */
export const updateTurma = async (id, formData) => {
    try {
        return await apiRequest(`${turmasEndpoint}${id}/`, 'put', formData);
    } catch (error) {
        console.error('Error updating turma:', error);
        throw error;
    }
};