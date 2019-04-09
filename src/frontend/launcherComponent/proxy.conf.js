const PROXY_CONFIG = [
    {
        context: [
            "/NotificationHub",
            "/api/SintesiRichiesteAssistenza",
            "/api/auth/Login",
            "/api/BoxRichieste",
            "/api/BoxMezzi",
            "/api/BoxPersonale"
        ],
        target: "http://so115.api.it/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
