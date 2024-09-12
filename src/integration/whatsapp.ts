import { SendeMessageWhatsappProps, CreateInstanceProps } from "../types";
import axios from "axios";
import env from "../utils/env";

class WhatsappIntegration {
    static CALLBACK_URL = env.API_URL + "/whatsapp/callback";
    static WEBHOOK_EVENTS = [
        "CONNECTION_UPDATE",
        "MESSAGES_UPSERT",
    ];
    static async createInstance(args: CreateInstanceProps) {
        const data = {
            instanceName: args.instance_id,
            token: args.token,
            qrcode: true,
            integration: "WHATSAPP-BAILEYS",
            reject_call: false,
            read_status: true,
            webhook: WhatsappIntegration.CALLBACK_URL,
            webhook_by_events: false,
            events: WhatsappIntegration.WEBHOOK_EVENTS,
        }
        const response = await WhatsappIntegration.curl("/instance/create", "POST", data);
        return response?.data;
    }

    static async sendMessage(args: SendeMessageWhatsappProps) {
        const data = {
            number: args.phone,
            options: {
                delay: 1000,
                presence: "composing",
                linkPreview: false
            },
            textMessage: {
                text: args.message
            }
        }
        const response = await WhatsappIntegration.curl(`/message/sendText/${args.instance_id}`, "POST", data);
        return response?.data;
    }

    static async fetchAll() {
        const response = await WhatsappIntegration.curl("/instance/fetchInstances");
        return response.data;
    }

    static async connectionStatus(instanceName: string) {
        const response = await WhatsappIntegration.curl("/instance/connectionState/" + instanceName);
        return response.data;
    }

    static async findWebhook(instanceName: string) {
        const response = await WhatsappIntegration.curl("/webhook/find/" + instanceName);
        return response.data;
    }

    static async setWebhook(instanceName: string) {
        const data = {
            url: WhatsappIntegration.CALLBACK_URL,
            webhook_by_events: false,
            events: WhatsappIntegration.WEBHOOK_EVENTS,
        }
        const response = await WhatsappIntegration.curl("/webhook/set/" + instanceName, "POST", data);
        return response.data;
    }

    static async delete(instanceName: string) {
        const response = await WhatsappIntegration.curl("/instance/delete/" + instanceName, "DELETE");
        return response;
    }

    static async logout(instanceName: string) {
        const response = await WhatsappIntegration.curl("/instance/logout/" + instanceName, "DELETE");
        return response;
    }

    static async connect(instanceName: string) {
        const response = await WhatsappIntegration.curl("/instance/connect/" + instanceName);
        return response.data;
    }

    private static async curl(endpoint: string, method: "GET" | "POST" | "PUT" | "DELETE" = "GET", data?: { [key: string]: any }) {
        const options = {
            headers: {
                'apikey': env.API_TOKEN,
                'Content-type': 'application/json'
            }
        }
        switch (method) {
            case "POST":
                return await axios.post(env.WHATSAPP_URL + endpoint, data, options)
            case "PUT":
                return await axios.put(env.WHATSAPP_URL + endpoint, data, options)
            case "DELETE":
                return await axios.delete(env.WHATSAPP_URL + endpoint, options)
            case "GET":
                return await axios.get(env.WHATSAPP_URL + endpoint, options)
            default:
                throw new Error(`Invalid method used: ${method}`);
        }
        return undefined;
    }


}

export default WhatsappIntegration