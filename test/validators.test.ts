import { validateUrl, formatBrazilWhatsapp, matchIpv4 } from "../src/utils/validation";

const whatsappTests = [
    {
        arg: "as555a",
        result: undefined
    },
    // ddd > 30
    {
        arg: "3499659712",
        result: "553499659712"
    },
    // ddd < 30
    {
        arg: "1499659712",
        result: "5514999659712"
    },
    // < 10
    {
        arg: "349999999",
        result: undefined
    },
    // already formatted
    {
        arg: "553499659712",
        result: "553499659712"
    },
    // already formatted with not allowed characters
    {
        arg: "553499/659 712",
        result: "553499659712"
    },
];

const urlTests = [
    {
        arg: "/",
        result: undefined
    },
    {
        arg: "http://localhost:8080",
        result: "http://localhost:8080/"
    },
    {
        arg: "https://localhost:8080",
        result: "https://localhost:8080/"
    },
    {
        arg: "https://localhost:8080/callback/test",
        result: "https://localhost:8080/callback/test"
    },
    {
        arg: "hts://localhost:8080/cas",
        result: undefined
    },
    {
        arg: "http:/localhost:8080/slash",
        result: "http://localhost:8080/slash"
    },
    {
        arg: "http//localhost:8080/cas",
        result: undefined
    },
];
test('Format WhatsApp numbers', () => {
    for (let i = 0; i < whatsappTests.length; i++) {
        const element = whatsappTests[i];
        expect(formatBrazilWhatsapp(element.arg)).toStrictEqual(element.result);
    }

})

test('Validate URLs', () => {
    for (let i = 0; i < urlTests.length; i++) {
        const element = urlTests[i];
        expect(validateUrl(element.arg)).toStrictEqual(element.result);
    }
})

test('Validate IPv4', () => {
    expect(matchIpv4("::ffff:172.20.0.2")).toStrictEqual("172.20.0.2");
    expect(matchIpv4("http://evolution:8080/")).toStrictEqual(undefined);
})
