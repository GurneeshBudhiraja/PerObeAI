from fastapi import APIRouter, HTTPException


router = APIRouter(
  prefix="/gemini",
  tags=["gemini"]
)

@router.get("/")
async def gemini():
  return {"Hello": "gemini"}