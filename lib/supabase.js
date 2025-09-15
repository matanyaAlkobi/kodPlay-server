// Connecting to the base station
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const table = "usersKodePlay";

export async function createUser(user){
    const {data,error} = await supabase.from(table).insert(user)
    if (error) throw new Error(error.message)
    return data
}

export async function getSpecificUser(user){
    const {data,error} = await supabase.from(table).select('*').eq('username',user)
    if (error) throw new Error(error.message)
    return data
}