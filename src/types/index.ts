export interface CreateTokenProps {
    callbackURL: string,
    userid: string,
}

export interface CreateInstanceProps {
    instance_id?: string
    callback?: string
    token?: string
}

export interface SendeMessageWhatsappProps {
    instance_id: string,
    phone: string,
    message: string,
}

export interface SendMessageProps {
    callbackURL?: string,
    userid: string,
    wp_auth_token: string, 
    message: string, 
    phone: string, 
    eventid?: string,
}