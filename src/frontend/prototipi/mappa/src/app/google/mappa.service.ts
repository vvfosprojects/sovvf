import { PuntiMappaGoogleInput, PuntiMappaGoogleOutput } from './mappa.model'

export class MappaService {
        
        private puntiMappaGoogleInput: PuntiMappaGoogleInput[];
        //private puntiMappaGoogleOutput: PuntiMappaGoogleOutput[];        

        constructor() {
            //this.puntiMappaGoogleInput = this.getPuntiMappaGoogleFake();
        }

        public getPuntiMappaGoogleFake(): PuntiMappaGoogleInput[] {
            alert("getPuntiMappaGoogleFake");             
            return [
            new PuntiMappaGoogleInput("322.434.212", "Incendio", "Via Cavour, 5", "Incendio in stanza 39 II piano", 41.897989, 12.504349,"http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_yellow.png"),
            new PuntiMappaGoogleInput("435.933.003", "Soccorso a persona", "Piazza Bologna, 1", "Persona dispersa da ieri", 41.908210, 12.492676, "http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_white.png"),
            new PuntiMappaGoogleInput("564.995.837", "Danni d'acqua", "Via Nomentana, 35", "Rottura tubazione al III piano", 41.898249, 12.493595, "http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png"),
            new PuntiMappaGoogleInput("953.302.182", "Incendio", "Via Salaria, 12", "Incendio cassonetto", 41.904662, 12.488497, "http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png"),
            new PuntiMappaGoogleInput("212.789.482", "Recupero aeromobile", "Piazza Cavour, 12", "Aeromobile telecomandato rotto", 41.909743, 12.508812, "http://maps.gstatic.com/mapfiles/ridefinder-images/mm_20_blue.png"),
            ];
        }

        //public setPuntiMappaGoogleFake(p: PuntiMappaGoogleOutput): PuntiMappaGoogleOutput[] {
        //    alert("setPuntiMappaGoogleFake"); 
        //    return [
        //    new PuntiMappaGoogleOutput(p.latitudine, p.longitudine),
        //    ];
        //}
}