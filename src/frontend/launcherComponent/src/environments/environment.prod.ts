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
                centro: '',  // Todo: controller mancante
                chiamate: ''  // Todo: controller mancante
            }
        },
        rigaElencoRichieste: '/api/SintesiRichiesteAssistenza',
        eventiRichieste: 'https://api.myjson.com/bins/kz0w0', // Todo: controller mancante
        turno: '',  // Todo: controller mancante
        composizione: {
            preaccoppiati: '/api/PreAccoppiati',
            mezzi: '/api/ComposizioneMezzi',
            squadre: '/api/ComposizioneMezzi',
            filtri: '/api/Filtri'
        },
        chiamata: {
            currentId: '', // Todo: controller mancante non sicuro se da fare
            inserimento: '/api/InserimentoIntervento'
        },
        login: '/api/auth/Login',
        users: '/api/users',
        navbar: '/api/Navbar'
    }
};
