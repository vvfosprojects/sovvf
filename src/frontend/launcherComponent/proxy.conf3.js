const PROXY_CONFIG = [
    {
        context: [
            "/NotificationHub",
            "/api/auth/Login",
            "/api/Welcome",
            "/api/Navbar",
            "/api/Filtri",
            "/api/Chiamata",
            "/api/ComposizionePartenzaAvanzata",
            "/api/PreAccoppiati",
            "/api/ChiamataInCorso",
            "/api/ListaEventi",
            "/api/AddPrenotazioneMezzo",
            "/api/RemovePrenotazioneMezzo",
            "/api/ResetPrenotazioneMezzo",
            "/api/ConfermaPartenze",
            "/api/AttivitaUtente",
            '/api/GestionePartenza'
        ],
        target: "http://172.16.16.13:5000/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
