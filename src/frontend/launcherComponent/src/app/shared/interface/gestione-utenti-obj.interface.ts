import { PaginationInterface } from './pagination.interface';
import { FiltersInterface } from './filters.interface';

export interface GestioneUtentiObjInterface {
    filters: FiltersInterface;
    codiciSede: string;
    pagination: PaginationInterface;
}
