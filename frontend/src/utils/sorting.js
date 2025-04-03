export const sortData = (data, sortDirection) => {

    return data.sort((a, b) => {
        let comparison = 0;
        comparison = a.nome.localeCompare(b.nome);

        return sortDirection === 'desc' ? -comparison : comparison;
    });
};

export const filterAlunos = (data, searchTerm) => {
    return data.filter(d =>
        d.nome.toLowerCase().includes(searchTerm.toLowerCase())
    );
};

export const filterInstrutores = (data, searchTerm) => {
    return data.filter(d =>
        d.first_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
};


// Render sort indicator based on current sort state
export const renderSortIndicator = (sortDirection) => {
    if (sortDirection === 'asc') {
        return (
            <svg className="w-4 h-4 inline-block ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
            </svg>
        );
    } else {
        return (
            <svg className="w-4 h-4 inline-block ml-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
        );
    }
};

