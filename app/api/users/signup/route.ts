import connectMongo from "@/database/conn";
import User from "@/models/userSchema";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";


connectMongo()

export async function POST(request: NextRequest) {
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;

    /* const user = await User.findOne({ email });

    if (user) {
      return NextResponse.json({ error: "User already exist" }, { status: 400 });
    } */
    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    console.log(reqBody);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    return NextResponse.json({ message: "User Created" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/* export async function POST(request) {
  try {
    const reqBody = await request.json;
    const { username, email, password } = reqBody;

    console.log(reqBody);

    const user = await User.findOne({ email });

    if (user) {
      return Response.json({ error: "User already exist" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(passsword, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });
    const savedUser = await newUser.save();
    console.log(savedUser);

    return Response.json({ message: "User Created", success: true, savedUser });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
} */
