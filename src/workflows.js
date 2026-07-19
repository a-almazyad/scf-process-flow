import { IconBuildingFactory2, IconCurrencyRiyal, IconReceipt } from "@tabler/icons-react";

const palette = {
  blue: { color: "#3476d9", soft: "#f3f7fd" },
  purple: { color: "#bd3bd2", soft: "#fcf5fd" },
  green: { color: "#2ea65c", soft: "#f2faf5" },
  orange: { color: "#ce861b", soft: "#fff9ef" },
  gray: { color: "#767b82", soft: "#f7f7f8" },
  teal: { color: "#008b8f", soft: "#f0faf9" },
  yellow: { color: "#d9cd19", soft: "#fffef1" },
};

const lane = (id, label, icon, paletteKey, y, width, height) => ({
  id,
  type: "lane",
  position: { x: 24, y },
  data: { label, icon, ...palette[paletteKey] },
  style: { width, height, zIndex: -1 },
  selectable: false,
  focusable: false,
});

const task = (id, parentId, label, icon, kind, x, y, owner, color, description, note, options = {}) => ({
  id,
  type: "task",
  parentId,
  extent: "parent",
  position: { x, y },
  data: { label, icon, kind, owner, color, description, note, ...options },
  style: { width: kind === "start" || kind === "end" || kind === "event" ? 132 : kind === "gateway" ? 106 : 168 },
});

const edge = (id, source, target, options = {}) => ({
  id,
  source,
  target,
  sourceHandle: options.sourceHandle || "out-right",
  targetHandle: options.targetHandle || "in-left",
  label: options.label,
  data: { kind: options.kind || "sequence" },
  zIndex: 4,
});

const message = (id, source, target, label, direction = "down") => edge(id, source, target, {
  kind: "message",
  label,
  sourceHandle: direction === "up" ? "out-top" : direction === "left" ? "out-left" : "out-bottom",
  targetHandle: direction === "up" ? "in-bottom" : direction === "left" ? "in-right" : "in-top",
});

