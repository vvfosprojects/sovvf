export class InterventiSo {
    constructor(
        /**
         * E' il numero delle chiamate in corso non ancora evase
         */
        public numChiamate: number,
        /**
         * E' il numero degli Interventi aperti
         */
        public numIntAperti: number,

        /*** E' il numero degli Interventi Aperti Non Presidiati
        */
        public numIntNonPresidiati: number,
        
        /*** E' il numero degli Interventi Aperti Presidiati
        */
        public numIntPresidiati: number,
        
         /*** E' il numero degli Interventi Aperti Sospesi
        */
        public numIntSospesi: number
        
        ) { }
}