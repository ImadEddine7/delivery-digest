export const requests = [
  {
    id: "req-001",
    ref: "REQ-001",
    title: "Senior React Developer",
    client: "Acme Corp",
    priority: "high",
    status: "qualification",
    createdAt: "2026-07-28T10:00:00.000Z",
    profiles: [
      { id: "p1", name: "Alice Martin", status: "presente", presentedAt: "2026-07-29T09:00:00.000Z", validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p2", name: "Bob Durand", status: "valide", presentedAt: "2026-07-28T14:00:00.000Z", validatedAt: "2026-07-30T11:00:00.000Z", refusedAt: null, refuseReason: "" },
      { id: "p3", name: "Claire Petit", status: "identifie", presentedAt: null, validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p4", name: "David Roux", status: "refuse", presentedAt: "2026-07-29T10:00:00.000Z", validatedAt: null, refusedAt: "2026-07-31T08:00:00.000Z", refuseReason: "Budget mismatch" },
    ],
    notes: "Client wants someone with Next.js + GraphQL experience",
    whozLink: "https://whoz.example.com/req-001"
  },
  {
    id: "req-002",
    ref: "REQ-002",
    title: "DevOps Engineer",
    client: "TechStart",
    priority: "medium",
    status: "besoin_emis",
    createdAt: "2026-07-30T08:30:00.000Z",
    profiles: [
      { id: "p5", name: "Eva Moreau", status: "identifie", presentedAt: null, validatedAt: null, refusedAt: null, refuseReason: "" },
    ],
    notes: "AWS + Kubernetes mandatory",
    whozLink: ""
  },
  {
    id: "req-003",
    ref: "REQ-003",
    title: "Data Analyst",
    client: "FinanceHub",
    priority: "high",
    status: "valide",
    createdAt: "2026-07-20T09:00:00.000Z",
    profiles: [
      { id: "p6", name: "François Leroy", status: "valide", presentedAt: "2026-07-21T10:00:00.000Z", validatedAt: "2026-07-25T16:00:00.000Z", refusedAt: null, refuseReason: "" },
      { id: "p7", name: "Gabrielle Noir", status: "refuse", presentedAt: "2026-07-22T09:00:00.000Z", validatedAt: null, refusedAt: "2026-07-24T14:00:00.000Z", refuseReason: "Overqualified" },
      { id: "p8", name: "Hugo Blanc", status: "valide", presentedAt: "2026-07-22T11:00:00.000Z", validatedAt: "2026-07-26T09:00:00.000Z", refusedAt: null, refuseReason: "" },
    ],
    notes: "",
    whozLink: "https://whoz.example.com/req-003"
  },
  {
    id: "req-004",
    ref: "REQ-004",
    title: "Fullstack Java/Angular",
    client: "BankSoft",
    priority: "high",
    status: "qualification",
    createdAt: "2026-07-25T14:00:00.000Z",
    profiles: [
      { id: "p9", name: "Isabelle Faure", status: "presente", presentedAt: "2026-07-27T09:00:00.000Z", validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p10", name: "Julien Masson", status: "presente", presentedAt: "2026-07-28T10:00:00.000Z", validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p11", name: "Karim Bensaid", status: "identifie", presentedAt: null, validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p12", name: "Laura Vidal", status: "identifie", presentedAt: null, validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p13", name: "Marc Dupont", status: "refuse", presentedAt: "2026-07-26T15:00:00.000Z", validatedAt: null, refusedAt: "2026-07-29T09:00:00.000Z", refuseReason: "Availability" },
    ],
    notes: "Urgent — client interview slots on Aug 5",
    whozLink: ""
  },
  {
    id: "req-005",
    ref: "REQ-005",
    title: "Scrum Master",
    client: "Acme Corp",
    priority: "low",
    status: "besoin_emis",
    createdAt: "2026-08-01T07:00:00.000Z",
    profiles: [],
    notes: "Low priority, start sourcing next week",
    whozLink: ""
  },
  {
    id: "req-006",
    ref: "REQ-006",
    title: "Cloud Architect",
    client: "GovTech",
    priority: "medium",
    status: "qualification",
    createdAt: "2026-07-22T11:00:00.000Z",
    profiles: [
      { id: "p14", name: "Nadia Cherif", status: "valide", presentedAt: "2026-07-24T09:00:00.000Z", validatedAt: "2026-07-28T10:00:00.000Z", refusedAt: null, refuseReason: "" },
      { id: "p15", name: "Olivier Garnier", status: "presente", presentedAt: "2026-07-25T14:00:00.000Z", validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p16", name: "Paul Richard", status: "identifie", presentedAt: null, validatedAt: null, refusedAt: null, refuseReason: "" },
    ],
    notes: "Security clearance required",
    whozLink: "https://whoz.example.com/req-006"
  },
  {
    id: "req-007",
    ref: "REQ-007",
    title: "UX Designer",
    client: "CreativeIO",
    priority: "medium",
    status: "annule",
    createdAt: "2026-07-15T09:00:00.000Z",
    profiles: [
      { id: "p17", name: "Quentin Roche", status: "refuse", presentedAt: "2026-07-17T10:00:00.000Z", validatedAt: null, refusedAt: "2026-07-19T11:00:00.000Z", refuseReason: "Position cancelled" },
    ],
    notes: "Client cancelled the project",
    whozLink: ""
  },
  {
    id: "req-008",
    ref: "REQ-008",
    title: "Python Backend Developer",
    client: "DataFlow",
    priority: "high",
    status: "qualification",
    createdAt: "2026-07-29T08:00:00.000Z",
    profiles: [
      { id: "p18", name: "Sophie Laurent", status: "presente", presentedAt: "2026-07-30T14:00:00.000Z", validatedAt: null, refusedAt: null, refuseReason: "" },
      { id: "p19", name: "Thomas Bernard", status: "identifie", presentedAt: null, validatedAt: null, refusedAt: null, refuseReason: "" },
    ],
    notes: "FastAPI + PostgreSQL stack",
    whozLink: "https://whoz.example.com/req-008"
  },
];
