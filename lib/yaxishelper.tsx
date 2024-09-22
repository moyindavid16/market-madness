const getMinMaxForYAxis = (data: any []) => {
    if (data.length === 0) {
        return { min: 0, max: 0 };
    }

    const allValues = data.reduce((acc, series) => acc.concat(series.data), []);
    const min = Math.min(...allValues);
    const max = Math.max(...allValues);
    return { min: min, max: max };
};

export default getMinMaxForYAxis;