const onboardingNodes = [
  lane("on-lane-buyer", "Buyer", "user", "blue", 20, 1360, 118),
  lane("on-lane-taulia-system", "Taulia System", "cpu", "purple", 152, 1360, 118),
  lane("on-lane-supplier", "Supplier", "user", "green", 284, 1360, 122),
  lane("on-lane-manafa-team", "Manafa Team", "users", "orange", 420, 1360, 122),
  lane("on-lane-operations", "Operations Team", "shield", "gray", 556, 1360, 118),
  lane("on-lane-taulia-team", "Taulia Team", "users", "purple", 688, 1360, 118),
  lane("on-lane-manafa-system", "Manafa System", "cpu", "teal", 820, 1360, 118),
  lane("on-lane-funders", "Funders", "bank", "yellow", 952, 1360, 118),

  task("on-start", "on-lane-buyer", "Program start", "check", "start", 92, 30, "Buyer", palette.blue.color, "The buyer launches the supplier onboarding program."),
  task("on-invite", "on-lane-buyer", "Invite suppliers", "userPlus", "activity", 285, 22, "Buyer", palette.blue.color, "Buyer selects and invites eligible suppliers."),
  task("on-invitation-sent", "on-lane-buyer", "Invitation sent", "mail", "event", 520, 30, "Buyer", palette.blue.color, "The buyer-side invitation has been issued."),

  task("on-send-email", "on-lane-taulia-system", "Send invitation email", "send", "activity", 330, 20, "Taulia System", "#d94f55", "Taulia sends the supplier registration invitation.", undefined, { challenge: "Taulia-controlled invitation" }),
  task("on-registration-sent", "on-lane-taulia-system", "Registration email sent", "mail", "event", 560, 29, "Taulia System", "#d94f55", "The supplier receives the registration link."),

  task("on-register-taulia", "on-lane-supplier", "Register on Taulia", "file", "activity", 560, 21, "Supplier", "#d94f55", "Supplier completes the first of two registrations.", undefined, { challenge: "First registration" }),
  task("on-register-manafa", "on-lane-supplier", "Register on Manafa", "userPlus", "activity", 760, 21, "Supplier", palette.green.color, "Supplier must register again in Manafa, creating a conversion drop-off risk.", undefined, { challenge: "Second registration · drop-off risk" }),
  task("on-company-info", "on-lane-supplier", "Attach company info", "file", "activity", 950, 21, "Supplier", palette.green.color, "Upload company information within the Manafa platform.", "Within Manafa platform"),
  task("on-sign-agreements", "on-lane-supplier", "Sign legal agreements", "file", "activity", 1145, 21, "Supplier", palette.green.color, "Supplier signs the FC and AOPF legal agreements.", "FC · AOPF"),

  task("on-follow-registration", "on-lane-manafa-team", "Follow up registration", "users", "activity", 560, 22, "Manafa Team", "#d94f55", "Manafa manually follows up until registration is completed.", undefined, { challenge: "Manual recovery effort" }),
  task("on-follow-taulia", "on-lane-manafa-team", "Coordinate Taulia activation", "route", "activity", 1145, 22, "Manafa Team", "#d94f55", "Manafa manually coordinates with Taulia to activate Cash Flow.", "Cash Flow activation", { challenge: "Manual activation dependency" }),

  task("on-kyc", "on-lane-operations", "Perform KYC", "shield", "activity", 950, 20, "Operations Team", palette.gray.color, "Perform KYC checks and validate authorizations.", "Validate authorizations"),
  task("on-compliance", "on-lane-operations", "Compliance review", "check", "activity", 1145, 20, "Operations Team", palette.gray.color, "Operations completes the compliance review."),

  task("on-activate-invoices", "on-lane-taulia-team", "Activate invoice submission", "check", "activity", 1145, 20, "Taulia Team", "#d94f55", "Taulia enables invoice submission for the supplier."),
  task("on-send-funders", "on-lane-manafa-system", "Send registration to funders", "send", "activity", 1145, 20, "Manafa System", palette.teal.color, "Manafa sends the completed supplier registration to funders."),
  task("on-receive-registration", "on-lane-funders", "Receive supplier registration", "file", "event", 1030, 29, "Funders", palette.yellow.color, "Funders receive the supplier registration file."),
  task("on-complete", "on-lane-funders", "Onboarding complete", "check", "end", 1200, 29, "Funders", palette.yellow.color, "Supplier onboarding is complete."),
];

const onboardingEdges = [
  edge("oe-1", "on-start", "on-invite"),
  edge("oe-2", "on-invite", "on-invitation-sent"),
  message("oe-3", "on-invitation-sent", "on-send-email", "invitation"),
  edge("oe-4", "on-send-email", "on-registration-sent"),
  message("oe-5", "on-registration-sent", "on-register-taulia", "registration email"),
  message("oe-6", "on-register-taulia", "on-follow-registration", undefined),
  edge("oe-7", "on-follow-registration", "on-register-manafa", {
    kind: "message",
    sourceHandle: "out-right",
    targetHandle: "in-bottom",
  }),
  edge("oe-8", "on-register-manafa", "on-company-info"),
  message("oe-9", "on-company-info", "on-kyc", undefined),
  edge("oe-10", "on-kyc", "on-compliance"),
  edge("oe-11", "on-compliance", "on-sign-agreements", {
    kind: "message",
    sourceHandle: "out-top",
    targetHandle: "in-left",
  }),
  edge("oe-12", "on-sign-agreements", "on-follow-taulia", {
    kind: "message",
    sourceHandle: "out-right",
    targetHandle: "in-top",
  }),
  edge("oe-13", "on-follow-taulia", "on-activate-invoices", {
    kind: "message",
    sourceHandle: "out-bottom",
    targetHandle: "in-right",
  }),
  message("oe-14", "on-activate-invoices", "on-send-funders", undefined),
  message("oe-15", "on-send-funders", "on-receive-registration", "supplier registration file"),
  edge("oe-16", "on-receive-registration", "on-complete"),
];

