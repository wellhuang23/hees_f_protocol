export function convertToNumber(value: any): number | undefined {
    if (value === null || typeof value === 'undefined' || value === '') {
        return undefined; // Or 0, or throw an error, depending on your desired default/error handling
    }

    const parsedValue = typeof value === 'string' ? parseInt(value, 10) : value;

    // Check if the parsed value is actually a number and not NaN
    if (typeof parsedValue === 'number' && !isNaN(parsedValue)) {
        return parsedValue;
    } else {
        return undefined; // Or throw an error if conversion fails
    }
}
