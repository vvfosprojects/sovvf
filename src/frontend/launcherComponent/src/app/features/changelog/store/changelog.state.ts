import { State, Selector } from '@ngxs/store';
import { ChangelogInterface } from '../../../shared/interface/changelog.interface';

export interface ChangelogStateModel {
    listaChangelog: ChangelogInterface[];
}

export const ChangelogStateDefaults: ChangelogStateModel = {
    listaChangelog: [
        {
            nomeVersione: 'Versione del 29 settembre 2020',
            dataRilascio: '29/09/2020 13:00',
            capitoli: [
                {
                    titolo: 'Possibilità di consultare e modificare la Rubrica',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Nella barra di navigazione è stata aggiunta la possibilità di consultare la rubrica del comando di appartenenza. Per poter consultare la rubrica basta premere il quarto tasto posto nella barra di navigazione.',
                            img: '../../../../assets/changelog/ottobre/NuovaBarraNavigazione.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'E’ stata introdotta la possibilità di aggiungere una nuova voce e di specificare se è ricorsiva o meno. Qualora si specificasse la ricorsività tutte le sedi al di sotto dell’attuale potranno vedere l’elemento inserito. Es. Se il comando di Roma inserisce una nuova voce in rubrica specificando la ricorsività, sarà visibile anche al “Distaccamento di Ostiense”.',
                            img: '../../../../assets/changelog/ottobre/Rubrica.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Con il tasto in alto a sinistra “Aggiungi Voce” è possibile aggiungere un nuovo elemento alla rubrica. Quando si preme comparirà la modale di seguito',
                            img: '../../../../assets/changelog/ottobre/AggiungiRubrica.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Per modificare una voce presente basta premere sul tasto giallo alla sinistra della voce da modificare e comparirà la modale di seguito con i campi già precompilati e dove sarà quindi possibile modificare quello che si desidera.',
                            img: '../../../../assets/changelog/ottobre/ModificaRubrica.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Per cancellare una voce basta premere sul tasto rosso alla sinistra della voce che si vuole eliminare.'
                        },
                    ]
                },
                {
                    titolo: 'Possibilità di aggiungere gli enti interessati ad un intervento',
                    descrizioni: [
                        {
                            testo: 'E’ stata aggiunta la possibilità di inserire un ente intervenuto in una richiesta.'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'In inserimento o modifica di una chiamata è possibile selezionare un ente tra quelli già presenti in rubrica, basta iniziare a scriverlo ed il sistema troverà l’ente desiderato, oppure, qualora l’ente non sia presente in rubrica, premendo il tasto “Nuovo Ente” è possibile aggiungerlo in rubrica ed inserirlo nella richiesta.',
                            img: '../../../../assets/changelog/ottobre/EntiIntervenutiDaModifica.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'E’ stata aggiunta la possibilità di inserire l’ente anche direttamente dalla lista delle Richieste. Infatti, premendo sul tasto “Gestisci” su una richiesta si attiverà il tasto di seguito riportato',
                            img: '../../../../assets/changelog/ottobre/AggiuntaRapidaEnte.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Premendolo si aprirà una modale che permetterà di aggiungere l’ente intervenuto direttamente dalla richiesta.'
                        }
                    ]
                },
                {
                    titolo: 'Possibilità di aggiungere il fonogramma ad un intervento',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'E’ stata aggiunta la possibilità di inserire il fonogramma della richiesta. E’ possibile aggiungere il fonogramma direttamente dall’elenco delle richieste. Basta premere sul tasto “Gestisci“ su una richiesta e si attiverà il tasto di modifica vicino al fonogramma',
                            img: '../../../../assets/changelog/ottobre/AggiuntaRapidaFonogramma.png'
                        },
                        {
                            testo: 'Premendo questo tasto si aprirà una modale che permetterà di aggiungere i dati del fonogramma da associare alla richiesta. '
                        }
                    ]
                },
                {
                    titolo: 'Possibilità di Allertare altra sede',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'E’ stata introdotta la possibilità di allertare altre sedi su una richiesta. Questa operazione farà si che la richiesta compaia sia nell’elenco delle richieste della sede che l’ha registrata sia nell’elenco delle richieste della sede che è stata allertata. Anche quest’ultima potrà inviare una partenza sul luogo dell’evento e seguirne l’evoluzione.'
                        },
                        {
                            testo: 'Per allertare una sede basta premere il tasto “Gestisci” su una richiesta e successivamente il tasto giallo accanto al cambio stato richiesta',
                            img: '../../../../assets/changelog/ottobre/TastiStatoRichiestaAllertaTrasferimento.png'
                        },
                        {
                            testo: 'Nella modale che si apre va selezionata la sede da allertare e va confermata l’operazione, alla sede che viene allertata comparirà in alto a destra una notifica'
                        }
                    ]
                },
                {
                    titolo: 'Possibilità di Trasferire una richiesta ad altra sede',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'E’ stata introdotta la possibilità di trasferire una chiamata ad altra sede. Questa azione è possibile solo se la richiesta non è stata ancora gestita e non ha partenze attive. Se si effettua un trasferimento la richiesta non sarà più consultabile dall’elenco della sede trasferente ma sarà visibile e quindi anche gestibile solo dalla sede al quale è stata trasferita. '
                        },
                        {
                            testo: 'Per trasferire la richiesta è sufficiente premere sul tasto “Gestisci” e poi sul tasto rosso accanto al tasto per il cambio di stato della richiesta.',
                            img: '../../../../assets/changelog/ottobre/TastiStatoRichiestaAllertaTrasferimento.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'La sede traferente potrà comunque consultare uno storico delle richieste trasferite tramite un’apposita funzionalità posta in alto nella barra di navigazione. E’ la terza icona da sinistra.',
                            img: '../../../../assets/changelog/ottobre/NuovaBarraNavigazione.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Nello storico sarà presente l’elenco di tutte le richieste trasferite, in quale data, chi ha effettuato l’operazione e a chi sono state trasferite.',
                            img: '../../../../assets/changelog/ottobre/ListaTrasferimenti.png'
                        }
                    ]
                },
                {
                    titolo: 'Possibilità di sostituire un mezzo in uscita',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'E’ stata aggiunta la possibilità di sostituire un mezzo in uscita. Per effettuare la sostituzione i passi sono i seguenti:\n' +
                                '- Premere il tasto “Gestione”\n' +
                                '- Accanto al mezzo compariranno due tasti, va premuto il tasto blu con l’ingranaggio.\n',
                            img: '../../../../assets/changelog/ottobre/TastiFunzionePartenza.png'
                        },
                        {
                            testo: 'Nella finestra successiva premere l’icona blu accanto alla partenza (l\'icona sarà visibile soltanto se il mezzo è "In Uscita")',
                            img: '../../../../assets/changelog/ottobre/SostituzionePartenza.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Selezionare il nuovo mezzo e la squadra per la nuova composizione, indicare l’orario e premere su conferma.',
                            img: '../../../../assets/changelog/ottobre/ModificaPartenzaDettaglio.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'A questo punto possiamo scegliere di salvare le modifiche o aggiungere, alla nuova partenza, degli stati che eventualmente sono stati già eseguiti ( Es. Mettere la partenza già in viaggio indicandone l’orario) premendo sui tasti appositi.',
                            img: '../../../../assets/changelog/ottobre/SequenzaEventi.png'
                        }
                    ]
                },
                {
                    titolo: 'Possibilità di aggiunta postuma di una partenza e di tutti i suoi stati ad un intervento',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Come spiegato prima è stata aggiunta la possibilità di inserire gli stati di una partenza anche in un secondo momento, indicandone anche l’orario.'
                        },
                        {
                            testo: 'Basta premere sul tasto “Gestione” ed a destra della partenza comparirà un’icona a forma di ingranaggio.',
                            img: '../../../../assets/changelog/ottobre/SequenzaEventiDettaglio.png'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Premendola si potrà aggiungere uno o più stati alla partenza selezionata ed indicare per ogni stato l’orario corrispondente. Premendo poi sul tasto conferma, gli inserimenti verranno salvati.',
                        }
                    ]
                },
                {
                    titolo: 'Aggiunta dello stato di “In Uscita” ad una partenza',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Nella prima versione di SO115 quando si creava una partenza, veniva automaticamente impostata con stato “In Viaggio”. Ora è stata introdotta la possibilità di decidere se mettere la partenza in stato di “In Uscita”, ovvero la partenza è stata solo creata ed il mezzo si trova ancora in sede. Quando il mezzo si metterà in viaggio l’operatore cambierà stato alla partenza indicando l’orario effettivo di uscita. Altrimenti si può mettere la partenza “In Viaggio” direttamente quando la si crea. Questo farà si che l’orario di uscita sia equivalente all’orario di creazione della partenza.',
                            img: '../../../../assets/changelog/ottobre/SceltaComposizionePartenza.png'
                        }
                    ]
                },
                {
                    titolo: 'Ordinamento dei mezzi in servizio',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'E’ stato modificato l’ordinamento dei mezzi in servizio nell’apposita sezione. Ora i mezzi occupati su un intervento vengono visualizzati in cima all’elenco.'
                        }
                    ]
                },
                {
                    titolo: 'Presenza mezzi di altri comandi durante la composizione partenza',
                    descrizioni: [
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Nella prima versione di SO115Web, quando si componeva una partenza, il sistema faceva vedere sulla mappa solo i mezzi appartenenti al comando nel quale si stava creando la partenza.'
                        },
                        {
                            // tslint:disable-next-line:max-line-length
                            testo: 'Ora quando si compone una partenza, sulla mappa, verranno visualizzati anche eventuali mezzi nelle vicinanze appartenenti ad altri comandi.'
                        }
                    ]
                },
            ]
        }
    ]
};

@State<ChangelogStateModel>({
    name: 'changelog',
    defaults: ChangelogStateDefaults
})

export class ChangelogState {
    constructor() {
    }

    @Selector()
    static listaChangelog(state: ChangelogStateModel) {
        return state.listaChangelog;
    }
}
