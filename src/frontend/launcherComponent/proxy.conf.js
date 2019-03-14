const PROXY_CONFIG = [
    {
        context: [
            "/employees",
            "/SubscriptionHub",
        ],
        target: "http://so115.api.it/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
