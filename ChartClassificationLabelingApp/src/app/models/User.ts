export interface User {
    id:number;
    name:string;
    password:string;
    roles: {
        admin: boolean;
        annotator: boolean;
        validator: boolean;   
    };
    username:string;
}
