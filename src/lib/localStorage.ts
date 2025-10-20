
export const tokenKey = 'Ux7pL9mK3qR5tY2wZ8vN';
export const IS_FIRST_TIME_KEY = 'Jk4nM8vB2xC9pL5tR7hQ';
export const USER_KEY = 'A1b2C3d4E5f6G7h8I9j0';


export   function saveToLocalStorage(key:string,value:string):boolean{
    try{
         localStorage.setItem(key,value);
       return true
    }catch(err){
        console.error(err);
        return false;
    }
}

export async function getFromLocalStorage(key:string):Promise<string | null>{
    try {
        return  localStorage.getItem(key)
    } catch (error) {
        return null;
    }   
}

export function removeFromLocalStorage(key: string): boolean {
    try {
        localStorage.removeItem(key);
        return true;
    } catch (error) {
        return false;
    }
}