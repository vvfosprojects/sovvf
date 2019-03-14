const PROXY_CONFIG = [
    {
        context: [
            "/employees",
            "/SubscriptionHub",
        ],
        target: "http://so115.api2.test/",
        secure: false,
        "changeOrigin": true,
        ws: true
    }
];
module.exports = PROXY_CONFIG;
