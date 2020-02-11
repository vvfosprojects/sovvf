export const environment = {
    production: true,
    fakeProvider: false,
    signalRHub: '/NotificationHub',
    signalR: true,
    apiUrl: {
        welcome: '/api/Welcome',
        markers: '/api/Marker',
        markerChiamataInCorso: '/api/ChiamataInCorso',
        rigaElencoRichieste: '/api/SintesiRichiesteAssistenza',
        eventiRichieste: '/api/ListaEventi',
        attivitaUtente: '/api/AttivitaUtente',
        gestioneRichiesta: '/api/GestioneRichiesta',
        gestionePartenza: '/api/GestionePartenza/',
        mezziInServizio: '/api/GestioneMezziInServizio',
        schedeContatto: '/api/GestioneSchedeContatto',
        turno: '',  // TodoBackEnd: controller mancante
        composizione: {
            preaccoppiati: '/api/PreAccoppiati',
            avanzata: '/api/ComposizionePartenzaAvanzata',
            confermaPartenze: '/api/ConfermaPartenze',
            prenotazione: 'api/PrenotazioneMezzo'
        },
        chiamata: '/api/Chiamata',
        utenti: '/api/Utenti',
        auth: '/api/Auth',
        navbar: '/api/Navbar',
        meteo: 'http://api.openweathermap.org/data/2.5/weather?'
    }
};
