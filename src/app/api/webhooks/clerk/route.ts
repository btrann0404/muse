import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing CLERK_WEBHOOK_SECRET");
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    console.error("Missing svix headers");
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("❌ Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  const eventType = evt.type;
  console.log(`Webhook received: ${eventType}`);

  if (!supabaseAdmin) {
    console.error("Missing SUPABASE_SERVICE_ROLE_KEY in env");
    return new Response("Server Error: Missing SUPABASE_SERVICE_ROLE_KEY", {
      status: 500,
    });
  }

  // HANDLE USER CREATED
  if (eventType === "user.created") {
    const { id, email_addresses, first_name, username } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = first_name || username || "User";

    console.log(`Creating/Updating User: ${id}, Email: ${email}`);

    const { error } = await supabaseAdmin
      .from("users")
      .upsert({ id: id, email: email || "", name: name } as any);

    if (error) {
      console.error("Supabase Insert Error:", error);
      return new Response("Error syncing to database", { status: 500 });
    }
    console.log("Supabase Insert Success");
  }

  // HANDLE USER DELETED
  if (eventType === "user.deleted") {
    const { id } = evt.data;

    if (!id) {
      console.log("No user ID in delete event");
      return new Response("No user ID", { status: 200 });
    }

    console.log(`Deleting User: ${id}`);

    const { error } = await supabaseAdmin.from("users").delete().eq("id", id);

    if (error) {
      console.error("Supabase Delete Error:", error);
      return new Response("Error deleting from database", { status: 500 });
    }
    console.log("Supabase Delete Success");
  }

  // HANDLE USER UPDATED (Optional but good practice)
  if (eventType === "user.updated") {
    const { id, email_addresses, first_name, username } = evt.data;
    const email = email_addresses[0]?.email_address;
    const name = first_name || username || "User";

    console.log(`Updating User: ${id}`);

    const { error } = await supabaseAdmin
      .from("users")
      // @ts-ignore
      .update({ email: email || "", name: name })
      .eq("id", id);

    if (error) {
      console.error("Supabase Update Error:", error);
      // Don't fail the webhook for update errors, just log it
    } else {
      console.log("Supabase Update Success");
    }
  }

  return new Response("Webhook received", { status: 200 });
}
