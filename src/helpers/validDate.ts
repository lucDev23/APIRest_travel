export const validDate = (date: string): boolean => {
    const dateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;

    if (!dateTimeRegex.test(date)) {
        return false;
    }

    const dateObj = new Date(date);

    if (isNaN(dateObj.getTime())) {
        return false;
    }

    return dateObj.toISOString().startsWith(date);
};
