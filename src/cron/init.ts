import { fixWhatsappCallback } from "../utils/instancesFix";

export default async function init() {
    await new Promise(r => setTimeout(r, 10000));
    await fixWhatsappCallback();
}