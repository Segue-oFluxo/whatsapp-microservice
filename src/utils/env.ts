import dotenv from "dotenv"
dotenv.config();

let port;
try {
    port = new URL(process.env.API_URL).port
} catch (error) {
}

const env = {
    WHATSAPP_URL: process.env.WHATSAPP_URL 
        || (process.env.WHATSAPP_SERVER_HOST_NAME  ? `http://${process.env.WHATSAPP_SERVER_HOST_NAME}:8080` : undefined),
    API_TOKEN: process.env.AUTHENTICATION_API_KEY,
    API_URL: process.env.API_URL 
        || (process.env.API_SERVER_HOST_NAME && process.env.API_SERVER_PORT ? `http://${process.env.API_SERVER_HOST_NAME}:${process.env.API_SERVER_PORT}` : undefined),
    PORT: port || process.env.API_SERVER_PORT || 8000,
}
Object.keys(env).forEach(key => {
    if(!env[key]) {
        throw new Error(`Enviroment variable ${key} was not provided and is required`);
    }
})
export default env