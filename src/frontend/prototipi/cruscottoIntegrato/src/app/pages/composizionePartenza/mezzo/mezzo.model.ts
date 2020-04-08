export class Mezzo {
    //indica che il mezzo è correntemente impegnato su una richiesta.
    private _descrizioneImpegno: string;
    //indica il codice della richiesta sulla quale il mezzo è impegnato.
    private codiceImpegno: string;
    //indica se il mezzo partecipa ad una composizione in corso
    private _inPartenza: boolean;

    constructor(
        public readonly nome: string,
        public readonly unitaOperativa: string) { }

    //indica se il mezzo è correntemente impegnato
    public get impegnato(): boolean {
        return !!this._descrizioneImpegno;
    }

    public get descrizioneImpegno(): string {
        return this._descrizioneImpegno;
    }

    //imposta un impegno del mezzo
    public impegna(descrizione: string, codice: string): void {
        this._descrizioneImpegno = descrizione;
        this.codiceImpegno = codice;
    }

    //disimpegna il mezzo
    public disimpegna(): void {
        this._descrizioneImpegno = null;
        this.codiceImpegno = null;
    }

    //imposta se il mezzo è in partenza o meno
    public set inPartenza(isSet: boolean) {
        this._inPartenza = isSet;
    }

    //restituisce se il mezzo è in partenza o meno
    public get inPartenza(): boolean {
        return this._inPartenza;
    }

    public askIfYouCanBeDroppedOn(target: any): boolean {
        if ('canYouAcceptMezzo' in target) {
            return target.canYouAcceptMezzo(this);
        }

        return false;
    }

    public dropOn(target: any) {
        if (!('canYouAcceptMezzo' in target) || !target.canYouAcceptMezzo(this))
            return;
        target.acceptMezzo(this);
    }
}