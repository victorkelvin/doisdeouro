export const sortData = (data, sortDirection, sortBy = 'nome') => {
    return data.sort((a, b) => {
        let comparison = 0;
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (typeof valA === 'string' && typeof valB === 'string') {
            comparison = valA.localeCompare(valB);
        } else if (valA instanceof Date && valB instanceof Date) {
            comparison = valA.getTime() - valB.getTime();
        } else if (typeof valA === 'number' && typeof valB === 'number') {
            comparison = valA - valB;
        }

        return sortDirection === 'desc' ? -comparison : comparison;
    });
};

export const filterData = (data, searchTerm, filterBy = 'nome') => {
    return data.filter(d =>
        String(d[filterBy]).toLowerCase().includes(searchTerm.toLowerCase())
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

