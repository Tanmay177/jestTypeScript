export {};
 
let name:string = "Tanmay";
let age:number = 30;
let isEnrolled:boolean = true;
let courses:string[] = ["React", "Angular", "Node.js"];

function getStudentInfo(name:string, age:number, isEnrolled:boolean):string{
    return `Student ${name} is ${age} years old. Enrolled:: ${isEnrolled}`;
}

console.log(getStudentInfo(name, age, isEnrolled));
