/**
 * BHUSHAKTI AI — Live Disaster Simulation Engine
 * Stepped orchestration of monsoon deluges, ground fissures, critical alerts, and P1 task dispatch.
 */

export interface SimulationStep {
  stepNumber: number;
  title: string;
  description: string;
  simulatedRiskScore: number;
  triggerEvent: string;
}
