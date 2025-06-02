from fastapi import APIRouter
from supabase import create_client
import os
from dotenv import load_dotenv

load_dotenv()

router = APIRouter()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

@router.get("/stats")
def get_stats():
    # Count total uploads
    uploads_response = supabase.table("uploads").select("*", count="exact").execute()
    file_count = uploads_response.count or 0

    # Count unique active users (based on user_id in uploads table)
    unique_users = set()
    if uploads_response.data:
        for row in uploads_response.data:
            unique_users.add(row["user_id"])
    
    return {
        "files_transcribed": file_count,
        "active_users": len(unique_users)
    }
