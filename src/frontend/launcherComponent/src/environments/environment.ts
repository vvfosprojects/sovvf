export const environment = {
    production: false,
    fakeProvider: true,
    signalRHub: '/NotificationHub',
    signalR: false,
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
                centro: '',  // Todo: controller mancante
                chiamate: '/api/ChiamataInCorso'
            }
        },
        rigaElencoRichieste: '/api/SintesiRichiesteAssistenza',
        eventiRichieste: '/api/ListaEventi',
        turno: '',  // Todo: controller mancante
        composizione: {
            preaccoppiati: '/api/PreAccoppiati',
            avanzata: '/api/ComposizionePartenzaAvanzata',
            filtri: '/api/Filtri'
        },
        chiamata: {
            marker: '/api/ChiamataInCorso',
            inserimento: '/api/InserimentoIntervento'
        },
        login: '/api/auth/Login',
        users: '/api/users',
        navbar: '/api/Navbar'
    }
};
