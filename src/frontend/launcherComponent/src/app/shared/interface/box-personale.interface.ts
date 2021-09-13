export interface BoxPersonaleQty {
    totale: number;
    funzionari: number;
    tecnici: number;
    squadreServizio: number;
    squadreAssegnate: number;
}

export interface BoxPersonalePresenze {
    guardia: BoxPersonalePersona[];
    capoTurno: BoxPersonalePersona[];
    primoTecnico: BoxPersonalePersona;
    secondoTecnico: BoxPersonalePersona;
}

export interface BoxPersonalePersona {
    descrizione: string;
    qualifica: string;
}