const onboardingToBeNodes = [
  lane("tb-lane-aramco", "Aramco", "user", "blue", 20, 1900, 118),
  lane("tb-lane-taulia-api", "Taulia Onboarding API", "cpu", "purple", 152, 1900, 118),
  lane("tb-lane-manafa-system", "Manafa System", "cpu", "teal", 284, 1900, 118),
  lane("tb-lane-supplier", "Supplier", "user", "green", 416, 1900, 122),
  lane("tb-lane-operations", "Operations Team", "shield", "gray", 552, 1900, 118),
  lane("tb-lane-taulia-system", "Taulia System", "cpu", "purple", 684, 1900, 118),
  lane("tb-lane-funders", "Funders", "bank", "yellow", 816, 1900, 118),

  task("tb-start", "tb-lane-aramco", "Supplier selected", "check", "start", 80, 30, "Aramco", palette.blue.color, "Aramco selects a supplier for the SCF program."),
  task("tb-flag-invited", "tb-lane-aramco", "Flag supplier as invited", "userPlus", "activity", 270, 22, "Aramco", palette.blue.color, "Aramco flags the supplier as invited in the onboarding source."),
  task("tb-aramco-email", "tb-lane-aramco", "Send Aramco invitation email", "mail", "activity", 500, 22, "Aramco", palette.blue.color, "Aramco sends the first program invitation directly to the supplier."),

  task("tb-publish-invite", "tb-lane-taulia-api", "Publish invited supplier", "send", "activity", 500, 20, "Taulia Onboarding API", palette.purple.color, "The Taulia onboarding API exposes the supplier's invited status.", "Invited flag", { changeType: "new" }),
  task("tb-api-available", "tb-lane-taulia-api", "Invited supplier available", "check", "event", 700, 29, "Taulia Onboarding API", palette.purple.color, "The invited supplier is available through the pull endpoint.", "Pull endpoint", { changeType: "new" }),

  task("tb-pull-invited", "tb-lane-manafa-system", "Pull invited suppliers", "transfer", "activity", 700, 20, "Manafa System", palette.teal.color, "Manafa periodically pulls the onboarding endpoint for suppliers flagged as invited.", "Scheduled sync", { changeType: "new" }),
  task("tb-manafa-email", "tb-lane-manafa-system", "Send Manafa onboarding email", "send", "activity", 920, 20, "Manafa System", palette.teal.color, "Manafa sends the supplier a direct link to start Manafa onboarding.", "Direct onboarding", { changeType: "new" }),
  task("tb-sync-status", "tb-lane-manafa-system", "Sync onboarding completion", "transfer", "activity", 1400, 20, "Manafa System", palette.teal.color, "Manafa submits the completed onboarding status through the Taulia API.", "API status update", { changeType: "new" }),
  task("tb-send-funders", "tb-lane-manafa-system", "Send registration to funders", "send", "activity", 1600, 20, "Manafa System", palette.teal.color, "Manafa sends the completed supplier registration to funders."),

  task("tb-register-manafa", "tb-lane-supplier", "Register directly on Manafa", "userPlus", "activity", 920, 21, "Supplier", palette.green.color, "The supplier completes one onboarding registration directly in Manafa.", "No Taulia registration", { changeType: "improved" }),
  task("tb-company-info", "tb-lane-supplier", "Attach company info", "file", "activity", 1130, 21, "Supplier", palette.green.color, "Upload company information within the Manafa platform.", "Within Manafa platform"),
  task("tb-sign-agreements", "tb-lane-supplier", "Sign legal agreements", "file", "activity", 1320, 21, "Supplier", palette.green.color, "Supplier signs the FC and AOPF legal agreements.", "FC · AOPF"),

  task("tb-kyc", "tb-lane-operations", "Perform KYC", "shield", "activity", 1130, 20, "Operations Team", palette.gray.color, "Perform KYC checks and validate authorizations.", "Validate authorizations"),
  task("tb-compliance", "tb-lane-operations", "Compliance review", "check", "activity", 1320, 20, "Operations Team", palette.gray.color, "Operations completes the compliance review."),

  task("tb-activate-invoices", "tb-lane-taulia-system", "Activate invoice submission", "check", "activity", 1400, 20, "Taulia System", palette.purple.color, "Taulia activates invoice submission after receiving the completed onboarding status.", "API-enabled activation", { changeType: "improved" }),

  task("tb-receive-registration", "tb-lane-funders", "Receive supplier registration", "file", "event", 1600, 29, "Funders", palette.yellow.color, "Funders receive the supplier registration file."),
  task("tb-complete", "tb-lane-funders", "Onboarding complete", "check", "end", 1760, 29, "Funders", palette.yellow.color, "Supplier onboarding is complete."),
];

