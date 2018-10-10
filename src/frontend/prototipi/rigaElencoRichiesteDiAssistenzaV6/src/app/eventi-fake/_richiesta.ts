export class EventiListaRichiesteFake {

    constructor() {
    }

    richiestaClick(richiesta) {
        console.log('richiestaClick');
    }

    richiestaHoverIn(richiesta) {
        console.log('richiestaHoverIn');
    }

    richiestaHoverOut(richiesta) {
        console.log('richiestaHoverOut');
    }

    unClick() {
        console.log('unClick');
    }

    eventiRichiestaModal(richiesta) {
        console.log(richiesta);
        console.log('eventiRichiestaModal');
    }
}
