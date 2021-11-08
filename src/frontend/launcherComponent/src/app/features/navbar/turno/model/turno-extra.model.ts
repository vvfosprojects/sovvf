export class TurnoExtra {
    prefissoTurno: string;
    descTurno: string;
    dataOraInizio: string;
    dataOraFine: string;

    constructor(prefixTurno: string,
                descrizioneTurno: string,
                dataOraInizioTurno: string,
                dataOraFineTurno: string) {
        this.prefissoTurno = prefixTurno;
        this.descTurno = descrizioneTurno;
        this.dataOraInizio = dataOraInizioTurno;
        this.dataOraFine = dataOraFineTurno;
    }
}
