import { PaginationInterface } from './pagination.interface';
import { TipoTelefono } from '../enum/tipo-telefono.enum';

export interface CategoriaEnte {
    codice: string;
    descrizione: string;
    visibile: string;
    acronimo: string;
    cap: string;
}

export interface EnteTelefono {
    tipo: TipoTelefono;
    numero: string;
}

export interface AddEnteInterface {
    descrizione: string;
    ricorsivo: boolean;
    codCategoria: number;
    indirizzo?: string;
    cap?: string;
    noteEnte?: string;
    email?: string;
    telefoni: EnteTelefono[];
}

export interface ResponseAddEnteRubricaInterface {
    data: Ente;
    pagination: PaginationInterface;
}

export interface UpdateEnteRubricaInterface {
    id: string;
    codice: number;
    descrizione: string;
    ricorsivo: boolean;
    codCategoria: number;
    indirizzo?: string;
    cap?: string;
    noteEnte?: string;
    email?: string;
    telefoni: EnteTelefono[];
}

export interface ResponseUpdateEnteRubricaInterface {
    data: Ente;
    pagination: PaginationInterface;
}

export interface DeleteEnteInterface {
    id: string;
}

export interface ResponseDeleteEnteRubricaInterface {
    data: string;
    pagination: PaginationInterface;
}

export interface Ente {
    id: string;
    codice: number;
    descrizione: string;
    codSede: string;
    ricorsivo: boolean;
    categoria: CategoriaEnte;
    indirizzo?: string;
    cap?: string;
    telefoni: EnteTelefono[];
    noteEnte?: string;
    email?: string;
    codComune?: number;
    siglaProvincia?: string;
    zona?: string;
}

