import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

// Models
import { MezzoComposizione } from '../../../features/home/composizione-partenza/interface/mezzo-composizione-interface';
import { BoxPartenza } from '../../../features/home/composizione-partenza/interface/box-partenza-interface';
import { SquadraComposizione } from 'src/app/features/home/composizione-partenza/interface/squadra-composizione-interface';
import { StatoSquadra } from '../../../shared/enum/stato-squadra.enum';
import { Store } from '@ngxs/store';
import {
    AddBookMezzoComposizione, RemoveBookingMezzoComposizione,
    RemoveBookMezzoComposizione,
    UpdateMezzoComposizione
} from '../../../features/home/store/actions/composizione-partenza/mezzi-composizione.actions';
import * as moment from 'moment';
import { makeCopy } from '../../../shared/helper/function';
import { OFFSET_SYNC_TIME } from '../../settings/referral-time';
import { ComposizionePartenzaState } from '../../../features/home/store/states/composizione-partenza/composizione-partenza-state';
import { ClearBoxPartenze, RemoveBoxPartenzaByMezzoId } from '../../../features/home/store/actions/composizione-partenza/box-partenza.actions';
import { RichiesteState } from '../../../features/home/store/states/richieste/richieste.state';
import { UpdateRichiesta } from '../../../features/home/store/actions/richieste/richieste.actions';
import { Partenza } from '../../../shared/model/partenza.model';
import { ShowToastr } from '../../../shared/store/actions/toastr/toastr.actions';
import { ToastrType } from '../../../shared/enum/toastr';
import { TurnOffComposizione } from '../../../features/home/store/actions/view/view.actions';

@Injectable()
export class CompPartenzaServiceFake {
    preAccoppiati: BoxPartenza[];
    mezzi: MezzoComposizione[];
    squadre: SquadraComposizione[];

    filtri: any;

    constructor(private store: Store) {
    }

