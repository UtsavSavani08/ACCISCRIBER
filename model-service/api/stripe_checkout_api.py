from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")  # Set your Stripe secret key in env

@router.post("/api/create-checkout-session")
async def create_checkout_session(request: Request):
    data = await request.json()
    price_id = data.get("priceId")
    user_id = data.get("userId")
    if not price_id:
        return JSONResponse({"error": "Missing priceId"}, status_code=400)
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{"price": price_id, "quantity": 1}],
            mode="payment",
            success_url="http://localhost:5173/pricing/pay/checkout/success",
            cancel_url="http://localhost:5173/pricing/pay/checkout/cancel",
            metadata={"user_id": user_id}
        )
        return JSONResponse({"sessionId": session.id})
    except Exception as e:
        print("Stripe error:", e)  # Debug print for backend logs
        return JSONResponse({"error": str(e)}, status_code=500)