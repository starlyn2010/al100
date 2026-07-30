from fastapi import APIRouter

from src.interface.api.routes.auth import router as auth_router
from src.interface.api.routes.routes import router as routes_router
from src.interface.api.routes.trucks import router as trucks_router
from src.interface.api.routes.sectors import router as sectors_router
from src.interface.api.routes.incidents import router as incidents_router
from src.interface.api.routes.predictions import router as predictions_router
from src.interface.api.routes.admin import router as admin_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(routes_router)
api_router.include_router(trucks_router)
api_router.include_router(sectors_router)
api_router.include_router(incidents_router)
api_router.include_router(predictions_router)
api_router.include_router(admin_router)
