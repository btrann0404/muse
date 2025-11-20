import type { Database } from '@/types/database';
import { createClient } from '@supabase/supabase-js'

const supabaseUrl =  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY!;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Something went wrong with Supabase environment variables!")
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

//get current user
export async function getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    
    if (error) throw error;
    return user;  
}

//create user by name and email (password is handled)
export async function userSignUp(
  name: string, 
  email: string, 
  password: string
): Promise<{ user: any; profile: Database['public']['Tables']['users']['Row'] }> {
    const {data: authData, error: authError} = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name:name,
                display_name:name
            }
        }
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error("Error making the account");

    const {data: profileData, error: profileError} = await supabase
        .from('users')
        .insert({
            id: authData.user.id,
            name: name,
            email: email
        } as any)
        .select()
        .single();

    if (profileError) throw profileError;
    if (!profileData) throw new Error ("Error with profile data")

    return {user: authData.user, profile: profileData};
}

//get user info by id
export async function getUserInfo(id: string): Promise<Database['public']['Tables']['users']['Row']> {
    const {data: userData, error: userError} = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()
    
    if (userError) throw userError;
    if (!userData) throw new Error("Error with the user's data");

    return userData
}

//update user info by id
export async function updateUserInfo(id: string, field: 'name' | 'email', newValue: string): Promise<Database['public']['Tables']['users']['Row']> {
    const updatePayload: Database['public']['Tables']['users']['Update'] = 
        field === 'name' ? { name: newValue } : { email: newValue };
    
    const {data: userData, error: userError} = await supabase
        .from('users')
        // @ts-ignore - Supabase types limitation with dynamic field updates
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single()

    if (userError) throw userError;
    if (!userData) throw new Error("Error with the user's data");

    return userData
}

//remove user by id
// i don't think i need this
// export async function removeUserById(id: string) {
//     const { data: { user } } = await supabase.auth.getUser();
//     if (!user || user.id !== id) {
//         throw new Error('Unauthorized - can only delete your own profile');
//     }

//     const { error } = await supabase
//         .from('users')
//         .delete()
//         .eq('id', id);

//     if (error) throw error;
// }

