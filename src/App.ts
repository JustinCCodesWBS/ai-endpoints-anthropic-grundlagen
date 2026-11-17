import express from 'express';
import { config } from './config.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { aiRoutes } from './routes/aiRoutes.ts';

const app = express();

app.use('/ai', aiRoutes);
app.use(errorHandler);

app.listen(config.PORT, '127.0.0.1', () => {
    console.log(`Support-API läuft auf http://127.0.0.1:${config.PORT}`);
});
