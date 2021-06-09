
export interface RiepilogoInterventiInterface {
    da: string;
    a: string;
    distaccamenti: string[];
    turni: string[];
    squadre: string[];
    altriFiltri?: {
        tipologiaIntervento: boolean;
        trasmessi: boolean;
        soloInterventi: boolean;
    };
}
