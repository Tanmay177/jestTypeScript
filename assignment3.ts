import { log } from "console";

class Person {
    name: string;
    age: number;

    public introduce() {
        console.log(`Hi, I'm ${this.name} and I'm ${this.age} years old.`);
    }
}

class Student extends Person {
    studentId: number;

    public study() {
        console.log(`Student ${this.name} is studying.`);
                
    }
}

var Tanmay = new Student();
Tanmay.name = "Tanmay";
Tanmay.age = 20;
Tanmay.studentId = 123456;
Tanmay.introduce();
Tanmay.study();
