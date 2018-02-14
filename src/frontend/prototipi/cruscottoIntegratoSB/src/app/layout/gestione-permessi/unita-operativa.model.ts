/**
 * Questa classe modella la generica unita operativa
 */
export class UnitaOperativa {
    constructor(
        /**
         * id
         */
        public id: string,

        /**
         * Descrizione
         */
        public descrizione: string,

        /**
         * Tooltip che appare andando col mouse sulla descrizione
         */
        public tooltip: string,

        /**
         * Le unità operative figlie
         */
        public figli: UnitaOperativa[]) {}
}