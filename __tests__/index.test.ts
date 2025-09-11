import { myFunc } from "../index";

describe("myFunc", () => {
    it("returns the same value it receives", () => {
        expect(myFunc(123)).toBe(123);
        expect(myFunc("hello")).toBe("hello");
        expect(myFunc({ a: 1 })).toEqual({ a: 1 });
    });
});


