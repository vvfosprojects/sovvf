export class ComponenteSquadra {
    //indica che il componente è correntemente impegnato su una richiesta.
    private _descrizioneImpegno: string;
    //indica il codice della richiesta sulla quale il componente è impegnato.
    private codiceImpegno: string;
    //indica se il componente partecipa ad una composizione in corso
    private _inPartenza: boolean;

    constructor(
        // è il nominativo del componente
        public readonly nominativo: string,
        // è il codiceFiscale del componente
        public readonly codiceFiscale: string,
        // indica se nel servizio il componente è designato come capoPartenza
        public readonly capoPartenza: boolean,
        // indica se nel servizio il componente è designato come autista
        public readonly autista: boolean
    ) {
    }

    //indica se il componente è correntemente impegnato
    public get impegnato(): boolean {
        return !!this._descrizioneImpegno;
    }

    public get descrizioneImpegno(): string {
        return this._descrizioneImpegno;
    }

    //imposta un impegno del componente
    public impegna(descrizione: string, codice: string): void {
        this._descrizioneImpegno = descrizione;
        this.codiceImpegno = codice;
    }

    //disimpegna il componente
    public disimpegna(): void {
        this._descrizioneImpegno = null;
        this.codiceImpegno = null;
    }

    //imposta se il dipendente è in partenza o meno
    public set inPartenza(isSet: boolean) {
        this._inPartenza = isSet;
    }

    //restituisce se il dipendente è in partenza o meno
    public get inPartenza(): boolean {
        return this._inPartenza;
    }

    //Restituisce il nominativo esteso del componente
    public get nominativoEsteso() {
        return this.nominativo + ' (' + this.codiceFiscale + ')';
    }

    public askIfYouCanBeDroppedOn(target: any): boolean {
        if ('canYouAcceptComponente' in target) {
            return target.canYouAcceptComponente(this);
        }

        return false;
    }

    public dropOn(target: any) {
        if (!('canYouAcceptComponente' in target) || !target.canYouAcceptComponente(this))
            return;
        target.acceptComponente(this);
    }
}