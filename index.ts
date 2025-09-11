// let a = 5;
// let b:string = "5";
// a = "adf";

// let result:number = a+b;

// console.log(`The result is ${a + b}`);
// console.log(result);

export function myFunc<T>(a: T): T {
    return a;
}

const exampleResult = myFunc<number>(100);
console.log(`Result for the generic function is : ${exampleResult}`);
