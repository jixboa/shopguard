import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = NextResponse.json({
      message: "Logout successful",
      success: true,
    });
    response.headers.set("Cache-Control", "no-store");

    response.cookies.set("token", "", {
      httpOnly: true,
      expires: new Date("Thu, 01 Jan 1970 00:00:00 GMT"),
    });
    console.log("Cookie removed");
    return response;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
