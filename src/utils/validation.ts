import dns from "node:dns/promises"
export function formatBrazilWhatsapp(number: string): string | undefined {
    number = (number || "").replace(/\D/g, '');

    const numberLength = number.length;
    if (numberLength < 10) {
        return undefined;
    }
    if (number.startsWith("55") && numberLength > 11) {
        number = number.replace(/^55/, '');
    }

    const eigthDigit = number.slice(-8)
    const ddd = number.slice(0, 2)

    if (Number(ddd) <= 30) {
        return "55" + ddd + "9" + eigthDigit;
    }

    return "55" + ddd + eigthDigit;
}

export function validateUrl(str: string): string | undefined {
    try {
        const url = new URL(str);
        return (url.protocol === "http:" || url.protocol === "https:")
            ? url.href : undefined;
    } catch (error) {
        return undefined;
    }
}

export function matchIpv4(str: string): string | undefined {
    const match = str.match(/((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}/);
    return match && match.length > 0 ? match[0] : undefined;
}

export async function getIpv4FromDNS(str: string) {
    const resolve = await dns.lookup(str, {family: 4});
    return resolve.address;
}