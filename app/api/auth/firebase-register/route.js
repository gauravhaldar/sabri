import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { uid, email, firstName, lastName, phone } = await request.json();

    if (!uid || !email || !firstName || !lastName) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Verify the Firebase user with your backend
    // 2. Create user in your database
    // 3. Generate JWT token
    // 4. Return user data and token

    // For now, we'll create a mock response
    const user = {
      id: uid,
      email: email,
      firstName: firstName,
      lastName: lastName,
      name: `${firstName} ${lastName}`,
      phone: phone,
      avatar: null,
      createdAt: new Date().toISOString(),
    };

    const token = `firebase_token_${uid}_${Date.now()}`;

    return NextResponse.json({
      success: true,
      data: {
        user,
        token,
      },
    });
  } catch (error) {
    console.error("Firebase registration error:", error);
    return NextResponse.json(
      { success: false, message: "Registration failed" },
      { status: 500 }
    );
  }
}
