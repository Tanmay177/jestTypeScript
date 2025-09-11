function logInput( arg:number|string):void{
    if(typeof arg === "number"){
        var arg2 = arg * arg;
        console.log(`Number :${arg2}`);
    }
    if(typeof arg === "string"){
        var capital = arg.toUpperCase();
        console.log(`String :${capital}`);
    }
}

logInput(10);
logInput("hello");