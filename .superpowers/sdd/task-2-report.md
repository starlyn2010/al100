Status: DONE
Commits: 21ab4d7 - feat: setup FastAPI + Clean Architecture foundation
Tests: Run `cd apps/api && source venv/bin/activate && python -c "from src.main import app; print('FastAPI app loaded OK')"` — FastAPI app loaded OK. Health endpoint `/health` registered. All domain entities, value objects, ports, schemas, and 7 API routers import cleanly.
