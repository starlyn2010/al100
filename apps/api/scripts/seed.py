"""
Seed script for AL100 - creates demo data.
Run: python scripts/seed.py
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent.parent / "src"))

SECTORS = [
    {"id": "S-001", "name": "Zona Colonial", "type": "mixed", "lat": 18.486, "lng": -69.889},
    {"id": "S-002", "name": "Piantini", "type": "commercial", "lat": 18.475, "lng": -69.920},
    {"id": "S-003", "name": "Los Prados", "type": "residential", "lat": 18.495, "lng": -69.870},
    {"id": "S-004", "name": "Ensanche Ozama", "type": "residential", "lat": 18.460, "lng": -69.900},
    {"id": "S-005", "name": "Villa Consuelo", "type": "mixed", "lat": 18.505, "lng": -69.885},
]

TRUCKS = [
    {"id": "CAM-001", "name": "Camión 1", "plate": "ABC-123", "sector_id": "S-001"},
    {"id": "CAM-002", "name": "Camión 2", "plate": "DEF-456", "sector_id": "S-002"},
    {"id": "CAM-003", "name": "Camión 3", "plate": "GHI-789", "sector_id": "S-003"},
    {"id": "CAM-004", "name": "Camión 4", "plate": "JKL-012", "sector_id": "S-004"},
    {"id": "CAM-005", "name": "Camión 5", "plate": "MNO-345", "sector_id": "S-005"},
]

USERS = [
    {"name": "Admin AL100", "role": "admin", "code": "ADMIN", "email": "admin@al100.do"},
    {"name": "Carlos Martínez", "role": "driver", "code": "CHOFER01", "email": "carlos@al100.do"},
    {"name": "María Peña", "role": "driver", "code": "CHOFER02", "email": "maria@al100.do"},
    {"name": "Pedro Ramírez", "role": "driver", "code": "CHOFER03", "email": "pedro@al100.do"},
    {"name": "Ana López", "role": "driver", "code": "CHOFER04", "email": "ana@al100.do"},
    {"name": "Luis Fernández", "role": "driver", "code": "CHOFER05", "email": "luis@al100.do"},
    {"name": "Juan Pérez", "role": "citizen", "code": "CIUDADANO", "email": "juan@email.com"},
]

PREDICTIONS = [
    {"sector_id": "S-001", "date": "2026-07-30", "volume": 3680, "recommendation": "maintain"},
    {"sector_id": "S-002", "date": "2026-07-30", "volume": 6720, "recommendation": "increase_frequency"},
    {"sector_id": "S-003", "date": "2026-07-30", "volume": 1932, "recommendation": "maintain"},
    {"sector_id": "S-004", "date": "2026-07-30", "volume": 3080, "recommendation": "maintain"},
    {"sector_id": "S-005", "date": "2026-07-30", "volume": 3850, "recommendation": "extra_truck"},
]

def main():
    print("=== AL100 Seed Data ===\n")
    
    print("Sectores:")
    for s in SECTORS:
        print(f"  {s['id']}: {s['name']} ({s['type']})")
    
    print("\nCamiones:")
    for t in TRUCKS:
        print(f"  {t['id']}: {t['name']} ({t['plate']})")
    
    print("\nUsuarios:")
    for u in USERS:
        print(f"  {u['code']}: {u['name']} ({u['role']})")
    
    print("\nPredicciones IA:")
    for p in PREDICTIONS:
        print(f"  {p['sector_id']}: {p['volume']}kg → {p['recommendation']}")
    
    print(f"\nTotal: {len(SECTORS)} sectores, {len(TRUCKS)} camiones, {len(USERS)} usuarios")
    print("\n✅ Seed data ready to import to Supabase")

if __name__ == "__main__":
    main()
