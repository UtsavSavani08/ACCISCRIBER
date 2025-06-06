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
    "prod_SRpfMe6GLWvvZc": 100,  # Pro
    "prod_SRpgzAp44xasSv": 500,  # Business
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
        return JSONResponse({"error": str(e)}, status_code=400)

    # Handle successful payment
    if event["type"] == "checkout.session.completed":
        session = event["data"]["object"]
        customer_email = session.get("customer_email")
        price_id = session["display_items"][0]["price"]["id"] if "display_items" in session else session["line_items"]["data"][0]["price"]["id"]
        credits = PRICE_ID_TO_CREDITS.get(price_id, 0)

        # You must map customer_email to your user_id in your DB
        # Example: user = supabase.table("users").select("id").eq("email", customer_email).single().execute()
        # user_id = user.data["id"]

        # For demo, let's assume you have user_id in session metadata
        user_id = session.get("metadata", {}).get("user_id")
        if user_id and credits > 0:
            # Update user credits
            user_credits = supabase.table("user_credits").select("*").eq("id", user_id).single().execute()
            current_credits = user_credits.data["credits_remaining"]
            new_credits = current_credits + credits
            supabase.table("user_credits").update({"credits_remaining": new_credits}).eq("id", user_id).execute()
        # You may want to log or notify here

    return JSONResponse({"status": "success"})