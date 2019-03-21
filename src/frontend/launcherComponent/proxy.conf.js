const PROXY_CONFIG = [
    {
        context: [
            "/SubscriptionHub",
            "/NotificationHub",
            "/NotificationMarkerHub"
        ],
        target: "http://so115.api.it/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
