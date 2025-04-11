import { apiBlobHandler, apiRequest } from './baseApi';

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

// export const exportAulaToXLS = async (aulaData) => {
//     try {
//         const url = `${aulasEndpoint}export-xls/`;

//         const response = await apiRequest(url, 'post', aulaData);


//         if (!response.ok) {
//             const errorText = await response.text();
//             throw new Error(errorText || 'Failed to export XLS');
//         }

//         // For binary files, use blob() instead of json()
//         const blob = await response.blob();
//         const date = new Date(aulaData.data);
//         const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;

//         const link = document.createElement('a');
//         link.href = window.URL.createObjectURL(blob);
//         link.download = `relatoriodeaula-${formattedDate}.xls`;
//         link.click();

//         return true;
//     } catch (error) {
//         console.error('Error exporting aula to XLS:', error);
//         throw error;
//     }
// };

export const exportAulaToXLS = async (aulaData) => {
    try {
      const url = `${aulasEndpoint}export-xls/`;
      
      const blob = await apiBlobHandler(url, aulaData);
      
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to export XLS');
      }
      
      // For binary files, use blob() instead of json()
      const date = new Date(aulaData.data);
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()}`;
      
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = `relatoriodeaula-${formattedDate}.xls`;
      link.click();
      
      return true;
    } catch (error) {
      console.error('Error exporting aula to XLS:', error);
      throw error;
    }
  };