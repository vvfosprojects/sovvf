import { PaginationInterface } from './pagination.interface';

export interface CategoriaVoceRubrica {
    codice: string;
    descrizione: string;
    visibile: string;
    acronimo: string;
    cap: string;
}

export enum TipoTelefono {
    Telefono = 'Telefono',
    Fax = 'Fax'
}

export interface VoceRubricaTelefono {
    tipo: TipoTelefono;
    numero: string;
}

export interface AddVoceRubricaInterface {
    descrizione: string;
    ricorsivo: boolean;
    codCategoria: number;
    indirizzo: string;
    cap: string;
    noteEnte?: string;
    email?: string;
    telefoni: VoceRubricaTelefono[];
}

export interface ResponseAddVoceRubricaInterface {
    data: VoceRubrica;
    pagination: PaginationInterface;
}

export interface UpdateVoceRubricaInterface {
    id: string;
    codice: number;
    descrizione: string;
    ricorsivo: boolean;
    codCategoria: number;
    indirizzo: string;
    cap: string;
    noteEnte?: string;
    email?: string;
    telefoni: VoceRubricaTelefono[];
}

export interface ResponseUpdateVoceRubricaInterface {
    data: VoceRubrica;
    pagination: PaginationInterface;
}

export interface DeleteVoceRubricaInterface {
    idVoceRubrica: string;
}

export interface ResponseDeleteVoceRubricaInterface {
    data: string;
    pagination: PaginationInterface;
}

export interface VoceRubrica {
    id: string;
    codice: number;
    descrizione: string;
    codSede: string;
    ricorsivo: boolean;
    categoria: CategoriaVoceRubrica;
    indirizzo: string;
    cap: string;
    telefoni: VoceRubricaTelefono[];
    noteEnte?: string;
    email?: string;
    codComune?: number;
    siglaProvincia?: string;
    zona?: string;
}

