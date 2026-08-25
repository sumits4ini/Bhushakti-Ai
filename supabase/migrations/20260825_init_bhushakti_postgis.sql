-- BHUSHAKTI AI — Initial PostGIS Spatial Migration
-- Target Engine: PostgreSQL 16 + PostGIS 3.4 (Supabase Compatible)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- 1. Districts Table
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    center_point GEOMETRY(Point, 4326) NOT NULL,
    vulnerability_index NUMERIC(4,2) DEFAULT 50.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_districts_geom ON districts USING GIST(center_point);

-- 2. Risk Zones Table
DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS risk_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    zone_code VARCHAR(50) UNIQUE NOT NULL,
    center_point GEOMETRY(Point, 4326) NOT NULL,
    current_risk_score NUMERIC(5,2) DEFAULT 0.00,
    current_risk_level risk_level_enum DEFAULT 'LOW',
    slope_angle_deg NUMERIC(4,1) NOT NULL,
    elevation_m NUMERIC(6,1) NOT NULL,
    soil_type VARCHAR(100),
    vegetation_cover VARCHAR(100),
    historical_event_count INT DEFAULT 0,
    last_evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_risk_zones_geom ON risk_zones USING GIST(center_point);
CREATE INDEX IF NOT EXISTS idx_risk_zones_district ON risk_zones(district_id);
