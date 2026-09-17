export type WorkspaceView =
  | "welcome"
  | "session"
  | "upload"
  | "processing"
  | "document"
  | "knowledge"
  | "skills"
  | "settings";

export const recentItems = [
  "Manufacturing Skills Report",
  "OFO Framework",
  "Automation Skills Review",
  "Sector Skills Plan",
];

export const skills = [
  { name: "Industrial Automation", confidence: 94, evidence: "Page 17 · Section 4.2" },
  { name: "PLC Programming", confidence: 91, evidence: "Page 19 · Section 4.4" },
  { name: "Systems Integration", confidence: 88, evidence: "Page 23 · Section 5.1" },
  { name: "Predictive Maintenance", confidence: 82, evidence: "Page 28 · Section 6.3" },
];

export const occupations = [
  "Industrial Automation Technician",
  "Systems Engineer",
  "Reliability Specialist",
  "Maintenance Technician",
  "Process Engineer",
];
