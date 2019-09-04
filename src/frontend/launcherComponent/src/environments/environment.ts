export const environment = {
    production: false,
    fakeProvider: true,
    signalRHub: '/NotificationHub',
    signalR: false,
    apiUrl: {
        home: '/api/Welcome',
        meteo: {
            url: 'http://api.openweathermap.org/data/2.5/weather?',
            option: {
                lang: 'it',
                key: 'a23cc450dabf63fdb6729696aa29b3a6',
                unit: 'metric'
            }
        },
        maps: {
            markers: {
                richieste: '/api/Marker/GetRichieste',
                sedi: '/api/Marker/GetSedi',
                mezzi: '/api/Marker/GetMezzi'
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
        schedeContatto: {
            listaSchede: '/api/SchedeContatto/GetLista'
        },
        turno: '',  // TodoBackEnd: controller mancante
        composizione: {
            preaccoppiati: '/api/PreAccoppiati',
            avanzata: '/api/ComposizionePartenzaAvanzata',
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
