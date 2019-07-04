export interface BoxPersonaleQty {
    totale: number;
    funzionari: number;
    tecnici: number;
    squadreServizio: number;
    squadreAssegnate: number;
}

export interface BoxPersonalePresenze {
    funzGuardia: BoxPersonalePersona;
    capoTurno: BoxPersonalePersona;
    tecnicoGuardia1: BoxPersonalePersona;
    tecnicoGuardia2: BoxPersonalePersona;
}

export interface BoxPersonalePersona {
    descrizione: string;
    qualifica: string;
    telefono?: string;
}
