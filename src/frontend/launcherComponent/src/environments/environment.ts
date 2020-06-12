export const environment = {
    production: false,
    productionTest: false,
    consoleLog: true,
    toastr: true,
    fakeProvider: false,
    onlyCas: false,
    signalRHub: '/NotificationHub',
    baseUrl: 'http://localhost:5220',
    signalR: true,
    versionCheckURL: 'version.json',
    apiUrl: {
        welcome: '/api/Welcome',
        markers: '/api/Marker',
        markerChiamataInCorso: '/api/ChiamataInCorso',
        rigaElencoRichieste: '/api/GestioneRichiesta/GetRichieste',
        eventiRichieste: '/api/ListaEventi',
        attivitaUtente: '/api/AttivitaUtente',
        gestioneRichiesta: '/api/GestioneRichiesta',
        gestionePartenza: '/api/GestionePartenza',
        mezziInServizio: '/api/GestioneMezziInServizio',
        schedeContatto: '/api/GestioneSchedeContatto',
        turno: '',  // TodoBackEnd: controller mancante
        composizione: {
            preaccoppiati: '/api/PreAccoppiati',
            avanzata: '/api/ComposizionePartenzaAvanzata',
            confermaPartenze: '/api/ConfermaPartenze',
            prenotazione: '/api/PrenotazioneMezzo'
        },
        chiamata: '/api/Chiamata',
        utenti: '/api/Utenti',
        gestioneUtenti: '/api/GestioneUtenti',
        gestioneRuolo: '/api/GestioneRuolo',
        personaleVVF: '/api/PersonaleVVF',
        auth: '/api/Auth',
        navbar: '/api/Navbar',
        meteo: 'https://api.openweathermap.org/data/2.5/weather?'
    },
    casUrl: {
        linkLogin: 'http://sso.vigilfuoco.it/cas-test/login?service=',
        linkLogout: 'http://sso.vigilfuoco.it/cas-test/logout?service=',
        serviceName: 'http://sovvf-test.dipvvf.it/',
    }
};
