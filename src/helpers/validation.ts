import { existsLocation } from '../models/Location';

export const validLocation = async (location: string) => {
    if (!(await existsLocation(location))) {
        throw new Error(`${location} is not a valid option`);
    }
    return true;
};
