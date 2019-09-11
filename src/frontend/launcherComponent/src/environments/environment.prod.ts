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
        schedeContatto: '/api/SchedeContatto',
        turno: '',  // TodoBackEnd: controller mancante
        composizione: { // TodoBackEnd: da sistemare prenotazione unico controller
            preaccoppiati: '/api/PreAccoppiati',
            avanzata: '/api/ComposizionePartenzaAvanzata',
            addPrenotazioneMezzo: '/api/AddPrenotazioneMezzo',
            removePrenotazioneMezzo: '/api/RemovePrenotazioneMezzo',
            resetPrenotazioneMezzo: '/api/ResetPrenotazioneMezzo',
            confermaPartenze: '/api/ConfermaPartenze'
        },
        chiamata: '/api/Chiamata/',
        auth: '/api/Auth',
        navbar: '/api/Navbar',
        meteo: 'http://api.openweathermap.org/data/2.5/weather?'
    }
};
