"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const fs_1 = require("fs");
const path_1 = require("path");
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const express_1 = require("express");
async function bootstrap() {
    const envPath = (0, path_1.join)(process.cwd(), '.env');
    if ((0, fs_1.existsSync)(envPath)) {
        dotenv.config({ path: envPath });
    }
    else if (process.env.NODE_ENV !== 'production') {
        const envExamplePath = (0, path_1.join)(process.cwd(), '.env.example');
        if ((0, fs_1.existsSync)(envExamplePath))
            dotenv.config({ path: envExamplePath });
    }
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, express_1.json)({ limit: '10mb' }));
    app.use((0, express_1.urlencoded)({ extended: true, limit: '10mb' }));
    app.enableCors({
        origin: (origin, callback) => {
            if (!origin)
                return callback(null, true);
            const allowedOrigins = [
                'http://localhost:5173',
                'http://127.0.0.1:5173',
                'https://kids-videl.vercel.app',
                process.env.ADMIN_DASHBOARD_URL,
            ].filter(Boolean);
            if (allowedOrigins.some((o) => origin.startsWith(o))) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
        allowedHeaders: 'Content-Type,Accept,Authorization,X-Requested-With',
        optionsSuccessStatus: 204,
    });
    const port = process.env.PORT || 3000;
    await app.listen(port);
    console.log(`Backend running on port ${port}`);
}
bootstrap();
//# sourceMappingURL=main.js.map