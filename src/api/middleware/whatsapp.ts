import env from "../../utils/env";
import { getIpv4FromDNS, matchIpv4 } from "../../utils/validation";

const middleware = async (req, res, next) => {

    const reqIp = matchIpv4(req.socket.remoteAddress);
    if (!reqIp) {
        console.log('[FATAL] Error reading client IPv4 in whatsapp callback, IP: ' + req.socket.remoteAddress)
        return res.sendStatus(500);
    }
    let whatsappHost;
    try {
        whatsappHost = new URL(env.WHATSAPP_URL).hostname;
    } catch (error) {
        console.log('[FATAL] env WHATSAPP_URL NOT set, WHATSAPP_URL:' + env.WHATSAPP_URL);
        return res.sendStatus(500);
    }
    
    const whatsappIpv4 = matchIpv4(whatsappHost) || await getIpv4FromDNS(whatsappHost);
    console.log(`whatsappIpv4: ${whatsappIpv4}`)
    console.log(`reqIp: ${reqIp}`)
    if (whatsappIpv4 != reqIp) {
        console.log('[-] Unauthorized attempt to use route /whatsapp/callback from: ' + req.socket.remoteAddress);
        return res.sendStatus(404);
    }
    next();
};
export default middleware;