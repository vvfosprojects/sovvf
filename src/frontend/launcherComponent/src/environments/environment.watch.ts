export const environment = {
    production: true,
    productionTest: true,
    consoleLog: true,
    toastr: true,
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
        gestioneFonogramma: '/api/GestioneFonogramma',
        gestionePartenza: '/api/GestionePartenza',
        gestioneSoccorsoAereo: '/api/GestioneSoccorsoAereo',
        mezziInServizio: '/api/GestioneMezziInServizio',
        schedeContatto: '/api/GestioneSchedeContatto',
        turno: '',  // TodoBackEnd: controller mancante
        composizione: {
            preaccoppiati: '/api/PreAccoppiati',
            avanzata: '/api/ComposizionePartenzaAvanzata',
            squadre: '/api/ComposizioneSquadre',
            mezzi: '/api/ComposizioneMezzi',
            confermaPartenze: '/api/ConfermaPartenze',
            prenotazione: '/api/PrenotazioneMezzo'
        },
        chiamata: '/api/Chiamata',
        codaChiamate: '/api/GestioneCodaChiamate',
        competenze: '/api/GestioneCompetenze',
        utenti: '/api/Utenti',
        gestioneUtenti: '/api/GestioneUtenti',
        gestioneRuolo: '/api/GestioneRuolo',
        personaleVVF: '/api/PersonaleVVF',
        auth: '/api/Auth',
        navbar: '/api/Navbar',
        meteo: 'https://api.openweathermap.org/data/2.5/weather?',
        enti: '/api/GestioneEnti',
        rubricaPersonale: '/api/GestioneRubricaPersonale',
        trasferimentoChiamata: '/api/GestioneTrasferimentiChiamate',
        stampaRichiesta: '/api/GestioneFile/DettaglioRichiesta',
        stampaRiepilogoInterventi: '/api/GestioneFile/RiepilogoInterventi',
        modificaPartenza: '/api/GestionePartenza/ModificaPartenza',
        sostituzionePartenza: '/api/GestionePartenza/SostituzionePartenza',
        distaccamenti: '/api/Distaccamenti',
        tipologie: '/api/GestioneTipologie',
        dettagliTipologie: '/api/GestioneDettaglioTipologia',
        triage: '/api/GestioneTriage',
        pos: '/api/GestionePos'
    },
    casUrl: {
        linkLogin: 'http://sso.vigilfuoco.it/cas-test/login?service=',
        linkLogout: 'http://sso.vigilfuoco.it/cas-test/logout?service=',
        serviceName: 'http://sovvf-test.dipvvf.it/',
    }
};
