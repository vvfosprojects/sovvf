export const environment = {
    production: true,
    fakeProvider: false,
    signalRHub: '/NotificationHub',
    signalR: true,
    apiUrl: {
        home: '/api/Welcome',
        boxes: {
            personale: '/api/BoxPersonale',
            mezzi: '/api/BoxMezzi',
            richieste: '/api/BoxRichieste',
            meteo: {
                url: 'http://api.openweathermap.org/data/2.5/weather?',
                option: {
                    lang: 'it',
                    key: 'a23cc450dabf63fdb6729696aa29b3a6',
                    unit: 'metric'
                }
            }
        },
        maps: {
            markers: {
                richieste: '/api/SintesiRichiesteAssistenzaMarker',
                sedi: '/api/SintesiSediMarker',
                mezzi: '/api/SintesiMezziMarker',
                centro: '',  // TodoBackEnd: controller mancante
                chiamate: '/api/ChiamataInCorso'
            }
        },
        rigaElencoRichieste: '/api/SintesiRichiesteAssistenza',
        updateRichiesta: '/api/Chiamata/UpdateIntervento',
        eventiRichieste: '/api/ListaEventi',
        attivitaUtente: '/api/AttivitaUtente',
        gestioneRichiesta: {
            aggiornaStato: '/api/GestioneRichiesta/AggiornaStato'
        },
        gestionePartenza: {
            aggiornaStatoMezzo: '/api/GestionePartenza/AggiornaPartenza'
        },
        mezziInServizio: {
            listaMezzi: '/api/GestioneMezziInServizio/GetListaMezzi'
        },
        turno: '',  // TodoBackEnd: controller mancante
        composizione: {
            preaccoppiati: '/api/PreAccoppiati',
            avanzata: '/api/ComposizionePartenzaAvanzata',
            filtri: '/api/Filtri',
            addPrenotazioneMezzo: '/api/AddPrenotazioneMezzo',
            removePrenotazioneMezzo: '/api/RemovePrenotazioneMezzo',
            resetPrenotazioneMezzo: '/api/ResetPrenotazioneMezzo',
            confermaPartenze: '/api/ConfermaPartenze'
        },
        chiamata: {
            marker: '/api/ChiamataInCorso',
            inserimento: '/api/Chiamata/Add'
        },
        login: '/api/auth/Login',
        users: '/api/users',
        navbar: '/api/Navbar'
    }
};
