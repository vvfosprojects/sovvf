import { Role } from './role';
import { Sede } from '../../../shared/model/sede.model';
import { AppFeatures } from '../../../shared/enum/app-features.enum';

export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: Role;
    sede?: Sede;
    features?: Features[];
    token?: string;
}

export interface Features {
    nameFunction: AppFeatures;
    read: Sede[];
    write: Sede[];
}
