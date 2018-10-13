export const environment = {
    production: false,
    apiUrl: {
        boxes: {
            infoAggregateFake: {
                pieno: 'https://api.myjson.com/bins/16f4c4', /* 2 FUNZIONARI, BOX-RICHIESTE, BOX-MEZZI  */
                vuoto: 'https://api.myjson.com/bins/e2ew0' /* 0 FUNZIONARI, NO BOX-RCHIESTE, NO BOX-MEZZI */
            },
            owm: {
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
                richieste: 'https://api.myjson.com/bins/6vlu4',
                sedi: '',
                mezzi: ''
            },
            agm: {
                key: 'AIzaSyDYIMWNyVt1X_30PybcDMTZkFkcSsUytDk'
            }
        },
        rigaElencoRichieste: {
            fake: 'https://api.myjson.com/bins/ze8v4',
            backend: 'http://localhost:2661/api'
        },
        elencoFiltri: {
            fake: 'https://api.myjson.com/bins/c9b50',
        },
        eventiRichieste: {
            fake: 'https://api.myjson.com/bins/kz0w0',
            backend: 'http://localhost:2661/api'
        }
    }
};
