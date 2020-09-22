import { AbstractControl } from '@angular/forms';

export const oneElementLengthArray = (max: number) => {
    return (c: AbstractControl): { [key: string]: any } => {
        if (c.value && c.value.length > 0 && c.value.length <= max) {
            return null;
        }
        return { oneElementLengthArray: true };
    };
};
