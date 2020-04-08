export class BaServerLinkModel {
    constructor(
        public connesso: boolean,
        public istanteInizialeConnessione: Date,
        public istanteUltimaConversazioneRiuscita: Date,
        public istanteUltimoErrore: Date,
        public descrizioneUltimoErrore: string,
        public latenzaMedia_msec: number,
        public latenzaDeviazioneStandard_msec: number) { }
}
