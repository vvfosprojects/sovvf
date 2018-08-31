// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
    production: false,
    apiUrl: {
        infoAggregateFake: 'https://api.myjson.com/bins/r6m48', /* 2 FUNZIONARI, BOX-RICHIESTE, BOX-MEZZI  */
        /* infoAggregateFake: 'https://api.myjson.com/bins/e2ew0' */ /* 0 FUNZIONARI, NO BOX-RCHIESTE, NO BOX-MEZZI */
        openweathermap: 'http://api.openweathermap.org/data/2.5/weather?'
    }
};
