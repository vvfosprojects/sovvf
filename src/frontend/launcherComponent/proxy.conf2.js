const PROXY_CONFIG = [
    {
        context: [
            "/NotificationHub",
            "/api/auth/Login",
            "/api/Welcome",
            "/api/Navbar",
            "/api/Filtri",
            "/api/InserimentoIntervento",
            "/api/UpdateIntervento",
            "/api/ComposizionePartenzaAvanzata",
            "/api/ChiamataInCorso",
            "/api/ListaEventi",
            "/api/AddPrenotazioneMezzo",
            "/api/RemovePrenotazioneMezzo",
            "/api/ResetPrenotazioneMezzo"
        ],
        target: "http://so115.api2.test/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
