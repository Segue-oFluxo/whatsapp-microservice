import {evaluateTextMessage} from "../src/utils/evaluateTextMessage";

const tests = [
    //ambiguous
    {
        arg: "sim nao",
        result: undefined
    },
    {
        arg: "sim nao",
        result: undefined
    },
    {
        arg: "1 não",
        result: undefined
    },
    //anything else
    {
        arg: "3",
        result: undefined
    },
    {
        arg: "si",
        result: undefined
    },
    {
        arg: "ola 1",
        result: "yes"
    },
    {
        arg: "quero sim",
        result: "yes"
    },
    {
        arg: "1",
        result: "yes"
    },
    {
        arg: "Sim",
        result: "yes"
    },
    {
        arg: "1 - Sim",
        result: "yes"
    },
    
    {
        arg: "quero nao",
        result: "no"
    },
    {
        arg: "2",
        result: "no"
    },
    {
        arg: "Não",
        result: "no"
    },
    {
        arg: "NAO",
        result: "no"
    },
    {
        arg: "2 - Nao",
        result: "no"
    },

];

test('Check users responses', () => {
    for (let i = 0; i < tests.length; i++) {
        const element = tests[i];
        expect(evaluateTextMessage(element.arg)).toStrictEqual(element.result);
    }
})