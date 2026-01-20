export const hasPermission = (
    user : any , 
    permission : string
)=>{
    return user?.permissions?.includes(permission);
}

export const hasRole = (
    user : any,
    role : string
) =>{
    return user?.roles?.includes(role);
}