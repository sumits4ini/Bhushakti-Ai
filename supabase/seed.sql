-- =============================================================================
-- BHUSHAKTI AI — SEED DATA (North Eastern Region Geospatial Baseline)
-- =============================================================================

-- 1. Insert Initial Districts
INSERT INTO districts (id, name, state, state_code, center_point, vulnerability_index, population_estimate, area_km2)
VALUES 
    ('d1111111-1111-1111-1111-111111111111', 'Aizawl', 'Mizoram', 'MZ', ST_SetSRID(ST_Point(92.7176, 23.7271), 4326), 88.0, 400309, 3576),
    ('d2222222-2222-2222-2222-222222222222', 'East Khasi Hills (Shillong)', 'Meghalaya', 'ML', ST_SetSRID(ST_Point(91.8933, 25.5788), 4326), 79.0, 825922, 2748),
    ('d3333333-3333-3333-3333-333333333333', 'Gangtok (East Sikkim)', 'Sikkim', 'SK', ST_SetSRID(ST_Point(88.6065, 27.3389), 4326), 92.0, 283583, 954),
    ('d4444444-4444-4444-4444-444444444444', 'Kamrup Metropolitan (Guwahati)', 'Assam', 'AS', ST_SetSRID(ST_Point(91.7362, 26.1445), 4326), 64.0, 1253938, 1528),
    ('d5555555-5555-5555-5555-555555555555', 'Kohima', 'Nagaland', 'NL', ST_SetSRID(ST_Point(94.1086, 25.6751), 4326), 82.0, 267988, 1463),
    ('d6666666-6666-6666-6666-666666666666', 'Papum Pare (Itanagar)', 'Arunachal Pradesh', 'AR', ST_SetSRID(ST_Point(93.6053, 27.0844), 4326), 76.0, 176573, 2875),
    ('d7777777-7777-7777-7777-777777777777', 'Imphal West', 'Manipur', 'MN', ST_SetSRID(ST_Point(93.9368, 24.8170), 4326), 68.0, 517992, 558),
    ('d8888888-8888-8888-8888-888888888888', 'West Tripura (Agartala)', 'Tripura', 'TR', ST_SetSRID(ST_Point(91.2868, 23.8315), 4326), 52.0, 918200, 983)
ON CONFLICT (id) DO NOTHING;

-- 2. Insert Core Risk Zones
INSERT INTO risk_zones (id, district_id, name, zone_code, center_point, current_risk_score, current_risk_level, slope_angle_deg, elevation_m, soil_type, vegetation_cover, historical_event_count, primary_threat_corridor)
VALUES
    ('z1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Hunthar Veng Slope Corridor', 'MZ-AZL-01', ST_SetSRID(ST_Point(92.7092, 23.7385), 4326), 87.0, 'CRITICAL', 38.5, 1132, 'Silty Clay with weathered shale', 'Sparse degraded scrub', 8, 'NH-54 (Silchar-Aizawl Highway)'),
    ('z2222222-2222-2222-2222-222222222222', 'd1111111-1111-1111-1111-111111111111', 'Laipuitlang Ridge', 'MZ-AZL-02', ST_SetSRID(ST_Point(92.7231, 23.7428), 4326), 78.0, 'CRITICAL', 42.0, 1210, 'Friable sandstone & siltstone', 'Dense residential surcharge', 6, 'Bawngkawn-Durtlang Arterial Road'),
    ('z3333333-3333-3333-3333-333333333333', 'd2222222-2222-2222-2222-222222222222', 'Sohra-Shella Escarpment', 'ML-EKH-03', ST_SetSRID(ST_Point(91.7324, 25.2892), 4326), 68.0, 'HIGH', 35.0, 1480, 'Karstic limestone & laterite', 'Subtropical pine & shrubs', 11, 'SH-5 Shillong-Cherrapunjee Road'),
    ('z4444444-4444-4444-4444-444444444444', 'd3333333-3333-3333-3333-333333333333', '29th Mile / Likhuphir Slip Zone', 'SK-EAS-04', ST_SetSRID(ST_Point(88.5238, 27.2144), 4326), 92.0, 'CRITICAL', 44.0, 920, 'Schist & Gneiss overburden', 'Terraced slopes & road cut', 14, 'NH-10 (Siliguri-Gangtok Lifeline)'),
    ('z5555555-5555-5555-5555-555555555555', 'd5555555-5555-5555-5555-555555555555', 'Phesama-Zubza Bypass Surcharge', 'NL-KHM-05', ST_SetSRID(ST_Point(94.0894, 25.6421), 4326), 62.0, 'HIGH', 33.0, 1440, 'Disruptive Disang shale', 'Bamboo and secondary forest', 5, 'NH-29 Kohima-Dimapur Highway')
ON CONFLICT (zone_code) DO NOTHING;

-- 3. Insert Historical Landslides
INSERT INTO historical_landslides (id, district_id, location_name, location_point, incident_date, severity, fatalities, displaced_count, trigger_factor, infrastructure_damage)
VALUES
    ('h1111111-1111-1111-1111-111111111111', 'd1111111-1111-1111-1111-111111111111', 'Laipuitlang Sinking Ridge', ST_SetSRID(ST_Point(92.7231, 23.7428), 4326), '2013-05-11', 'CATASTROPHIC', 17, 240, '72h continuous pre-monsoon squall + unengineered building slope load', '11 multi-storey buildings collapsed; PWD link severed'),
    ('h2222222-2222-2222-2222-222222222222', 'd3333333-3333-3333-3333-333333333333', '29th Mile National Highway 10', ST_SetSRID(ST_Point(88.5238, 27.2144), 4326), '2023-10-04', 'CATASTROPHIC', 22, 1500, 'Teesta basin flash flood + saturated schist toe washout', '1.2 km of NH-10 highway washed into river basin; bridge destroyed')
ON CONFLICT (id) DO NOTHING;
