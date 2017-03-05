import { ComponenteSquadra } from '../componente-squadra/componente-squadra.model';

export class ComponenteInPartenza {
    public capoPartenza: boolean;
    public autista: boolean;

    constructor(public componente: ComponenteSquadra) {
        this.capoPartenza = componente.capoPartenza;
        this.autista = componente.autista;
    }
}