    getPreAccoppiati(signalRConnectionId?: string): Observable<any> {
        const idRichiestaAttuale = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id;
        this.preAccoppiati = [
            {
                id: '1',
                mezzoComposizione: {
                    id: '1',
                    mezzo: {
                        codice: '1',
                        descrizione: 'A1',
                        genere: 'APS',
                        stato: 'inSede',
                        appartenenza: 0,
                        distaccamento: {
                            codice: '1',
                            descrizione: 'Tuscolano II',
                            coordinate: { latitudine: 1, longitudine: 1 },
                            indirizzo: 'Via Prova, 2',
                            tipo: 'Distaccamento',
                            regione: 'Lazio',
                            provincia: 'Roma'
                        }
                    },
                    km: '20.2 km',
                    tempoPercorrenza: '20 min',
                    coordinate: {
                        latitudine: 41.8311007,
                        longitudine: 12.4686518
                    },
                    idRichiesta: idRichiestaAttuale,
                    istanteScadenzaSelezione: null
                },
                squadraComposizione: [
                    {
                        id: '1',
                        squadra: {
                            id: '1',
                            nome: 'Rossa',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    }
                ]
            },
            {
                id: '2',
                mezzoComposizione: {
                    id: '2',
                    mezzo: {
                        codice: '2',
                        descrizione: 'A2',
                        genere: 'APS',
                        stato: 'inSede',
                        appartenenza: 0,
                        distaccamento: {
                            codice: '1',
                            descrizione: 'Tuscolano II',
                            coordinate: { latitudine: 1, longitudine: 1 },
                            indirizzo: 'Via Prova, 2',
                            tipo: 'Distaccamento',
                            regione: 'Lazio',
                            provincia: 'Roma'
                        }
                    },
                    km: '25.6 km',
                    tempoPercorrenza: '26 min',
                    coordinate: {
                        latitudine: 41.82699,
                        longitudine: 12.4879854,
                    },
                    idRichiesta: idRichiestaAttuale,
                    istanteScadenzaSelezione: null
                },
                squadraComposizione: [
                    {
                        id: '1',
                        squadra: {
                            id: '1',
                            nome: 'Rossa',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    },
                    {
                        id: '2',
                        squadra: {
                            id: '2',
                            nome: 'Verde',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Paolo Marchio', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesca Ventura', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Federico Calu', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    }
                ]
            },
            {
                id: '3',
                mezzoComposizione: {
                    id: '3',
                    mezzo: {
                        codice: '3',
                        descrizione: 'A3',
                        genere: 'APS',
                        stato: 'inSede',
                        appartenenza: 0,
                        distaccamento: {
                            codice: '1',
                            descrizione: 'Ostiense',
                            coordinate: { latitudine: 1, longitudine: 1 },
                            indirizzo: 'Via Prova, 2',
                            tipo: 'Distaccamento',
                            regione: 'Lazio',
                            provincia: 'Roma'
                        }
                    },
                    km: '20.2 km',
                    tempoPercorrenza: '20 min',
                    coordinate: {
                        latitudine: 41.8311007,
                        longitudine: 12.4686518
                    },
                    idRichiesta: idRichiestaAttuale,
                    istanteScadenzaSelezione: null
                },
                squadraComposizione: [
                    {
                        id: '1',
                        squadra: {
                            id: '1',
                            nome: 'Rossa',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    },
                    {
                        id: '2',
                        squadra: {
                            id: '2',
                            nome: 'Verde',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Paolo Marchio', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesca Ventura', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Federico Calu', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    }
                ]
            },
            {
                id: '4',
                mezzoComposizione: {
                    id: '1',
                    mezzo: {
                        codice: '1',
                        descrizione: 'A1',
                        genere: 'APS',
                        stato: 'inSede',
                        appartenenza: 0,
                        distaccamento: {
                            codice: '1',
                            descrizione: 'Tuscolana I',
                            coordinate: { latitudine: 1, longitudine: 1 },
                            indirizzo: 'Via Prova, 2',
                            tipo: 'Distaccamento',
                            regione: 'Lazio',
                            provincia: 'Roma'
                        }
                    },
                    km: '20.2 km',
                    tempoPercorrenza: '20 min',
                    coordinate: {
                        latitudine: 41.8311007,
                        longitudine: 12.4686518
                    },
                    idRichiesta: idRichiestaAttuale,
                    istanteScadenzaSelezione: null
                },
                squadraComposizione: [
                    {
                        id: '1',
                        squadra: {
                            id: '1',
                            nome: 'Rossa',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    }
                ]
            },
            {
                id: '5',
                mezzoComposizione: {
                    id: '2',
                    mezzo: {
                        codice: '2',
                        descrizione: 'A2',
                        genere: 'APS',
                        stato: 'inSede',
                        appartenenza: 0,
                        distaccamento: {
                            codice: '1',
                            descrizione: 'Tuscolana II',
                            coordinate: { latitudine: 1, longitudine: 1 },
                            indirizzo: 'Via Prova, 2',
                            tipo: 'Distaccamento',
                            regione: 'Lazio',
                            provincia: 'Roma'
                        }
                    },
                    km: '25.6 km',
                    tempoPercorrenza: '26 min',
                    coordinate: {
                        latitudine: 41.82699,
                        longitudine: 12.4879854,
                    },
                    idRichiesta: idRichiestaAttuale,
                    istanteScadenzaSelezione: null
                },
                squadraComposizione: [
                    {
                        id: '1',
                        squadra: {
                            id: '1',
                            nome: 'Rossa',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    },
                    {
                        id: '2',
                        squadra: {
                            id: '2',
                            nome: 'Verde',
                            stato: StatoSquadra.InSede,
                            componenti: [
                                { descrizioneQualifica: 'CP', nominativo: 'Paolo Marchio', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Francesca Ventura', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                                { descrizioneQualifica: 'CP', nominativo: 'Federico Calu', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                            ],
                            distaccamento: {
                                codice: '1',
                                descrizione: 'Tuscolana II',
                                coordinate: { latitudine: 1, longitudine: 1 },
                                indirizzo: 'Via Prova, 1',
                                tipo: 'Distaccamento',
                                regione: 'Lazio',
                                provincia: 'Roma'
                            }
                        }
                    }
                ]
            }
        ];
        const result = this.preAccoppiati;
        return of(result);
    }

    getListeComposizioneAvanzata(signalRConnectionId?: string): Observable<any> {
        const idRichiestaAttuale = this.store.selectSnapshot(ComposizionePartenzaState.richiestaComposizione).id;
        this.mezzi = [
            {
                id: '1',
                mezzo: {
                    codice: '1',
                    descrizione: 'A1',
                    genere: 'APS',
                    stato: 'inSede',
                    appartenenza: 0,
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Tuscolano II',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 2',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                },
                km: '20.2 km',
                tempoPercorrenza: '20 min',
                coordinate: {
                    latitudine: 41.8311007,
                    longitudine: 12.4686518
                },
                idRichiesta: idRichiestaAttuale,
                istanteScadenzaSelezione: null
            },
            {
                id: '2',
                mezzo: {
                    codice: '2',
                    descrizione: 'A2',
                    genere: 'APS',
                    stato: 'inSede',
                    appartenenza: 0,
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Tuscolano II',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 2',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                },
                km: '25.6 km',
                tempoPercorrenza: '26 min',
                coordinate: {
                    latitudine: 41.82699,
                    longitudine: 12.4879854,
                },
                idRichiesta: idRichiestaAttuale,
                istanteScadenzaSelezione: null
            },
            {
                id: '3',
                mezzo: {
                    codice: '3',
                    descrizione: 'A3',
                    genere: 'APS',
                    stato: 'inSede',
                    appartenenza: 0,
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Tuscolano II',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 2',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                },
                km: '27.4 km',
                tempoPercorrenza: '28 min',
                coordinate: {
                    latitudine: 41.8531486,
                    longitudine: 12.5418702
                },
                idRichiesta: idRichiestaAttuale,
                istanteScadenzaSelezione: null
            },
            {
                id: '4',
                mezzo: {
                    codice: '4',
                    descrizione: 'A4',
                    genere: 'APS',
                    stato: 'inRientro',
                    appartenenza: 0,
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Tuscolano II',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 2',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                },
                km: '30.1 km',
                tempoPercorrenza: '31.5 min',
                coordinate: {
                    latitudine: 41.8935662,
                    longitudine: 12.5417044
                },
                idRichiesta: idRichiestaAttuale,
                istanteScadenzaSelezione: null
            },
            {
                id: '5',
                mezzo: {
                    codice: '5',
                    descrizione: 'A5',
                    genere: 'APS',
                    stato: 'inRientro',
                    appartenenza: 0,
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Ostiense',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 2',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                },
                km: '32.1 km',
                tempoPercorrenza: '33 min',
                coordinate: {
                    latitudine: 41.8311007,
                    longitudine: 12.4686518
                },
                idRichiesta: idRichiestaAttuale,
                istanteScadenzaSelezione: null
            },
            {
                id: '6',
                mezzo: {
                    codice: '6',
                    descrizione: 'A6',
                    genere: 'APS',
                    stato: 'inViaggio',
                    appartenenza: 0,
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Ostiense',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 2',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                },
                km: '34.7 km',
                tempoPercorrenza: '35 min',
                coordinate: {
                    latitudine: 41.8311007,
                    longitudine: 12.4686518
                },
                idRichiesta: idRichiestaAttuale,
                istanteScadenzaSelezione: null
            },
            {
                id: '7',
                mezzo: {
                    codice: '7',
                    descrizione: 'A7',
                    genere: 'APS',
                    stato: 'sulPosto',
                    appartenenza: 0,
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Ostiense',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 2',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                },
                km: '34.9 km',
                tempoPercorrenza: '35.5 min',
                coordinate: {
                    latitudine: 41.8311007,
                    longitudine: 12.4686518
                },
                idRichiesta: idRichiestaAttuale,
                istanteScadenzaSelezione: null
            },
        ];
        this.squadre = [
            {
                id: '1',
                squadra: {
                    id: '1',
                    nome: 'Rossa',
                    stato: StatoSquadra.InSede,
                    componenti: [
                        { descrizioneQualifica: 'CP', nominativo: 'Mario Verdi', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                        { descrizioneQualifica: 'CP', nominativo: 'Francesco Rossi', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                        { descrizioneQualifica: 'CP', nominativo: 'Mario Verna', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                    ],
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Tuscolana II',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 1',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                }
            },
            {
                id: '2',
                squadra: {
                    id: '2',
                    nome: 'Verde',
                    stato: StatoSquadra.InSede,
                    componenti: [
                        { descrizioneQualifica: 'CP', nominativo: 'Paolo Marchio', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                        { descrizioneQualifica: 'CP', nominativo: 'Francesca Ventura', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                        { descrizioneQualifica: 'CP', nominativo: 'Federico Calu', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                    ],
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Tuscolana II',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 1',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                }
            },
            {
                id: '3',
                squadra: {
                    id: '3',
                    nome: 'Arancione',
                    stato: StatoSquadra.InSede,
                    componenti: [
                        { descrizioneQualifica: 'CP', nominativo: 'Paolo Marchio', tooltip: '', capoPartenza: true, autista: false, rimpiazzo: false },
                        { descrizioneQualifica: 'CP', nominativo: 'Francesca Ventura', tooltip: '', capoPartenza: false, autista: true, rimpiazzo: false },
                        { descrizioneQualifica: 'CP', nominativo: 'Federico Calu', tooltip: '', capoPartenza: false, autista: false, rimpiazzo: true }
                    ],
                    distaccamento: {
                        codice: '1',
                        descrizione: 'Tuscolana II',
                        coordinate: { latitudine: 1, longitudine: 1 },
                        indirizzo: 'Via Prova, 1',
                        tipo: 'Distaccamento',
                        regione: 'Lazio',
                        provincia: 'Roma'
                    }
                }
            },
        ];

        const result = {
            'composizioneMezzi': this.mezzi,
            'composizioneSquadre': this.squadre
        };
        return of(result);
    }

    setMezzoPrenotato(mezzoComp: MezzoComposizione) {
        setTimeout(() => {
            const obj = makeCopy(mezzoComp);
            obj.mezzoComposizione.istanteScadenzaSelezione = moment(new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]).getTime()).add(15, 'seconds').toDate();
            const response = {
                'mezzoComposizione': obj.mezzoComposizione
            };
            this.store.dispatch(new AddBookMezzoComposizione(response.mezzoComposizione));
            this.store.dispatch(new RemoveBookingMezzoComposizione(response.mezzoComposizione));
            this.store.dispatch(new UpdateMezzoComposizione(response.mezzoComposizione));
        }, 1000);

        return of(null);
    }

    resetMezzoPrenotato(mezzoComp: MezzoComposizione) {
        setTimeout(() => {
            const obj = makeCopy(mezzoComp);
            // mezzo.istanteScadenzaSelezione = moment(new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]).getTime()).add(3, 'minutes').toDate();
            obj.mezzoComposizione.istanteScadenzaSelezione = moment(new Date(new Date().getTime() + OFFSET_SYNC_TIME[0]).getTime()).add(15, 'seconds').toDate();
            const response = {
                'mezzoComposizione': obj.mezzoComposizione
            };
            // this.store.dispatch(new AddBookMezzoComposizione(response.mezzoComposizione));
            this.store.dispatch(new UpdateMezzoComposizione(response.mezzoComposizione));
            return of(null);
        }, 1000);

        return of();
    }

    removeMezzoPrenotato(mezzoComp: MezzoComposizione) {
        setTimeout(() => {
            const obj = makeCopy(mezzoComp);
            obj.mezzoComposizione.istanteScadenzaSelezione = null;
            const response = {
                'mezzoComposizione': obj.mezzoComposizione
            };
            this.store.dispatch(new RemoveBookMezzoComposizione(response.mezzoComposizione));
            this.store.dispatch(new UpdateMezzoComposizione(response.mezzoComposizione));
            this.store.dispatch(new RemoveBoxPartenzaByMezzoId(response.mezzoComposizione.mezzo.codice));
        }, 1000);

        return of(null);
    }

    confermaPartenze(partenzeObj: any) {
        setTimeout(() => {
            const richieste = makeCopy(this.store.selectSnapshot(RichiesteState.richieste));
            const richiesta = richieste.filter(x => x.codice === partenzeObj.idRichiesta)[0];
            if (!partenzeObj.partenze) {
                partenzeObj.partenze = [];
            }
            partenzeObj.partenze.forEach(partenza => {
                const partenze = [];
                partenze.push(
                    new Partenza(
                        partenza.squadre,
                        partenza.mezzo,
                        partenza.turno
                    )
                );
                richiesta.partenze = [...partenze];
            });
            this.store.dispatch(new UpdateRichiesta(richiesta));
            this.store.dispatch(new TurnOffComposizione());
            this.store.dispatch(new ClearBoxPartenze());
            this.store.dispatch(new ShowToastr(ToastrType.Info, 'Modifica Sintesi Richiesta', null, 3));
        }, 1000);

        return of(null);
    }
}
