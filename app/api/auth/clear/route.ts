import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  try {
    const cookieStore = await cookies();
    
    // Supprimer tous les cookies Supabase
    const allCookies = cookieStore.getAll();
    allCookies.forEach(cookie => {
      if (cookie.name.includes("supabase") || cookie.name.includes("auth")) {
        cookieStore.delete(cookie.name);
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error clearing cookies:", error);
    return NextResponse.json({ error: "Failed to clear cookies" }, { status: 500 });
  }
}

