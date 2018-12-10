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
                richieste: 'http://win10dev-pc/so115rest/api/SintesiRichiesteAssistenzaMarker',
                sedi: 'https://api.myjson.com/bins/18m83u',
                mezzi: '',
                centro: ''
            },
            agm: {
                key: 'AIzaSyDYIMWNyVt1X_30PybcDMTZkFkcSsUytDk'
            }
        },
        rigaElencoRichieste: {
            fake: 'https://api.myjson.com/bins/x09t6',
            backend: 'http://win10dev-pc/so115rest/api/SintesiRichiesteAssistenza'
        },
        elencoTipologie: {
            fake: 'assets/json/tipologie.json',
        },
        eventiRichieste: {
            fake: 'https://api.myjson.com/bins/kz0w0',
            backend: 'http://localhost:2661/api'
        },
        turno: {
            fake: '',
            backend: ''
        },
        sedi: {
            fake: '',
            backend: ''
        }
    }
};
