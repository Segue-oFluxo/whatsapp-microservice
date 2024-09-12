import { CreateTokenProps } from "../../types";
import { Request, Response, Express } from "express";
import WhatsappIntegration from "../../integration/whatsapp";
import prisma from "../../db";
import crypto from "crypto";
import { validateUrl } from "../../utils/validation";
import middleware from "../middleware/external";
import { fixWhatsappCallback } from "../../utils/instancesFix";
export default function route(app: Express) {
    app.post("/createToken", middleware, async (req: Request, res: Response) => {

        const { callbackURL, userid }: CreateTokenProps = req.body;
        const callback = validateUrl(callbackURL);
        if (!callback) {
            return res.status(400).send({
                status: "error",
                error: "The 'callbackURL' was not provided or is not a valid url."
            })
        }
        if (!userid) {
            return res.status(400).send({
                status: "error",
                error: "The 'userid' was not provided."
            })
        }
        if(userid.replace(/([^a-zA-Z0-9 ])/g, '') != userid) {
            return res.status(400).send({
                status: "error",
                error: "The 'userid' can not contain special characters. (Except spaces)"
            })
        }
        const newToken = crypto.randomBytes(64).toString("base64");

        const dbInstance = await prisma.instances.findFirst({
            where: {
                instance_id: userid
            }
        });

        let instance;
        try {
            instance = (await WhatsappIntegration.connectionStatus(userid)).instance;
        } catch (e) {
            if (e.status == 404) {
                instance = undefined;
            } else if (e.status == 500) {
                return res.status(500).send({error: "Internal Server Error. Please restart the application"})
            }
        }
        if (!instance) {
            console.log(`[-] Instance ${userid} doesnt exists. Attempting to create.`);
            const response = await WhatsappIntegration.createInstance({
                instance_id: userid,
                token: newToken,
            });
            res.send({ qrcode: response.qrcode.base64 });

            if (dbInstance) {
                await prisma.instances.update({
                    where: {
                        instance_id: dbInstance.instance_id
                    },
                    data: {
                        callback: callback,
                        token: dbInstance.token,
                        status: "connecting"
                    }
                })
            } else {
                await prisma.instances.create({
                    data: {
                        callback: callback,
                        instance_id: userid,
                        token: newToken,
                        status: "connecting"
                    }
                })
            }
        }
        else {
            console.log(`[-] Instance ${userid} already exists`);

            let newStatus: string;
            if (instance.state == "open") {
                newStatus = "open";
                res.status(400).send({
                    status: "error",
                    error: `This name '${userid}' is already connected`,
                    wp_auth_token: dbInstance?.token || newToken
                });
            }
            if (instance.state.match(/connecting|close/)) {
                console.log("[+] Fetching QRcode...")
                newStatus = "connecting";
                try {
                    const { base64 } = await WhatsappIntegration.connect(userid);
                    if (!base64) {
                        console.log("[ERROR] Instance didnt return QRCODE")
                        return res.sendStatus(500);
                    }
                    res.send({ qrcode: base64 });
                } catch (e) {
                    console.log("[FATAL] Error in connecting to an instance")
                    return res.sendStatus(500);
                }
            }

            if (dbInstance) {
                await prisma.instances.update({
                    where: {
                        instance_id: dbInstance.instance_id
                    },
                    data: {
                        callback: callback,
                        token: dbInstance.token,
                        status: newStatus
                    }
                })
            } else {
                await prisma.instances.create({
                    data: {
                        callback: callback,
                        instance_id: userid,
                        token: newToken,
                        status: newStatus
                    }
                })
            }
            await fixWhatsappCallback()
        }

    });

}