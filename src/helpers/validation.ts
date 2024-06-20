import { existsLocation } from '../models/Location';

export const validLocation = async (location: string, inputName: string) => {
    if (!(await existsLocation(location))) {
        throw new Error(`${inputName} name is not a valid option`);
    }
    return true;
};
