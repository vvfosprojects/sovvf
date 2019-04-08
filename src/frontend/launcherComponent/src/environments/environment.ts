export const environment = {
    production: false,
    apiUrl: {
        boxes: {
            infoAggregate: 'https://api.myjson.com/bins/16f4c4',
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
                richieste: 'https://api.myjson.com/bins/17xt98',
                sedi: 'https://api.myjson.com/bins/18m83u',
                mezzi: 'https://api.myjson.com/bins/jwy84',
                centro: '',
                chiamate: ''
            }
        },
        rigaElencoRichieste: '/api/SintesiRichiesteAssistenza',
        elencoTipologie: 'assets/json/tipologie.json',
        eventiRichieste: 'https://api.myjson.com/bins/kz0w0',
        turno: '',
        elencoSedi: 'https://api.myjson.com/bins/10fsks',
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
