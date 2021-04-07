export class TurnoCalendario {
    precedente: string;
    corrente: string;
    successivo: string;

    constructor(turnoPrecedente: string,
                turnoCorrente: string,
                turnoSuccessivo: string) {
        this.precedente = turnoPrecedente;
        this.corrente = turnoCorrente;
        this.successivo = turnoSuccessivo;
    }

}
