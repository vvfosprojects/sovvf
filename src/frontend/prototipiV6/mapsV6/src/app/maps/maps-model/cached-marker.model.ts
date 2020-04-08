export class CachedMarker {
    /**
     * classe creata ad hoc per cachare tutte le icone utilizzate,
     * questo risolve un bug di agm che non tiene in memoria le nuove icone
     * @param urlIcona
     * @param latitudine
     * @param longitudine
     */
    constructor(
        /**
         * id
         */
        public urlIcona: string,
        /**
         * coordinate in un punto fittizio nell'oceano atlantico
         */
        public latitudine: number = 20.4443944,
        public longitudine: number = -40.3672919
    ) {
    }

}
