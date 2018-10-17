import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { Tipologia } from '../../../../../shared/model/tipologia.model';
import { Localita } from '../../../../../shared/model/localita.model';
import { Coordinate } from '../../../../../shared/model/coordinate.model';
import { RichiestaMarker } from '../../../../../maps/maps-model/richiesta-marker.model';

@Injectable({
    providedIn: 'root'
})
export class RichiesteMarkerServiceFake {

    private richieste: RichiestaMarker[] = [];

    constructor() {
    }

    public getRichieste(): Observable<RichiestaMarker[]> {
        this.richieste = [
            new RichiestaMarker(
                'R1',
                new Localita(
                    new Coordinate(41.8624992, 12.5532867),
                    'Via Scribonio Curione, 22', 'nei pressi dell\'uscita della metro'
                ),
                [
                    new Tipologia('2', 'Incendio ed esplosione', 'fa fa-fire')
                ],
                'Esplosione nei pressi di un centro abitato',
                true,
                5,
                'chiamata'
            ),
            new RichiestaMarker(
                'R2',
                new Localita(
                    new Coordinate(41.8549993, 12.5688578), 'Via Tuscolana, 1500', 'automobile ribaltata, persona anziana'),
                [
                    new Tipologia('2', 'Incidente stradale generico', 'fa fa-car')
                ],
                'Incidente d\'auto persona anziana',
                false,
                3,
                'assegnato'
            ),
            new RichiestaMarker(
                'R3',
                new Localita(
                    new Coordinate(41.9161894, 12.4554147), 'Viale Giuseppe Mazzini, 159', 'nelle vicinanze di un ristorante'),
                [
                    new Tipologia('360', 'Messa in sicurezza impianti tecnologici di servizio (acqua, energia elettrica, gas)', '')
                ],
                'Scintille da palo elettrico',
                false,
                1,
                'chiamata'
            ),
            new RichiestaMarker(
                'R4',
                new Localita(
                    new Coordinate(41.8932662, 12.5417044), 'Via di Portonaccio', 'incrocio con Via Prenestina'),
                [
                    new Tipologia('360', 'Cedimento sede stradale', '')
                ],
                'Cedimento sede stradale con rimozione veicolo',
                false,
                2,
                'presidiato'
            ),
            new RichiestaMarker(
                'R5',
                new Localita(
                    new Coordinate(41.8311007, 12.4683518), 'Viale Europa, 184', 'dal palazzo delle Poste Italiane'),
                [
                    new Tipologia('360', 'Salvataggio persone', '')
                ],
                'Persona che minaccia di buttarsi da un tetto',
                true,
                4,
                'sospeso'
            )
        ];

        return of(this.richieste);
    }
}
