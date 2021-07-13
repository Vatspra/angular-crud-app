export interface User {
    fname: string;
    lname: string;
    phone: string;
    email: string;
    avatar?: string;
    _id: string;
}

export enum FilesType {
    Image = 'image'
}