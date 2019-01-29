export class Turno {
    precedente: string;
    corrente: string;
    successivo: string;

    constructor(_precedente: string, _corrente: string, _successivo: string) {
        this.precedente = _precedente;
        this.corrente = _corrente;
        this.successivo = _successivo;
    }

}
