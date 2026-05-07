import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const { phone, amount, cart } = body

    if (!phone || !amount) {
      return NextResponse.json(
        { error: "Missing checkout data" },
        { status: 400 }
      )
    }

    // Later this is where M-Pesa STK Push goes

    console.log("Checkout Request:", {
      phone,
      amount,
      cart,
    })

    return NextResponse.json({
      success: true,
      message: "Checkout initiated",
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}