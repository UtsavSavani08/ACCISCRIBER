from fastapi import APIRouter, Request, Header
from fastapi.responses import JSONResponse
import stripe
import os

router = APIRouter()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")  # Set this in your env

# Import your Supabase client
from .audio_api import supabase

# Map Stripe price IDs to credit amounts
PRICE_ID_TO_CREDITS = {
    "price_1RWw07P8RkSepureHFCrNwwx": 100,  # Pro
    "price_1RWw1FP8RkSepureKFkg4mN6": 500,  # Business
}

@router.post("/api/stripe/webhook")
async def stripe_webhook(request: Request, stripe_signature: str = Header(None)):
    payload = await request.body()
    sig_header = stripe_signature or request.headers.get("stripe-signature")
    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, STRIPE_WEBHOOK_SECRET
        )
    except Exception as e:
        print("Stripe webhook signature error:", e)
        return JSONResponse({"error": str(e)}, status_code=400)

    print("Stripe webhook received:", event["type"])

    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        if "line_items" not in session:
            session = stripe.checkout.Session.retrieve(
                session["id"], expand=["line_items"]
            )
        price_id = session["line_items"]["data"][0]["price"]["id"]
        credits = PRICE_ID_TO_CREDITS.get(price_id, 0)
        print("Price ID:", price_id, "Credits:", credits)

        user_id = session.get("metadata", {}).get("user_id")
        print("Session metadata:", session.get("metadata"))
        if user_id and credits > 0:
            try:
                user_credits = supabase.table("user_credits").select("*").eq("id", user_id).single().execute()
                current_credits = user_credits.data["credits_remaining"]
                new_credits = current_credits + credits
                supabase.table("user_credits").update({"credits_remaining": new_credits}).eq("id", user_id).execute()
                print(f"Credited {credits} to user {user_id}. New credits: {new_credits}")
            except Exception as e:
                print("Supabase update error:", e)

    return JSONResponse({"status": "success"})