const PROXY_CONFIG = [
    {
        context: [
            "/NotificationHub",
            "/api/SintesiRichiesteAssistenza",
            "/api/auth/Login"
        ],
        target: "http://so115.api2.test/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
