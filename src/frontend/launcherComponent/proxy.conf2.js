const PROXY_CONFIG = [{
    context: [
        '/NotificationHub',
        '/api/Auth',
        '/api/Welcome',
        '/api/Navbar',
        '/api/Filtri',
        '/api/Chiamata',
        '/api/ComposizionePartenzaAvanzata',
        '/api/PreAccoppiati',
        '/api/ChiamataInCorso',
        '/api/ListaEventi',
        '/api/AddPrenotazioneMezzo',
        '/api/RemovePrenotazioneMezzo',
        '/api/ResetPrenotazioneMezzo',
        '/api/ConfermaPartenze',
        '/api/AttivitaUtente',
        '/api/GestionePartenza',
        '/api/GestioneRichiesta',
        '/api/GestioneMezziInServizio',
        '/api/Marker',
        '/api/PrenotazioneMezzo',
        '/api/GestioneSchedeContatto',
        '/api/GestioneUtenti',
        '/api/PersonaleVVF'
    ],
    target: "http://so115.api2.test/",
    secure: false,
    "changeOrigin": true,
    ws: true
}];
module.exports = PROXY_CONFIG;
