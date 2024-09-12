import express from 'express';
import cors from "cors";
import callbackRoute from "./api/routes/callback";
import createTokenRoute from "./api/routes/createToken";
import sendMessageRoute from "./api/routes/sendMessage";
import cron from "./cron/jobs";
import schedule from 'node-schedule';
import env from './utils/env';
import init from './cron/init';

init();
const app = express();
app.use(express.json());
app.use(cors({
    origin: '*'
}));
callbackRoute(app);
createTokenRoute(app);
sendMessageRoute(app);
cron(schedule);

app.listen(env.PORT, () => { console.log("Backend Listening ON " + env.PORT) });