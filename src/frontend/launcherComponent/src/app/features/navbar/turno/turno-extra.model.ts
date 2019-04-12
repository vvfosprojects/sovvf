export class TurnoExtra {
    prefissoTurno: string;
    descTurno: string;
    dataOraInizio: string;
    dataOraFine: string;

    constructor(_prefissoTurno: string, _descTurno: string, _dataOraInizio: string, _dataOraFine: string) {
        this.prefissoTurno = _prefissoTurno;
        this.descTurno = _descTurno;
        this.dataOraInizio = _dataOraInizio;
        this.dataOraFine = _dataOraFine;
    }
}
