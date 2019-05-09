const PROXY_CONFIG = [
    {
        context: [
            "/NotificationHub",
            "/api/SintesiRichiesteAssistenza",
            "/api/SintesiRichiesteAssistenzaMarker",
            "/api/SintesiSediMarker",
            "/api/SintesiMezziMarker",
            "/api/Navbar",
            "/api/auth/Login",
            "/api/BoxRichieste",
            "/api/BoxMezzi",
            "/api/BoxPersonale"
        ],
        target: "http://DESKTOP-RC0RAUA:5000/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
