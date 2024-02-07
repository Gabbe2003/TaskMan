const allowedOrigins = [
    'https://www.yoursite.com',
    'http://localhost:8000',
    'http://localhost:5173',
    'http://localhost:3000',
    '127.0.0.1'
];


const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200
}

module.exports = corsOptions;