const onboardingToBeEdges = [
  edge("te-1", "tb-start", "tb-flag-invited"),
  edge("te-2", "tb-flag-invited", "tb-aramco-email"),
  message("te-3", "tb-aramco-email", "tb-publish-invite", "invited flag"),
  edge("te-4", "tb-publish-invite", "tb-api-available"),
  message("te-5", "tb-api-available", "tb-pull-invited", "scheduled pull"),
  edge("te-6", "tb-pull-invited", "tb-manafa-email"),
  message("te-7", "tb-manafa-email", "tb-register-manafa", "Manafa onboarding link"),
  edge("te-8", "tb-register-manafa", "tb-company-info"),
  message("te-9", "tb-company-info", "tb-kyc"),
  edge("te-10", "tb-kyc", "tb-compliance"),
  edge("te-11", "tb-compliance", "tb-sign-agreements", {
    kind: "message",
    sourceHandle: "out-top",
    targetHandle: "in-left",
  }),
  edge("te-12", "tb-sign-agreements", "tb-sync-status", {
    kind: "message",
    sourceHandle: "out-top",
    targetHandle: "in-left",
  }),
  edge("te-13", "tb-sync-status", "tb-activate-invoices", {
    kind: "message",
    label: "onboarding complete",
    sourceHandle: "out-bottom",
    targetHandle: "in-right",
  }),
  edge("te-14", "tb-activate-invoices", "tb-send-funders", {
    kind: "message",
    label: "activation confirmed",
    sourceHandle: "out-right",
    targetHandle: "in-bottom",
  }),
  message("te-15", "tb-send-funders", "tb-receive-registration", "supplier registration file"),
  edge("te-16", "tb-receive-registration", "tb-complete"),
];

