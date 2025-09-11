function wrapInArray<T>(item:T):T[]{
    return [item];
}

interface ApiResponse<T>{
    success:boolean;
    data:T;
}

class User{
    id:number;
    username:string;
}

const user:ApiResponse<User> = {
    data:{
        id :20,
        username:"Tanmay",
    },
    success:true,
}

let booktitles:ApiResponse<string[]> = {
    data:["b1", "b2", "b3"],
    success:true,
}
