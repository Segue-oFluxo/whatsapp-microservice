import prisma from "../db";
import WhatsappIntegration from "../integration/whatsapp";
export async function fixWhatsappCallback() {
    const instances = await prisma.instances.findMany();
    if(instances && instances.length > 0) {
        console.log("Running callback Fixer")
    }
    instances.forEach(async (instance) => {
        let webhook;
        try {
            webhook = await WhatsappIntegration.findWebhook(instance.instance_id);
        } catch (e) {
            console.log("[-] Error while retrieving webhook instance: ")
            console.log(e)
            return;
        }
        if (!('enabled' in webhook) || !webhook.enabled || !('url' in webhook) || webhook.url != WhatsappIntegration.CALLBACK_URL) {
            console.log("[+] Setting the webhook of instance: " + instance.instance_id);
            try {
                await WhatsappIntegration.setWebhook(instance.instance_id);
            } catch (e) {
                console.log("[-] Error while setting the webhook: ")
                console.log(e)
                return;
            }
        }

    })
}