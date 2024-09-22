const getNumberInUSDFormat = (value: number) => {
    if (value >= 0)  {
        return value.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        }).substring(1);
    } else {
        return '-' + (value * (-1)).toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
        }).substring(1);
    }
};

export default getNumberInUSDFormat;