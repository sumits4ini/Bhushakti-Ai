import { NextRequest, NextResponse } from "next/server";
import { riskEngine } from "@/lib/ai/riskEngine";
import { EnvironmentalFeatures } from "@/types/riskEngine";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const features: EnvironmentalFeatures = {
      rainfall_1h: Number(body.rainfall_1h ?? 0),
      rainfall_6h: Number(body.rainfall_6h ?? 0),
      rainfall_24h: Number(body.rainfall_24h ?? 0),
      rainfall_72h: Number(body.rainfall_72h ?? 0),
      soil_moisture: Number(body.soil_moisture ?? 50),
      slope: Number(body.slope ?? 30),
      elevation: Number(body.elevation ?? 800),
      land_cover: body.land_cover || "DEGRADED_SCRUB",
      historical_event_density: Number(body.historical_event_density ?? 3),
      distance_to_road: Number(body.distance_to_road ?? 100),
      satellite_change_score: Number(body.satellite_change_score ?? 0.2),
      field_report_score: Number(body.field_report_score ?? 0),
    };

    const evaluation = riskEngine.predict(features);

    return NextResponse.json({
      success: true,
      data: evaluation,
    });
  } catch (err: unknown) {
    return NextResponse.json(
      {
        success: false,
        error: err instanceof Error ? err.message : "Failed to evaluate landslide hazard index",
      },
      { status: 400 }
    );
  }
}