const onboardingVariants = {
  "as-is": {
    id: "onboarding-as-is",
    phase: "Process 01 · Current operating model",
    title: "Supplier Onboarding · As-is",
    summary: "Suppliers register with Taulia and then repeat onboarding in Manafa before KYC, authorization validation, and activation.",
    stepCount: 18,
    laneCount: 8,
    nodes: onboardingNodes,
    edges: onboardingEdges,
    highlightTitle: "Current conversion and operating challenges",
    highlightSummary: "The current journey adds a second registration and several manual handoffs before the supplier can be activated.",
    highlights: [
      { title: "Double registration", body: "Suppliers register first in Taulia and then again in Manafa, increasing abandonment and reducing conversion." },
      { title: "Manual recovery", body: "Manafa must follow up after the first registration, adding operational effort and delay." },
      { title: "Activation dependency", body: "Cash Flow activation relies on manual coordination with the Taulia team." },
    ],
    tone: "risk",
  },
  "to-be": {
    id: "onboarding-to-be",
    phase: "Process 01 · API-enabled future state",
    title: "Supplier Onboarding · To-be",
    summary: "Aramco flags and emails invited suppliers; Manafa pulls the Taulia onboarding API and takes each supplier directly through onboarding, KYC, and authorization.",
    stepCount: 17,
    laneCount: 7,
    nodes: onboardingToBeNodes,
    edges: onboardingToBeEdges,
    highlightTitle: "API-enabled target journey",
    highlightSummary: "Supplier-facing Taulia registration is removed while Manafa owns the direct onboarding experience.",
    highlights: [
      { title: "Taulia registration removed", body: "The supplier no longer receives a Taulia registration email or completes a separate Taulia profile." },
      { title: "Scheduled invited-supplier sync", body: "Manafa periodically pulls suppliers flagged as invited through the onboarding endpoint." },
      { title: "Direct Manafa onboarding", body: "Manafa sends its own invitation and moves the supplier directly into KYC and authorization validation." },
    ],
    assumption: "Future-state dependency: Taulia must provide the invited-supplier pull endpoint and onboarding-status API.",
    tone: "future",
  },
};

