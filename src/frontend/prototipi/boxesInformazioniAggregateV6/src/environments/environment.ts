// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: {
        infoAggregateFake: {
            pieno: 'https://api.myjson.com/bins/r6m48', /* 2 FUNZIONARI, BOX-RICHIESTE, BOX-MEZZI  */
            vuoto: 'https://api.myjson.com/bins/e2ew0' /* 0 FUNZIONARI, NO BOX-RCHIESTE, NO BOX-MEZZI */
        },
        owm: {
            url: 'http://api.openweathermap.org/data/2.5/weather?',
            option: {
                lang: 'it',
                key: 'a23cc450dabf63fdb6729696aa29b3a6',
                unit: 'metric'
            },

        }
    }
};
