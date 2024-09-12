import {checkRemoveLastChar} from "../src/utils/checkRemoveLastChar"

test('Check if remove slash', () => {
    expect(checkRemoveLastChar("http://localhost/teste/", "/")).toStrictEqual("http://localhost/teste");
})

test('Check if didnt remove other slash', () => {
    expect(checkRemoveLastChar("http://localhost/teste", "/")).toStrictEqual("http://localhost/teste");
})
