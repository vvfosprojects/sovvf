export const environment = {
    production: true,
    productionTest: true,
    consoleLog: true,
    toastr: true,
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
        gestioneFonogramma: '/api/GestioneFonogramma',
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
        meteo: 'https://api.openweathermap.org/data/2.5/weather?',
        enti: '/api/GestioneEnti',
        trasferimentoChiamata: '/api/GestioneTrasferimentiChiamate',
        modificaPartenza: '/api/GestionePartenza/ModificaPartenza'
    },
    casUrl: {
        linkLogin: 'http://sso.vigilfuoco.it/cas-test/login?service=',
        linkLogout: 'http://sso.vigilfuoco.it/cas-test/logout?service=',
        serviceName: 'http://sovvf-test.dipvvf.it/',
    }
};
