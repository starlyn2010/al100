from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from src.interface.api.main import api_router

app = FastAPI(title="AL100 API", description="Plataforma Inteligente de Recolección de Residuos", version="0.1.0")

app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

app.include_router(api_router)


@app.get("/health")
async def health():
    return {"status": "ok", "version": "0.1.0"}
