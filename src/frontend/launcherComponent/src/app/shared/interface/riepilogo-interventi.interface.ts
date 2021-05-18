
export interface RiepilogoInterventiInterface {
    da: string;
    a: string;
    distaccamento: string;
    turno: string;
    squadra: string;
    altriFiltri?: {
        tipologiaIntervento: boolean;
        trasmessi: boolean;
        soloInterventi: boolean;
    };
}
