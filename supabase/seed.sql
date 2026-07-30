-- =====================================================
-- AL100 - Esquema Completo de Base de Datos
-- Copia y pega TODO esto en Supabase SQL Editor
-- =====================================================

-- Crear tablas
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE,
  name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('citizen', 'driver', 'admin')),
  code TEXT UNIQUE NOT NULL,
  phone TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS sectors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  geometry JSONB NOT NULL DEFAULT '{}',
  population_density FLOAT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS trucks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  plate TEXT,
  sector_id UUID REFERENCES sectors(id),
  driver_id UUID REFERENCES users(id),
  status TEXT DEFAULT 'available' CHECK (status IN ('available', 'on_route', 'maintenance')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS routes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  truck_id UUID REFERENCES trucks(id),
  driver_id UUID REFERENCES users(id),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'cancelled'))
);

CREATE TABLE IF NOT EXISTS gps_logs (
  id BIGSERIAL PRIMARY KEY,
  route_id UUID REFERENCES routes(id),
  latitude FLOAT NOT NULL,
  longitude FLOAT NOT NULL,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL CHECK (type IN ('blocked_road', 'breakdown', 'trash_spill', 'overflow', 'other')),
  description TEXT,
  photo_url TEXT,
  location JSONB,
  status TEXT DEFAULT 'reported' CHECK (status IN ('reported', 'in_progress', 'resolved')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS predictions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sector_id UUID REFERENCES sectors(id),
  date DATE NOT NULL,
  predicted_volume FLOAT NOT NULL,
  confidence FLOAT,
  recommendation TEXT,
  factors JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(sector_id, date)
);

CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_gps_route_time ON gps_logs(route_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_predictions_sector_date ON predictions(sector_id, date);
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_incidents_status ON incidents(status);

-- =====================================================
-- SEED DATA - Datos de demostración
-- =====================================================

-- Sectores
INSERT INTO sectors (id, name, geometry, population_density) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'Zona Colonial', '{"type":"Polygon","coordinates":[[[-69.895,18.48],[-69.880,18.48],[-69.880,18.49],[-69.895,18.49],[-69.895,18.48]]]}', 8500),
  ('a0000000-0000-0000-0000-000000000002', 'Piantini', '{"type":"Polygon","coordinates":[[[-69.925,18.47],[-69.910,18.47],[-69.910,18.48],[-69.925,18.48],[-69.925,18.47]]]}', 12000),
  ('a0000000-0000-0000-0000-000000000003', 'Los Prados', '{"type":"Polygon","coordinates":[[[-69.875,18.49],[-69.865,18.49],[-69.865,18.50],[-69.875,18.50],[-69.875,18.49]]]}', 6200),
  ('a0000000-0000-0000-0000-000000000004', 'Ensanche Ozama', '{"type":"Polygon","coordinates":[[[-69.905,18.455],[-69.895,18.455],[-69.895,18.465],[-69.905,18.465],[-69.905,18.455]]]}', 9500),
  ('a0000000-0000-0000-0000-000000000005', 'Villa Consuelo', '{"type":"Polygon","coordinates":[[[-69.890,18.50],[-69.880,18.50],[-69.880,18.51],[-69.890,18.51],[-69.890,18.50]]]}', 11000)
ON CONFLICT (id) DO NOTHING;

-- Usuarios
INSERT INTO users (id, name, role, code, email) VALUES
  ('b0000000-0000-0000-0000-000000000001', 'Admin AL100', 'admin', 'ADMIN', 'admin@al100.do'),
  ('b0000000-0000-0000-0000-000000000002', 'Carlos Martínez', 'driver', 'CHOFER01', 'carlos@al100.do'),
  ('b0000000-0000-0000-0000-000000000003', 'María Peña', 'driver', 'CHOFER02', 'maria@al100.do'),
  ('b0000000-0000-0000-0000-000000000004', 'Pedro Ramírez', 'driver', 'CHOFER03', 'pedro@al100.do'),
  ('b0000000-0000-0000-0000-000000000005', 'Ana López', 'driver', 'CHOFER04', 'ana@al100.do'),
  ('b0000000-0000-0000-0000-000000000006', 'Luis Fernández', 'driver', 'CHOFER05', 'luis@al100.do'),
  ('b0000000-0000-0000-0000-000000000007', 'Juan Pérez', 'citizen', 'CIUDADANO', 'juan@email.com')
ON CONFLICT (id) DO NOTHING;

-- Camiones
INSERT INTO trucks (id, name, plate, sector_id, driver_id, status) VALUES
  ('c0000000-0000-0000-0000-000000000001', 'Camión 1', 'ABC-123', 'a0000000-0000-0000-0000-000000000001', 'b0000000-0000-0000-0000-000000000002', 'available'),
  ('c0000000-0000-0000-0000-000000000002', 'Camión 2', 'DEF-456', 'a0000000-0000-0000-0000-000000000002', 'b0000000-0000-0000-0000-000000000003', 'available'),
  ('c0000000-0000-0000-0000-000000000003', 'Camión 3', 'GHI-789', 'a0000000-0000-0000-0000-000000000003', 'b0000000-0000-0000-0000-000000000004', 'available'),
  ('c0000000-0000-0000-0000-000000000004', 'Camión 4', 'JKL-012', 'a0000000-0000-0000-0000-000000000004', 'b0000000-0000-0000-0000-000000000005', 'available'),
  ('c0000000-0000-0000-0000-000000000005', 'Camión 5', 'MNO-345', 'a0000000-0000-0000-0000-000000000005', 'b0000000-0000-0000-0000-000000000006', 'available')
ON CONFLICT (id) DO NOTHING;

-- Predicciones de ejemplo
INSERT INTO predictions (sector_id, date, predicted_volume, confidence, recommendation, factors) VALUES
  ('a0000000-0000-0000-0000-000000000001', CURRENT_DATE, 3840, 0.91, 'extra_truck', '{"base":1.0,"sector_type":1.2,"holiday":1.0,"weekend":1.0,"weather":1.0,"total":1.2}'),
  ('a0000000-0000-0000-0000-000000000002', CURRENT_DATE, 7200, 0.85, 'increase_frequency', '{"base":1.0,"sector_type":1.5,"holiday":1.0,"weekend":1.0,"weather":1.0,"total":1.5}'),
  ('a0000000-0000-0000-0000-000000000003', CURRENT_DATE, 2100, 0.95, 'maintain', '{"base":1.0,"sector_type":1.0,"holiday":1.0,"weekend":1.0,"weather":1.0,"total":1.0}')
ON CONFLICT (sector_id, date) DO NOTHING;

-- Habilitar Realtime para tabla gps_logs (para tracking GPS en vivo)
ALTER PUBLICATION supabase_realtime ADD TABLE gps_logs;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