const financingNodes = [
  lane("fi-lane-supplier", "Supplier", "user", "green", 20, 3590, 138),
  lane("fi-lane-manafa", "Manafa System", "cpu", "teal", 174, 3590, 228),
  lane("fi-lane-bank", "Bank", "bank", "blue", 418, 3590, 138),
  lane("fi-lane-sbc", "Saudi Business Center", "shield", "gray", 572, 3590, 138),
  lane("fi-lane-taulia", "Taulia System", "cpu", "purple", 726, 3590, 138),

  task("fi-start", "fi-lane-supplier", "Invoice available", "file", "start", 72, 39, "Supplier", palette.green.color, "A buyer-approved invoice is available for financing.", "Buyer-approved"),
  task("fi-request", "fi-lane-supplier", "Request financing", "money", "activity", 270, 30, "Supplier", palette.green.color, "Supplier submits a financing request."),
  task("fi-accept", "fi-lane-supplier", "Accept financing offer", "check", "activity", 520, 30, "Supplier", palette.green.color, "Supplier selects and accepts the best offer."),
  task("fi-sign", "fi-lane-supplier", "Sign assignment addendum", "file", "activity", 770, 30, "Supplier", palette.green.color, "Supplier signs the assignment addendum."),
  task("fi-agency", "fi-lane-supplier", "Grant Murabaha sale agency", "users", "activity", 1020, 30, "Supplier", palette.green.color, "Supplier grants the Murabaha sale agency."),

  task("fi-route", "fi-lane-manafa", "Check funders & route", "route", "activity", 270, 28, "Manafa System", palette.teal.color, "Manafa evaluates funders and routes the request."),
  task("fi-notice", "fi-lane-manafa", "Send assignment notice", "send", "activity", 770, 28, "Manafa System", palette.teal.color, "Manafa sends the assignment notice to Taulia."),
  task("fi-purchase", "fi-lane-manafa", "Purchase Murabaha commodity", "shoppingBag", "activity", 1090, 28, "Manafa System", palette.teal.color, "Manafa purchases the Murabaha commodity."),
  task("fi-sell", "fi-lane-manafa", "Sell Murabaha commodity", "shoppingCart", "activity", 1330, 28, "Manafa System", palette.teal.color, "Manafa completes the commodity sale."),
  task("fi-is-bank", "fi-lane-manafa", "Is the funder a bank?", "route", "gateway", 1550, 39, "Manafa System", palette.teal.color, "The process branches by funder type."),
  task("fi-send-bank", "fi-lane-manafa", "Send financing file to bank", "send", "activity", 1760, 28, "Manafa System", palette.teal.color, "Send the financing and discount file to the bank.", "Financing & discount"),
  task("fi-bank-response", "fi-lane-manafa", "Receive bank response", "file", "activity", 2000, 28, "Manafa System", palette.teal.color, "Receive the bank approval or rejection response."),
  task("fi-bank-funds", "fi-lane-manafa", "Receive funds from bank", "money", "activity", 2240, 28, "Manafa System", palette.teal.color, "Manafa receives the transferred financing funds."),
  task("fi-draw-fund", "fi-lane-manafa", "Draw from fund account", "wallet", "activity", 1760, 129, "Manafa System", palette.teal.color, "Draw financing from the fund's virtual account.", "Virtual account"),
  task("fi-funds-ready", "fi-lane-manafa", "Funds received", "check", "gateway", 2470, 39, "Manafa System", palette.teal.color, "Both funder routes merge when funds are ready."),
  task("fi-deposit", "fi-lane-manafa", "Deposit financing amount", "wallet", "activity", 2680, 28, "Manafa System", palette.teal.color, "Deposit to the supplier virtual account.", "Supplier virtual account"),
  task("fi-fees", "fi-lane-manafa", "Deduct fees & tax", "percent", "activity", 2920, 28, "Manafa System", palette.teal.color, "Manafa deducts the applicable fees and tax."),
  task("fi-transfer", "fi-lane-manafa", "Transfer net financing", "transfer", "activity", 3160, 28, "Manafa System", palette.teal.color, "Transfer net financing to the supplier bank.", "To supplier bank"),
  task("fi-register-loan", "fi-lane-manafa", "Register loan with SBC", "book", "activity", 3390, 28, "Manafa System", palette.teal.color, "Submit the loan for movable-asset registration."),

  task("fi-process-bank", "fi-lane-bank", "Process financing file", "file", "activity", 1760, 29, "Bank", palette.blue.color, "The bank processes the financing file."),
  task("fi-response-file", "fi-lane-bank", "Send response file", "send", "activity", 2000, 29, "Bank", palette.blue.color, "The bank sends its approval or rejection file."),
  task("fi-transfer-funds", "fi-lane-bank", "Transfer funds", "money", "activity", 2240, 29, "Bank", palette.blue.color, "The bank transfers the approved financing funds."),

  task("fi-register-asset", "fi-lane-sbc", "Register movable asset", "book", "activity", 3270, 29, "Saudi Business Center", palette.gray.color, "Register the movable asset for publicity.", "Publicity"),
  task("fi-complete", "fi-lane-sbc", "Financing complete", "check", "end", 3470, 38, "Saudi Business Center", palette.gray.color, "The financing cycle is complete."),

  task("fi-confirm", "fi-lane-taulia", "Assignment confirmation", "check", "activity", 930, 29, "Taulia System", palette.purple.color, "Taulia confirms assignment after verification and bank-detail update.", "Aramco / bank details"),
];

