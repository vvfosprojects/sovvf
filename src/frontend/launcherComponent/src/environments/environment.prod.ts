export const environment = {
    production: true,
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
                richieste: 'http://so115-mike/so115rest/api/SintesiRichiesteAssistenzaMarker',
                sedi: 'https://api.myjson.com/bins/18m83u',
                mezzi: 'https://api.myjson.com/bins/jwy84',
                centro: ''
            }
        },
        rigaElencoRichieste: 'http://so115-mike/so115rest/api/SintesiRichiesteAssistenza',
        elencoTipologie: 'https://api.myjson.com/bins/10xluw',
        eventiRichieste: 'https://api.myjson.com/bins/kz0w0',
        turno: '',
        elencoSedi: 'https://api.myjson.com/bins/10fsks',
        composizione: {
            preaccoppiati: '',
            mezzi: '',
            squadre: ''
        },
        users: '/users',
        genera: 'http://so115-mike/so115rest/api/GeneraSintesiRichiesteAssistenza',
        generaFake: false
    }
};
