import { Request, Response } from "express"
import prisma from "../../db";
import axios from "axios";
import { evaluateTextMessage } from "../../utils/evaluateTextMessage";
import middleware from "../middleware/whatsapp";
import { checkRemoveLastChar } from "../../utils/checkRemoveLastChar";
export default function route(app) {
    app.post("/whatsapp/callback", middleware, async (req: Request, res: Response) => {
        res.status(200);
        console.log( req.socket.remoteAddress )
        const instance = await prisma.instances.findFirst({
            where: {
                instance_id: req.body.instance
            }
        });
        if (!instance) {
            console.log("[-] Error: instance does not exist in db")
            return res.status(200);
        }
        if (!req.body.data) {
            console.log("[-] Error: callback data is empty from WhatsApp")
            return res.status(200);
        }
        const data = req.body.data;
        if (req.body.event == 'connection.update') {
            if (instance.status != "open" && data.state == "open") {
                await prisma.instances.update({
                    where: {
                        instance_id: instance.instance_id,
                    },
                    data: {
                        status: "open"
                    }
                });
                try {
                    await axios.post(`${checkRemoveLastChar(instance.callback, "/")}/configWP/${instance.instance_id}`, { wp_auth_token: instance.token });
                } catch (error) {
                    console.log('[-] Error posting to callback URL: ');
                    console.log(error?.reason);
                }
            }
            return;
        }
        if (req.body.event == 'messages.upsert') {
            if (data.key.fromMe) {
                console.log('[-] Message is from me. No action needed');
                return;
            }
            if (!["conversation", "extendedTextMessage"].includes(data.messageType)) {
                console.log('[-] Message is not of the type text. No action needed');
                return;
            }

            const message = await prisma.messages.findFirst({
                where: {
                    instance_id: instance.instance_id,
                    phone: data.key.remoteJid,
                    status: "pending"
                },
                orderBy: {
                    updated_at: "desc"
                }
            })
            if (!message) {
                console.log('[-] Message is not on the list. No action needed');
                return;
            }

            const callback = message.callback || instance.callback;
            const text = data.messageType == "conversation" ? data.message.conversation
                : data.message.extendedTextMessage.text
            const evaluation = evaluateTextMessage(text);
            if (evaluation == undefined) {
                console.log('[-] Text does not correspond to the yes no criteria. No action needed');
                return;
            }
            console.log(`[+] Text message from ${message.phone.replace(/\D/g, '')} of type "${evaluation}"`);
            try {
                await axios.post(`${checkRemoveLastChar(callback, "/")}/WPresponse/${message.eventid}`, { response: evaluation });
            } catch (error) {
                console.log('[-] Error posting to callback URL: ');
                console.log(error?.reason);
            }
            await prisma.messages.updateMany({
                where: {
                    instance_id: message.instance_id,
                    phone: message.phone,
                    status: "pending",
                },
                data: {
                    status: "finished",
                    callback: callback
                }
            })
            return;
        }
    });

}