const financingEdges = [
  edge("fe-1", "fi-start", "fi-request"),
  message("fe-2", "fi-request", "fi-route", undefined),
  edge("fe-3", "fi-route", "fi-accept", {
    kind: "message",
    label: "best offer",
    sourceHandle: "out-right",
    targetHandle: "in-bottom",
  }),
  edge("fe-4", "fi-accept", "fi-sign"),
  message("fe-5", "fi-sign", "fi-notice", undefined),
  message("fe-6", "fi-notice", "fi-confirm", "assignment notice"),
  edge("fe-7", "fi-confirm", "fi-purchase", {
    kind: "message",
    label: "assignment confirmed",
    sourceHandle: "out-right",
    targetHandle: "in-bottom",
  }),
  message("fe-8", "fi-purchase", "fi-agency", undefined, "up"),
  edge("fe-9", "fi-agency", "fi-sell", {
    kind: "message",
    sourceHandle: "out-right",
    targetHandle: "in-top",
  }),
  edge("fe-10", "fi-sell", "fi-is-bank"),
  edge("fe-11", "fi-is-bank", "fi-send-bank", { label: "Yes" }),
  edge("fe-12", "fi-is-bank", "fi-draw-fund", { label: "No", sourceHandle: "out-bottom", targetHandle: "in-left" }),
  edge("fe-13", "fi-send-bank", "fi-process-bank", {
    kind: "message",
    sourceHandle: "out-bottom",
    targetHandle: "in-right",
  }),
  edge("fe-14", "fi-process-bank", "fi-response-file"),
  message("fe-15", "fi-response-file", "fi-bank-response", "response file", "up"),
  edge("fe-16", "fi-response-file", "fi-transfer-funds"),
  message("fe-17", "fi-transfer-funds", "fi-bank-funds", "funds", "up"),
  edge("fe-18", "fi-bank-response", "fi-bank-funds"),
  edge("fe-19", "fi-bank-funds", "fi-funds-ready"),
  edge("fe-20", "fi-draw-fund", "fi-funds-ready", { targetHandle: "in-bottom" }),
  edge("fe-21", "fi-funds-ready", "fi-deposit"),
  edge("fe-22", "fi-deposit", "fi-fees"),
  edge("fe-23", "fi-fees", "fi-transfer"),
  edge("fe-24", "fi-transfer", "fi-register-loan"),
  message("fe-25", "fi-register-loan", "fi-register-asset", "movable asset registration"),
  edge("fe-26", "fi-register-asset", "fi-complete"),
];

const settlementNodes = [
  lane("se-lane-manafa", "Manafa System", "cpu", "teal", 20, 2730, 360),
  lane("se-lane-bank", "Bank", "bank", "blue", 398, 2730, 160),

  task("se-start", "se-lane-manafa", "Settlement due", "check", "start", 72, 58, "Manafa System", palette.teal.color, "The financing reaches its settlement due date."),
  task("se-maturity", "se-lane-manafa", "Retrieve buyer maturity report", "file", "activity", 270, 50, "Manafa System", palette.teal.color, "Retrieve the buyer maturity report."),
  task("se-route", "se-lane-manafa", "Settlement route?", "route", "gateway", 520, 60, "Manafa System", palette.teal.color, "Select whether the buyer pays Manafa or the bank."),
  task("se-buyer-payment", "se-lane-manafa", "Receive buyer payment", "wallet", "activity", 730, 50, "Manafa System", palette.teal.color, "Manafa receives the buyer payment."),
  task("se-report", "se-lane-manafa", "Retrieve payment report", "file", "activity", 970, 50, "Manafa System", palette.teal.color, "Retrieve the payment report from the system."),
  task("se-method", "se-lane-manafa", "Settlement method?", "route", "gateway", 1210, 60, "Manafa System", palette.teal.color, "Choose bank transfer or virtual wallet settlement."),
  task("se-transfer-bank", "se-lane-manafa", "Transfer funds to bank", "transfer", "activity", 1430, 45, "Manafa System", palette.teal.color, "Manafa transfers the settlement funds to the bank."),
  task("se-wallet", "se-lane-manafa", "Settle in funder wallet", "wallet", "activity", 1430, 223, "Manafa System", palette.teal.color, "Settle within the funder's virtual wallet.", "Virtual wallet"),
  task("se-file", "se-lane-manafa", "Send settlement file", "send", "activity", 970, 223, "Manafa System", palette.teal.color, "Send a settlement file when the buyer pays the bank directly."),
  task("se-ack", "se-lane-manafa", "Receive settlement acknowledgment", "check", "activity", 1900, 45, "Manafa System", palette.teal.color, "Receive the bank's acknowledgment to settle."),
  task("se-settled", "se-lane-manafa", "Settled", "check", "gateway", 2150, 60, "Manafa System", palette.teal.color, "All three settlement routes merge here."),
  task("se-close", "se-lane-manafa", "Close loan", "lock", "activity", 2360, 50, "Manafa System", palette.teal.color, "Manafa closes the fully settled loan."),
  task("se-complete", "se-lane-manafa", "Settlement complete", "check", "end", 2580, 59, "Manafa System", palette.teal.color, "The loan is closed and settlement is complete."),

  task("se-bank-funds", "se-lane-bank", "Receive funds", "wallet", "activity", 1430, 39, "Bank", palette.blue.color, "The bank receives the transferred settlement funds."),
  task("se-bank-file", "se-lane-bank", "Receive settlement file", "file", "activity", 1660, 39, "Bank", palette.blue.color, "The bank receives the settlement file."),
  task("se-bank-ack", "se-lane-bank", "Send settlement acknowledgment", "send", "activity", 1900, 39, "Bank", palette.blue.color, "The bank sends its settlement acknowledgment."),
];

