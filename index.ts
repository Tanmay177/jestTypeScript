// let a = 5;
// let b:string = "5";
// a = "adf";

// let result:number = a+b;

// console.log(`The result is ${a + b}`);
// console.log(result);

function myFunc<T>(a : T): T{
    return a;
}

let tanmayfunction = myFunc<number>(100);
console.log(`Result for the generic function is : ${tanmayfunction}`);
