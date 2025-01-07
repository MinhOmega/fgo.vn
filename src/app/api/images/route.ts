import { NextResponse } from "next/server";
import { getImages } from "@/app/actions/image";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const images = await getImages();
    return NextResponse.json(images);
  } catch (error) {
    console.error("Error in images API route:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