const settlementEdges = [
  edge("se-1", "se-start", "se-maturity"),
  edge("se-2", "se-maturity", "se-route"),
  edge("se-3", "se-route", "se-buyer-payment", { label: "Buyer pays Manafa" }),
  edge("se-4", "se-buyer-payment", "se-report"),
  edge("se-5", "se-report", "se-method"),
  edge("se-6", "se-method", "se-transfer-bank", { label: "Bank reconciliation" }),
  edge("se-7", "se-method", "se-wallet", { label: "Virtual wallet", sourceHandle: "out-bottom", targetHandle: "in-left" }),
  edge("se-8", "se-transfer-bank", "se-bank-funds", {
    kind: "message",
    label: "transfer funds",
    sourceHandle: "out-bottom",
    targetHandle: "in-right",
  }),
  edge("se-9", "se-bank-funds", "se-bank-file"),
  edge("se-10", "se-bank-file", "se-bank-ack"),
  message("se-11", "se-bank-ack", "se-ack", "acknowledgment", "up"),
  edge("se-12", "se-ack", "se-settled"),
  edge("se-13", "se-wallet", "se-settled", { targetHandle: "in-bottom" }),
  edge("se-14", "se-route", "se-file", { label: "Buyer pays bank", sourceHandle: "out-bottom", targetHandle: "in-left" }),
  message("se-15", "se-file", "se-bank-file", "settlement file"),
  edge("se-16", "se-settled", "se-close", { label: "Yes" }),
  edge("se-17", "se-close", "se-complete"),
];

export const workflows = [
  {
    id: "onboarding",
    phase: "Process 01 · Enablement",
    title: "SCF Supplier Onboarding V2",
    shortTitle: "Supplier onboarding",
    tabTitle: "Supplier onboarding",
    summary: "Invite, verify, activate, and distribute a supplier registration to funders.",
    accent: "#3476d9",
    stepCount: 18,
    laneCount: 8,
    CardIcon: IconBuildingFactory2,
    nodes: onboardingNodes,
    edges: onboardingEdges,
    variants: onboardingVariants,
  },
  {
    id: "financing",
    phase: "Process 02 · Disbursement",
    title: "SCF Invoice Financing V2",
    shortTitle: "Invoice financing",
    tabTitle: "Invoice financing",
    summary: "Turn a buyer-approved invoice into financed funds and register the movable asset.",
    accent: "#008b8f",
    stepCount: 27,
    laneCount: 5,
    CardIcon: IconCurrencyRiyal,
    nodes: financingNodes,
    edges: financingEdges,
  },
  {
    id: "settlement",
    phase: "Process 03 · Repayment",
    title: "SCF Settlement & Loan Closure",
    shortTitle: "Settlement & closure",
    tabTitle: "Settlement & closure",
    summary: "Reconcile one of three repayment routes, merge at settlement, and close the loan.",
    accent: "#7a62d3",
    stepCount: 16,
    laneCount: 2,
    CardIcon: IconReceipt,
    nodes: settlementNodes,
    edges: settlementEdges,
  },
];
