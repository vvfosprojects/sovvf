import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import { of } from 'rxjs';
import * as moment from 'moment';

import {SintesiRichiesta} from '../../../shared/model/sintesi-richiesta.model';
import {Squadra} from '../../../shared/model/squadra.model';
import {Componente} from '../../../shared/model/componente.model';
import {Mezzo} from '../../../shared/model/mezzo.model';

@Injectable({
    providedIn: 'root'
})
export class SintesiRichiesteServiceFake {

    constructor() {
    }

    public getSintesiRichieste(): Observable<SintesiRichiesta[]> {
        const richieste: SintesiRichiesta[] = [
            new SintesiRichiesta(
                'R0',
                '123.456.999',
                false,
                moment().add(-29, 'minutes').toDate(),
                moment().add(-29, 'minutes').toDate(),
                true,
                1,
                [{'codice': 1, 'descrizione': 'Incendio Generico', 'icona': 'fa fa-fire'}, {
                    'codice': 2,
                    'descrizione': 'Allagamento',
                    'icona': 'fa fa-exclamation-triangle'
                }, {'codice': 3, 'descrizione': 'Soccorso a persone', 'icona': 'fa fa-medkit'}],
                'Incendio zona III rotonda prima del centro abitato',
                'Carabinieri',
                '06 41 42 342',
                {'indirizzo': 'Via Cavour, 5', 'coordinate': [12.499370, 41.900570]},
                [{'codice': 1, 'descrizione': 'Tuscolana', 'coordinate': [123, 256]}, {
                    'codice': 2,
                    'descrizione': 'Eur',
                    'coordinate': [123, 256]
                }, {'codice': 3, 'descrizione': 'Ostiense', 'coordinate': [123, 256]}],
                'Vicino pompa di benzina',
                ['Sisma', 'Esplosione'],
                moment().add(3, 'minutes').toDate(),
                '987654321',
                0,
                'Non necessario',
                10,
                2,
                'Bassa',
                [
                    new Squadra('1A',
                        null,
                        [
                            new Componente(
                                'CR',
                                'Mario Rossi',
                                'Mario Rossi - MRORSS45H44T656R',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Antonio Bianchi',
                                'Antonio Bianchi - NTNBNC76T54H444T',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Matteo Verdi',
                                'Matteo Verdi - VRDMTT56G77D454I',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Enrico Ottavi',
                                'Enrico Ottavi - NRCOTT88U75F454H',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Michele Rettore',
                                'Michele Rettore - MCHRTT65T65K575Q',
                                false,
                                false,
                                true),
                        ]),
                    new Squadra('2A',
                        null,
                        [
                            new Componente(
                                'CS',
                                'Tiziana Rossetti',
                                'Tiziana Rossetti - RSSTZN56T56R454E',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Marco Antonio Marchi Moschetti',
                                'Marco Antonio Marchi Moschetti - MRCMRC66T66R454F',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Raffaele Cantoni',
                                'Raffaele Cantoni - CNTRFL66T45R343E',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Giovanni Carta',
                                'Giovanni Carta - VRTGVN56T74H565Y',
                                false,
                                false,
                                false),
                        ]),
                ],
                [
                    new Mezzo(
                        'COD1',
                        'A1',
                        'APS',
                        'InViaggio',
                        'In viaggio',
                        3,
                        'Ottimo',
                        0,
                        'Non rilevato',
                        4,
                        'Alto',
                        0,
                        'Proprio',
                        [
                            new Componente(
                                'CS',
                                'Mario Rossi',
                                'Mario Rossi - MRORSS45H44T656R',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Antonio Bianchi',
                                'Antonio Bianchi - NTNBNC76T54H444T',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Matteo Verdi',
                                'Matteo Verdi - VRDMTT56G77D454I',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Enrico Ottavi',
                                'Enrico Ottavi - NRCOTT88U75F454H',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Michele Rettore',
                                'Michele Rettore - MCHRTT65T65K575Q',
                                false,
                                false,
                                true),
                        ],
                        [
                            'Il mezzo deve rientrare per rifornimento',
                            'Il mezzo ha la pressione di una ruota bassa',
                        ]
                    ),
                    new Mezzo(
                        'COD2',
                        'AS1',
                        'AS',
                        'SulPosto',
                        'Sul posto',
                        2,
                        'Buono',
                        4,
                        'Alto',
                        4,
                        'Alto',
                        1,
                        'Altra sede',
                        [
                            new Componente(
                                'CS',
                                'Tiziana Rossetti',
                                'Tiziana Rossetti - RSSTZN56T56R454E',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Marco Antonio Marchi Moschetti',
                                'Marco Antonio Marchi Moschetti - MRCMRC66T66R454F',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Raffaele Cantoni',
                                'Raffaele Cantoni - CNTRFL66T45R343E',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Giovanni Carta',
                                'Giovanni Carta - VRTGVN56T74H565Y',
                                false,
                                false,
                                false),
                        ],
                        [
                            'Il mezzo deve rientrare per rifornimento',
                            'Il mezzo ha la pressione di una ruota bassa',
                        ]
                    )
                ],
                ['pagamento']
            ),
            new SintesiRichiesta(
                'R1',
                '333.444.555',
                true,
                new Date(),
                null,
                false,
                3,
                [{'codice': 2, 'descrizione': 'Allagamento', 'icona': 'fa fa-exclamation-triangle'}],
                'Allagamento del secondo piano del condominio per rottura tubazione',
                'Mario Rossi',
                '06 41 42 342',
                {'indirizzo': 'Piazza dell\'indipendenza, 40', 'coordinate': [12.502470, 41.904380]},
                [{'codice': 1, 'descrizione': 'Tuscolana', 'coordinate': [123, 256]}, {
                    'codice': 2,
                    'descrizione': 'Eur',
                    'coordinate': [123, 256]
                }, {'codice': 3, 'descrizione': 'Ostiense', 'coordinate': [123, 256]}],
                'Vicino pompa di benzina',
                ['Sisma'],
                moment().add(10, 'minutes').toDate(),
                '333444999',
                1,
                'Da inviare',
                133,
                0,
                'Alta',
                [],
                [],
                ['pagamento']
            ),
            new SintesiRichiesta(
                'R2',
                '123.456.789',
                false,
                new Date(),
                new Date(),
                true,
                1,
                [{'codice': 2, 'descrizione': 'Allagamento', 'icona': 'fa fa-exclamation-triangle'},
                    {'codice': 3, 'descrizione': 'Soccorso a persone', 'icona': 'fa fa-medkit'}],
                'Allagamento cantina per rottura tubatura',
                'Carabinieri',
                '06 41 42 342',
                {'indirizzo': 'Via Cavour, 5', 'coordinate': [12.499370, 41.900570]},
                [{'codice': 1, 'descrizione': 'Tuscolana', 'coordinate': [123, 256]}, {
                    'codice': 3,
                    'descrizione': 'Ostiense',
                    'coordinate': [123, 256]
                }],
                'Vicino pompa di benzina',
                ['Sisma', 'Esplosione'],
                moment().add(3, 'minutes').toDate(),
                '987654321',
                0,
                'Non necessario',
                5,
                2,
                'Bassa',
                [
                    new Squadra('1A',
                        null,
                        [
                            new Componente(
                                'CS',
                                'Mario Rossi',
                                'Mario Rossi - MRORSS45H44T656R',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Antonio Bianchi',
                                'Antonio Bianchi - NTNBNC76T54H444T',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Matteo Verdi',
                                'Matteo Verdi - VRDMTT56G77D454I',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Enrico Ottavi',
                                'Enrico Ottavi - NRCOTT88U75F454H',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Michele Rettore',
                                'Michele Rettore - MCHRTT65T65K575Q',
                                false,
                                false,
                                true),
                        ]),
                    new Squadra('2A',
                        null,
                        [
                            new Componente(
                                'CS',
                                'Tiziana Rossetti',
                                'Tiziana Rossetti - RSSTZN56T56R454E',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Marco Antonio Marchi Moschetti',
                                'Marco Antonio Marchi Moschetti - MRCMRC66T66R454F',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Raffaele Cantoni',
                                'Raffaele Cantoni - CNTRFL66T45R343E',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Giovanni Carta',
                                'Giovanni Carta - VRTGVN56T74H565Y',
                                false,
                                false,
                                false),
                        ]),
                ],
                [
                    new Mezzo(
                        'COD1',
                        'A1',
                        'APS',
                        'InViaggio',
                        'In viaggio',
                        1,
                        'Mediocre',
                        2,
                        'Basso',
                        2,
                        'Basso',
                        0,
                        'Proprio',
                        [
                            new Componente(
                                'CS',
                                'Mario Rossi',
                                'Mario Rossi - MRORSS45H44T656R',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Antonio Bianchi',
                                'Antonio Bianchi - NTNBNC76T54H444T',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Matteo Verdi',
                                'Matteo Verdi - VRDMTT56G77D454I',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Enrico Ottavi',
                                'Enrico Ottavi - NRCOTT88U75F454H',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Michele Rettore',
                                'Michele Rettore - MCHRTT65T65K575Q',
                                false,
                                false,
                                true),
                        ],
                        [
                            'Il mezzo deve rientrare per rifornimento',
                            'Il mezzo ha la pressione di una ruota bassa',
                        ]
                    ),
                    new Mezzo(
                        'COD2',
                        'AS1',
                        'AS',
                        'SulPosto',
                        'Sul posto',
                        2,
                        'Buono',
                        4,
                        'Alto',
                        4,
                        'Alto',
                        1,
                        'Altra sede',
                        [
                            new Componente(
                                'CS',
                                'Tiziana Rossetti',
                                'Tiziana Rossetti - RSSTZN56T56R454E',
                                true,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Marco Antonio Marchi Moschetti',
                                'Marco Antonio Marchi Moschetti - MRCMRC66T66R454F',
                                false,
                                true,
                                false),
                            new Componente(
                                'VIG',
                                'Raffaele Cantoni',
                                'Raffaele Cantoni - CNTRFL66T45R343E',
                                false,
                                false,
                                false),
                            new Componente(
                                'VIG',
                                'Giovanni Carta',
                                'Giovanni Carta - VRTGVN56T74H565Y',
                                false,
                                false,
                                false),
                        ],
                        [
                            'Il mezzo deve rientrare per rifornimento',
                            'Il mezzo ha la pressione di una ruota bassa',
                        ]
                    )
                ],
                ['pagamento']
            ),
        ];

        return of(richieste);
    }
}
