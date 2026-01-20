declare global {
    type AuthUser =  {
        userId: number;
        username: string;
        roles: string[];
        permissions: string[];
    }

}

export {};

