export const environment = {
    production: true,
    apiUrl: {
        appSettings: 'https://api.myjson.com/bins/1gwhxs',
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
                richieste: 'http://so115-mike/so115rest/api/SintesiRichiesteAssistenzaMarker',
                sedi: 'https://api.myjson.com/bins/18m83u',
                mezzi: 'https://api.myjson.com/bins/jwy84',
                centro: '',
                chiamate: ''
            }
        },
        rigaElencoRichieste: 'http://so115-mike/so115rest/api/SintesiRichiesteAssistenza',
        eventiRichieste: 'https://api.myjson.com/bins/kz0w0',
        turno: '',
        composizione: {
            preaccoppiati: '',
            mezzi: '',
            squadre: ''
        },
        chiamata: {
            currentId: '',
        },
        listaSedi: '',
        login: '/api/auth/Login',
        users: '/api/users'
    }
};
