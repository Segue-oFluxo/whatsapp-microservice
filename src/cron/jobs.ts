import { fixWhatsappCallback } from "../utils/instancesFix";

async function jobs(scheduler) {

    scheduler.scheduleJob("* * * * *", async () => {
        try {
            await fixWhatsappCallback();
        } catch (e) {
            console.log("Error fixing whatsapp callback")
            console.log(e)
        }
    })
}

export default jobs;