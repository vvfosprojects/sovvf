import { UnitaOperativa } from "./unita-operativa.model";
import { PermessoAssegnato } from "./permesso-assegnato.model";
import { Permesso } from "./permesso.model";
import { Ruolo } from "./ruolo.model";

/**
 * E' il DTO che popola il modulo di gestione dei permessi
 */
export class SituazionePermessi {
    constructor(
        /**
         * E' l'albero sul quale l'utente correntemente autenticato può operare
         * nella gesetione dei permessi.
         * Il backend dovrebbe garantire l'assenza di sovrapposizioni tra questi alberi.
         */
        public unitaOperativeRadice: UnitaOperativa[],

        /**
         * E' la situazione dei permessi assegnati sui quali ho visibilità
         */
        public permessiAssegnati: PermessoAssegnato[],

        /**
         * E' l'anagrafica dei permessi da visualizzare nell'interfaccia
         */
        public permessiDisponibili: Permesso[],

        /**
         * E' l'anagrafica dei ruoli da visualizzare nell'interfaccia
         */
        public ruoliDisponibili: Ruolo[]
    ) {}
}