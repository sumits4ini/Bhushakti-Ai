-- =============================================================================
-- BHUSHAKTI AI — COMPREHENSIVE POSTGIS & DATABASE SCHEMA
-- Target: PostgreSQL 16 + PostGIS 3.4 (Supabase Compatible)
-- Problem Statement: SIH26001 (MDoNER - Disaster Management)
-- =============================================================================

-- Enable Required Spatial and Core Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";

-- -----------------------------------------------------------------------------
-- ENUM TYPES
-- -----------------------------------------------------------------------------
DO $$ BEGIN
    CREATE TYPE user_role_enum AS ENUM ('ADMIN', 'FIELD_OFFICER', 'CITIZEN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE risk_level_enum AS ENUM ('LOW', 'MODERATE', 'HIGH', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE report_type_enum AS ENUM (
        'CRACK', 'SLOPE_MOVEMENT', 'ROAD_BLOCKED', 
        'ROCKFALL', 'DEBRIS', 'EROSION', 'OTHER'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE report_status_enum AS ENUM (
        'PENDING_VERIFICATION', 'VERIFIED', 'ACTIONED', 'REJECTED'
    );
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_severity_enum AS ENUM ('INFO', 'WATCH', 'WARNING', 'CRITICAL');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE alert_status_enum AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'EXPIRED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE response_priority_enum AS ENUM ('P1', 'P2', 'P3', 'P4');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_status_enum AS ENUM ('PENDING_DISPATCH', 'DEPLOYED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE road_classification_enum AS ENUM ('NATIONAL_HIGHWAY', 'STATE_HIGHWAY', 'DISTRICT_ROAD', 'RURAL_ACCESS');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- -----------------------------------------------------------------------------
-- 1. USERS & PROFILES TABLE (Syncs with Supabase Auth)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(150) NOT NULL,
    role user_role_enum DEFAULT 'CITIZEN',
    phone VARCHAR(20),
    organization VARCHAR(150), -- e.g. 'Mizoram SDMA', 'SDRF 1st Bn', 'BRO Swastik'
    district_jurisdiction VARCHAR(100),
    badge_number VARCHAR(50),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- -----------------------------------------------------------------------------
-- 2. DISTRICTS TABLE (North Eastern Region)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    state_code VARCHAR(10) NOT NULL,
    center_point GEOMETRY(Point, 4326) NOT NULL,
    boundary GEOMETRY(MultiPolygon, 4326),
    vulnerability_index NUMERIC(5,2) DEFAULT 50.00,
    population_estimate INT DEFAULT 0,
    area_km2 NUMERIC(8,2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_districts_geom ON districts USING GIST(center_point);
CREATE INDEX IF NOT EXISTS idx_districts_state ON districts(state);

-- -----------------------------------------------------------------------------
-- 3. RISK ZONES TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS risk_zones (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    zone_code VARCHAR(50) UNIQUE NOT NULL,
    center_point GEOMETRY(Point, 4326) NOT NULL,
    boundary GEOMETRY(Polygon, 4326),
    current_risk_score NUMERIC(5,2) DEFAULT 0.00,
    current_risk_level risk_level_enum DEFAULT 'LOW',
    slope_angle_deg NUMERIC(4,1) NOT NULL,
    elevation_m NUMERIC(6,1) NOT NULL,
    soil_type VARCHAR(100),
    vegetation_cover VARCHAR(100),
    historical_event_count INT DEFAULT 0,
    primary_threat_corridor VARCHAR(150),
    last_evaluated_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_risk_zones_geom ON risk_zones USING GIST(center_point);
CREATE INDEX IF NOT EXISTS idx_risk_zones_district ON risk_zones(district_id);
CREATE INDEX IF NOT EXISTS idx_risk_zones_level ON risk_zones(current_risk_level);
CREATE INDEX IF NOT EXISTS idx_risk_zones_score ON risk_zones(current_risk_score DESC);

-- -----------------------------------------------------------------------------
-- 4. TERRAIN FEATURES TABLE (Geomorphological Attributes)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS terrain_features (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE CASCADE,
    slope_aspect VARCHAR(50), -- N, NE, E, SE, S, SW, W, NW
    curvature_profile VARCHAR(50), -- Concave, Convex, Planar
    lithology VARCHAR(150),
    drainage_density_km_per_km2 NUMERIC(5,2),
    distance_to_fault_m NUMERIC(8,2),
    distance_to_stream_m NUMERIC(8,2),
    soil_thickness_m NUMERIC(4,2),
    land_cover_type VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_terrain_features_zone ON terrain_features(risk_zone_id);

-- -----------------------------------------------------------------------------
-- 5. WEATHER OBSERVATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS weather_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE CASCADE,
    station_name VARCHAR(150) NOT NULL,
    rainfall_1h_mm NUMERIC(6,2) DEFAULT 0.00,
    rainfall_6h_mm NUMERIC(6,2) DEFAULT 0.00,
    rainfall_24h_mm NUMERIC(6,2) DEFAULT 0.00,
    rainfall_72h_mm NUMERIC(6,2) DEFAULT 0.00,
    temperature_c NUMERIC(4,1),
    humidity_pct NUMERIC(5,2),
    wind_speed_kmh NUMERIC(5,2),
    data_source VARCHAR(100) DEFAULT 'IMD_AUTOMATED_WEATHER_STATION',
    observed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_weather_zone_time ON weather_observations(risk_zone_id, observed_at DESC);
CREATE INDEX IF NOT EXISTS idx_weather_observed_at ON weather_observations(observed_at DESC);

-- -----------------------------------------------------------------------------
-- 6. SOIL MOISTURE OBSERVATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS soil_moisture_observations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE CASCADE,
    sensor_depth_cm INT DEFAULT 30,
    volumetric_water_content_pct NUMERIC(5,2) NOT NULL,
    pore_water_pressure_kpa NUMERIC(6,2),
    sensor_type VARCHAR(100) DEFAULT 'TDR_PROBE_TELEMETRY',
    satellite_inversion_score NUMERIC(4,3), -- ISRO MOSDAC inversion
    observed_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_soil_zone_time ON soil_moisture_observations(risk_zone_id, observed_at DESC);

-- -----------------------------------------------------------------------------
-- 7. HISTORICAL LANDSLIDES TABLE (Geological Survey Catalog)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS historical_landslides (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id),
    location_name VARCHAR(150) NOT NULL,
    location_point GEOMETRY(Point, 4326) NOT NULL,
    incident_date DATE NOT NULL,
    severity VARCHAR(50) DEFAULT 'MAJOR',
    fatalities INT DEFAULT 0,
    displaced_count INT DEFAULT 0,
    trigger_factor VARCHAR(150) DEFAULT 'HEAVY_MONSOON_DELUGE',
    infrastructure_damage TEXT,
    recorded_by VARCHAR(100) DEFAULT 'GSI_MDoNER'
);
CREATE INDEX IF NOT EXISTS idx_historical_landslides_geom ON historical_landslides USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_historical_landslides_date ON historical_landslides(incident_date DESC);

-- -----------------------------------------------------------------------------
-- 8. FIELD REPORTS TABLE (Ground Truth Crowd & Officer Submissions)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS field_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reporter_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    reporter_role user_role_enum DEFAULT 'CITIZEN',
    reporter_name VARCHAR(150) NOT NULL,
    reporter_phone VARCHAR(30),
    risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE SET NULL,
    district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
    district_name VARCHAR(100),
    location_point GEOMETRY(Point, 4326) NOT NULL,
    latitude NUMERIC(10,7) NOT NULL,
    longitude NUMERIC(10,7) NOT NULL,
    location_address TEXT,
    report_type report_type_enum NOT NULL,
    severity VARCHAR(30) DEFAULT 'HIGH',
    observed_cracks BOOLEAN DEFAULT FALSE,
    slope_movement_detected BOOLEAN DEFAULT FALSE,
    road_blocked BOOLEAN DEFAULT FALSE,
    road_blockage_degree VARCHAR(30) DEFAULT 'CLEAR',
    description TEXT NOT NULL,
    status report_status_enum DEFAULT 'PENDING_VERIFICATION',
    sync_status VARCHAR(20) DEFAULT 'SYNCED',
    verified_at TIMESTAMPTZ,
    verified_by VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_field_reports_geom ON field_reports USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_field_reports_status ON field_reports(status);
CREATE INDEX IF NOT EXISTS idx_field_reports_created ON field_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_field_reports_district ON field_reports(district_id);

-- -----------------------------------------------------------------------------
-- 9. FIELD REPORT MEDIA TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS field_report_media (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    field_report_id UUID REFERENCES field_reports(id) ON DELETE CASCADE,
    media_url TEXT NOT NULL,
    media_type VARCHAR(30) DEFAULT 'IMAGE',
    vision_analyzed BOOLEAN DEFAULT FALSE,
    vision_source VARCHAR(100) DEFAULT 'Prototype / Simulated Analysis',
    detected_indicators JSONB DEFAULT '[]'::jsonb,
    vision_severity VARCHAR(30),
    vision_confidence NUMERIC(4,3),
    vision_risk_contribution NUMERIC(5,2) DEFAULT 0.00,
    recommended_action TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_report_media_report ON field_report_media(field_report_id);

-- -----------------------------------------------------------------------------
-- 10. ROADS & LIFELINE CORRIDORS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS roads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    road_name VARCHAR(150) NOT NULL,
    code VARCHAR(50) NOT NULL,
    classification road_classification_enum NOT NULL,
    importance_weight NUMERIC(3,2) DEFAULT 1.0,
    length_km NUMERIC(6,2),
    is_blocked BOOLEAN DEFAULT FALSE,
    blockage_severity VARCHAR(30) DEFAULT 'NONE',
    blockage_reason TEXT,
    associated_risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE SET NULL,
    geometry GEOMETRY(LineString, 4326),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_roads_district ON roads(district_id);
CREATE INDEX IF NOT EXISTS idx_roads_blocked ON roads(is_blocked);

-- -----------------------------------------------------------------------------
-- 11. VILLAGES & SETTLEMENTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS villages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    location_point GEOMETRY(Point, 4326) NOT NULL,
    population INT NOT NULL DEFAULT 0,
    households INT DEFAULT 0,
    vulnerability_tier VARCHAR(30) DEFAULT 'HIGH',
    nearest_shelter_distance_km NUMERIC(5,2),
    contact_official_phone VARCHAR(30),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_villages_geom ON villages USING GIST(location_point);
CREATE INDEX IF NOT EXISTS idx_villages_district ON villages(district_id);

-- -----------------------------------------------------------------------------
-- 12. INFRASTRUCTURE ASSETS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS infrastructure (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    name VARCHAR(150) NOT NULL,
    category VARCHAR(100) NOT NULL, -- 'BRIDGE', 'POWER_SUBSTATION', 'TELECOM_TOWER', 'HOSPITAL', 'SHELTER'
    location_point GEOMETRY(Point, 4326) NOT NULL,
    vulnerability_rating VARCHAR(30) DEFAULT 'HIGH',
    status VARCHAR(50) DEFAULT 'OPERATIONAL',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_infrastructure_geom ON infrastructure USING GIST(location_point);

-- -----------------------------------------------------------------------------
-- 13. ALERTS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    district_id UUID REFERENCES districts(id) ON DELETE CASCADE,
    risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE SET NULL,
    district_name VARCHAR(100) NOT NULL,
    risk_zone_name VARCHAR(150),
    title VARCHAR(255) NOT NULL,
    severity alert_severity_enum NOT NULL,
    status alert_status_enum DEFAULT 'ACTIVE',
    risk_score NUMERIC(5,2) NOT NULL,
    risk_level risk_level_enum NOT NULL,
    location_point GEOMETRY(Point, 4326) NOT NULL,
    trigger_reason TEXT NOT NULL,
    affected_population_estimate INT DEFAULT 0,
    affected_roads JSONB DEFAULT '[]'::jsonb,
    recommended_actions JSONB DEFAULT '[]'::jsonb,
    response_priority response_priority_enum DEFAULT 'P1',
    issued_at TIMESTAMPTZ DEFAULT NOW(),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_by VARCHAR(150),
    resolved_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_alerts_status ON alerts(status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity);
CREATE INDEX IF NOT EXISTS idx_alerts_district ON alerts(district_id);
CREATE INDEX IF NOT EXISTS idx_alerts_issued_at ON alerts(issued_at DESC);

-- -----------------------------------------------------------------------------
-- 14. RESPONSE TASKS TABLE (Emergency Dispatch & Operations)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS response_tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    alert_id UUID REFERENCES alerts(id) ON DELETE SET NULL,
    risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE SET NULL,
    risk_zone_name VARCHAR(150),
    district_name VARCHAR(100) NOT NULL,
    title VARCHAR(255) NOT NULL,
    priority response_priority_enum NOT NULL DEFAULT 'P1',
    status task_status_enum DEFAULT 'PENDING_DISPATCH',
    action_type VARCHAR(100) NOT NULL,
    assigned_agency VARCHAR(150) NOT NULL,
    target_location GEOMETRY(Point, 4326) NOT NULL,
    location_description TEXT NOT NULL,
    description TEXT NOT NULL,
    allocated_personnel INT DEFAULT 0,
    equipment_required JSONB DEFAULT '[]'::jsonb,
    estimated_completion_time VARCHAR(150),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_response_tasks_priority ON response_tasks(priority);
CREATE INDEX IF NOT EXISTS idx_response_tasks_status ON response_tasks(status);
CREATE INDEX IF NOT EXISTS idx_response_tasks_created ON response_tasks(created_at DESC);

-- -----------------------------------------------------------------------------
-- 15. RISK PREDICTIONS & EXPLAINABILITY AUDIT LOG TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS risk_predictions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    risk_zone_id UUID REFERENCES risk_zones(id) ON DELETE CASCADE,
    calculated_risk_score NUMERIC(5,2) NOT NULL,
    risk_level risk_level_enum NOT NULL,
    confidence_score NUMERIC(4,3) NOT NULL,
    trend VARCHAR(30) DEFAULT 'STABLE',
    feature_contributions JSONB NOT NULL,
    forecast_curve JSONB NOT NULL,
    model_version VARCHAR(50) DEFAULT 'PROTOTYPE_FUSION_V1.0',
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_risk_pred_zone_time ON risk_predictions(risk_zone_id, evaluated_at DESC);

-- -----------------------------------------------------------------------------
-- 16. NOTIFICATIONS TABLE
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, read, created_at DESC);

-- -----------------------------------------------------------------------------
-- 17. AUDIT LOGS TABLE (Government Compliance & Incident Tracking)
-- -----------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    details JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(45),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_audit_logs_time ON audit_logs(created_at DESC);

-- =============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =============================================================================

-- Enable RLS across tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE terrain_features ENABLE ROW LEVEL SECURITY;
ALTER TABLE weather_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE soil_moisture_observations ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_landslides ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE field_report_media ENABLE ROW LEVEL SECURITY;
ALTER TABLE roads ENABLE ROW LEVEL SECURITY;
ALTER TABLE villages ENABLE ROW LEVEL SECURITY;
ALTER TABLE infrastructure ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE risk_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to extract user role from JWT / profiles
CREATE OR REPLACE FUNCTION get_current_user_role()
RETURNS user_role_enum AS $$
BEGIN
    RETURN (
        SELECT role FROM profiles WHERE id = auth.uid() LIMIT 1
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON profiles FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE USING (auth.uid() = id);

-- 2. Public Read Policies for Geospatial & Baseline Environmental Data
CREATE POLICY "Public Read: Districts" ON districts FOR SELECT USING (true);
CREATE POLICY "Public Read: Risk Zones" ON risk_zones FOR SELECT USING (true);
CREATE POLICY "Public Read: Terrain Features" ON terrain_features FOR SELECT USING (true);
CREATE POLICY "Public Read: Weather" ON weather_observations FOR SELECT USING (true);
CREATE POLICY "Public Read: Soil Moisture" ON soil_moisture_observations FOR SELECT USING (true);
CREATE POLICY "Public Read: Historical Landslides" ON historical_landslides FOR SELECT USING (true);
CREATE POLICY "Public Read: Roads" ON roads FOR SELECT USING (true);
CREATE POLICY "Public Read: Villages" ON villages FOR SELECT USING (true);
CREATE POLICY "Public Read: Infrastructure" ON infrastructure FOR SELECT USING (true);
CREATE POLICY "Public Read: Active Alerts" ON alerts FOR SELECT USING (true);
CREATE POLICY "Public Read: Predictions" ON risk_predictions FOR SELECT USING (true);

-- 3. Field Reports Policies
CREATE POLICY "Anyone can create field reports"
    ON field_reports FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read for verified or citizen's own field reports"
    ON field_reports FOR SELECT USING (
        status = 'VERIFIED' OR status = 'ACTIONED' OR auth.uid() = reporter_id OR get_current_user_role() IN ('ADMIN', 'FIELD_OFFICER')
    );

CREATE POLICY "Officers & Admins can update field reports"
    ON field_reports FOR UPDATE USING (
        get_current_user_role() IN ('ADMIN', 'FIELD_OFFICER')
    );

-- 4. Field Report Media Policies
CREATE POLICY "Anyone can insert report media"
    ON field_report_media FOR INSERT WITH CHECK (true);

CREATE POLICY "Public read report media"
    ON field_report_media FOR SELECT USING (true);

-- 5. Response Tasks Policies
CREATE POLICY "Officers & Admins can read response tasks"
    ON response_tasks FOR SELECT USING (
        get_current_user_role() IN ('ADMIN', 'FIELD_OFFICER')
    );

CREATE POLICY "Admins can insert/update response tasks"
    ON response_tasks FOR ALL USING (
        get_current_user_role() = 'ADMIN'
    );

CREATE POLICY "Field officers can update assigned task status"
    ON response_tasks FOR UPDATE USING (
        get_current_user_role() = 'FIELD_OFFICER'
    );

-- 6. Alerts Admin Write Policy
CREATE POLICY "Admins can manage alerts"
    ON alerts FOR ALL USING (
        get_current_user_role() = 'ADMIN'
    );

-- 7. Notifications User Read Policy
CREATE POLICY "Users can read own notifications"
    ON notifications FOR SELECT USING (
        auth.uid() = user_id
    );
