from fastapi import APIRouter, HTTPException
from datetime import datetime, timedelta
import math

router = APIRouter(prefix="/api/predictions", tags=["predictions"])

SECTORS = {
    "zona-colonial": {"name": "Zona Colonial", "base_volume": 3200, "type": "mixed"},
    "piantini": {"name": "Piantini", "base_volume": 4800, "type": "commercial"},
    "los-prados": {"name": "Los Prados", "base_volume": 2100, "type": "residential"},
    "ensanche-ozama": {"name": "Ensanche Ozama", "base_volume": 2800, "type": "residential"},
    "villa-consuelo": {"name": "Villa Consuelo", "base_volume": 3500, "type": "mixed"},
}

HOLIDAYS_2026 = [
    "2026-01-01", "2026-01-06", "2026-02-27", "2026-04-03",
    "2026-04-05", "2026-05-01", "2026-06-11", "2026-08-16",
    "2026-09-24", "2026-11-06", "2026-12-24", "2026-12-25", "2026-12-31",
]


def get_multipliers(date_str: str, sector_type: str) -> dict:
    try:
        date = datetime.strptime(date_str, "%Y-%m-%d")
    except ValueError:
        date = datetime.utcnow()

    multipliers = {"base": 1.0}

    if date_str in HOLIDAYS_2026:
        multipliers["holiday"] = 1.4
    else:
        multipliers["holiday"] = 1.0

    weekday = date.weekday()
    if weekday >= 5:
        multipliers["weekend"] = 1.25 if sector_type == "residential" else 1.1
    else:
        multipliers["weekend"] = 1.0

    if sector_type == "commercial":
        multipliers["sector_type"] = 1.5
    elif sector_type == "mixed":
        multipliers["sector_type"] = 1.2
    else:
        multipliers["sector_type"] = 1.0

    # Simulated weather
    multipliers["weather"] = 1.0

    total = 1.0
    for k, v in multipliers.items():
        if k != "base":
            total *= v

    return {"multipliers": multipliers, "total": round(total, 2)}


@router.get("/{sector_id}")
async def get_prediction(sector_id: str, date: str = None):
    if sector_id not in SECTORS:
        raise HTTPException(status_code=404, detail="Sector not found")

    sector = SECTORS[sector_id]
    date = date or datetime.utcnow().strftime("%Y-%m-%d")

    result = get_multipliers(date, sector["type"])
    predicted_volume = round(sector["base_volume"] * result["total"], 1)

    if result["total"] > 1.3:
        recommendation = "increase_frequency"
    elif result["total"] < 0.85:
        recommendation = "decrease_frequency"
    elif result["total"] > 1.1:
        recommendation = "extra_truck"
    else:
        recommendation = "maintain"

    return {
        "sector_id": sector_id,
        "sector_name": sector["name"],
        "date": date,
        "base_volume": sector["base_volume"],
        "predicted_volume": predicted_volume,
        "confidence": round(0.75 + (1.0 - abs(result["total"] - 1.0)) * 0.2, 2),
        "recommendation": recommendation,
        "factors": result["multipliers"],
        "total_multiplier": result["total"],
    }


@router.get("/next/{sector_id}")
async def get_next_prediction(sector_id: str):
    if sector_id not in SECTORS:
        raise HTTPException(status_code=404, detail="Sector not found")

    tomorrow = (datetime.utcnow() + timedelta(days=1)).strftime("%Y-%m-%d")
    return await get_prediction(sector_id, tomorrow)
