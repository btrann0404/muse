// need to migrate auth to clerk
import { auth, currentUser } from "@clerk/nextjs/server";
import { supabase } from "./supabase";
import { Database } from "@/types/database";
