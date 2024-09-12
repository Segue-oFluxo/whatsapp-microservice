import { Request, Response, Express } from "express";
import { SendMessageProps } from "../../types";
import prisma from "../../db";
import WhatsappIntegration from "../../integration/whatsapp";
import { validateUrl, formatBrazilWhatsapp } from "../../utils/validation";
import { instances } from "@prisma/client";
import { AxiosError } from "axios";
import middleware from "../middleware/external";
export default function route(app: Express) {
    app.post("/sendMessage", middleware, async (req: Request, res: Response) => {
        const { callbackURL, userid, message, phone, wp_auth_token, eventid }: SendMessageProps = req.body;
        const callback = validateUrl(callbackURL);
        const validatedPhone = formatBrazilWhatsapp(phone);
        const msg = message + `\n\n*1* - Sim\n*2* - Não`;
        if (!userid) {
            return res.status(400).send({
                status: "error",
                error: "The 'userid' was not provided."
            })
        }
        if (userid.replace(/([^a-zA-Z0-9 ])/g, '') != userid) {
            return res.status(400).send({
                status: "error",
                error: "The 'userid' can not contain special characters. (Except spaces)"
            })
        }
        if (!eventid) {
            return res.status(400).send({
                status: "error",
                error: "The 'eventid' was not provided."
            })
        }
        if (!message) {
            return res.status(400).send({
                error: "The 'message' was not provided."
            })
        }
        if (!validatedPhone) {
            return res.status(400).send({
                status: "error",
                error: "The 'phone' was not provided or is invalid."
            })
        }
        if (!wp_auth_token) {
            return res.status(400).send({
                status: "error",
                error: "The 'wp_auth_token' was not provided."
            })
        }

        let instance: instances;
        try {
            instance = await prisma.instances.findFirstOrThrow({
                where: {
                    instance_id: userid
                }
            })
        } catch (e) {
            if (e && e.code === "P2025") {
                return res.status(404).send({
                    status: "error",
                    error: "WhatsApp number with this userid was not found."
                })
            }
            console.log(e)
        }

        if (instance.token != wp_auth_token) {
            return res.status(403).send({
                status: "error",
                error: "The string 'wp_auth_token' doesn't match the userid."
            })
        }
        if (instance.status != "open") {
            return res.status(403).send({
                status: "error",
                error: `This number '${instance.instance_id}' is not connected with WhatsApp`
            })
        }


        let result;
        try {
            result = await WhatsappIntegration.sendMessage({
                instance_id: instance.instance_id,
                message: msg,
                phone: validatedPhone,
            })
        } catch (e) {
            let message: string;
            if (e?.response?.data?.response?.message == "Connection Closed") {
                message = `This number '${instance.instance_id}' is not connected with WhatsApp`;
            }
            if (e?.response?.data?.response?.message && e.response.data.response.message.length > 0 &&
                e.response.data.response.message[0].exists == false) {
                message = `This number '${validatedPhone}' does not use WhatsApp`;
            }
            return res.status(400).json({
                status: "error",
                error: message || "Error connecting to WhatsApp API"
            })
        }
        res.send({
            status: "sent"
        });
        await prisma.messages.create({
            data: {
                callback: callback || "",
                eventid: eventid || null,
                phone: result.key.remoteJid,
                status: "pending",
                instance_id: instance.instance_id,
            }
        })
    });

}