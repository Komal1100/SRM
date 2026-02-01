import bcrypt from "bcryptjs"

export const hashPassword = async(password: string)=>{
    return bcrypt.hash(password , 10);
}

export const verifyPassword =  async (
    password : string,
    hash : string
) => {
    console.log(password + "  ..0" + hash)
    // return bcrypt.compare(password , hash);

    return password==hash
}