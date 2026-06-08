import { states } from "@/lib/data";

export type ArticleSection = {
  heading: string;
  body: string;
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type ArticleLink = {
  href: string;
  label: string;
};

export type ArticleDetailBlock = {
  title: string;
  kind: "table" | "calculation" | "checklist";
  intro: string;
  rows: { label: string; value: string; note: string }[];
};

export type Article = {
  slug: string;
  title: string;
  subtitle: string;
  metaTitle: string;
  metaDescription: string;
  mainKeyword: string;
  expandedKeywords: string[];
  category: string;
  searchIntent: string;
  readerLevel: "beginner" | "intermediate" | "advanced";
  stateSlug: string;
  scheduledAt: string;
  date: string;
  excerpt: string;
  intro: string;
  answerSummary?: string;
  highlight?: string;
  actionItems?: string[];
  accentTone?: "savings" | "warning";
  readerProblem?: string;
  uniqueAngle?: string;
  evidenceNotes?: string[];
  practicalExample?: string;
  decisionChecklist?: string[];
  commonMistake?: string;
  whenToAct?: string;
  contentLayout?: "diagnostic" | "example-first" | "evidence-first" | "action-first";
  detailBlocks?: ArticleDetailBlock[];
  wordCount?: number;
  sections: ArticleSection[];
  faq: ArticleFaq[];
  internalLinks: ArticleLink[];
  externalSource: ArticleLink;
  cta: ArticleLink;
  schemaType: "Article" | "HowTo" | "FAQPage";
  qualityScore: number;
  codexOnlyGeneration: true;
};

type ArticleSeed = {
  slug: string;
  title: string;
  mainKeyword: string;
  expandedKeywords: string[];
  category: string;
  searchIntent: string;
  readerLevel: Article["readerLevel"];
  stateSlug: string;
  format: "checklist" | "comparison" | "troubleshooting" | "decision" | "data-led" | "mistakes" | "scenario" | "glossary" | "howto" | "case";
  source: "eia" | "doe" | "energystar" | "liheap";
  angle: string;
};

type ArticleEnhancement = {
  prioritySections: ArticleSection[];
  priorityFaq?: ArticleFaq[];
  qualityBoost?: number;
};

const firstScheduledAt = process.env.CONTENT_SCHEDULE_START || "2026-06-08T01:00:00+09:00";
const fiveHours = 5 * 60 * 60 * 1000;

const sourceMap: Record<ArticleSeed["source"], ArticleLink> = {
  eia: { href: "https://www.eia.gov/electricity/data.php", label: "EIA electricity data" },
  doe: { href: "https://www.energy.gov/oe/demand-response", label: "U.S. Department of Energy demand response overview" },
  energystar: { href: "https://www.energystar.gov/saveathome", label: "ENERGY STAR home energy savings guidance" },
  liheap: { href: "https://www.acf.hhs.gov/ocs/programs/liheap", label: "federal LIHEAP program information" }
};

const priorityArticleEnhancements: Record<string, ArticleEnhancement> = {
  "average-electric-bill-before-moving": {
    prioritySections: [
      { heading: "Before you sign a lease or offer", body: "Ask for the home's recent electric usage, not only the average dollar bill. Dollars can hide a short billing period, a temporary discount, or a prior occupant with very different habits. A better moving estimate starts with expected monthly kWh, the state benchmark, heating fuel, cooling exposure, and whether major appliances are electric." },
      { heading: "A moving budget that will not surprise you", body: "Build the first budget as a range. Use a low case for mild weather and a high case for the first hot or cold month, then add room for setup fees or deposits. If the high case is uncomfortable, the home may still be affordable, but it needs a cash-flow plan before move-in." }
    ],
    priorityFaq: [
      { question: "Should I trust the landlord's average electric bill?", answer: "Use it as a clue, not the answer. Ask whether it reflects the same appliances, number of occupants, and recent rate period." }
    ],
    qualityBoost: 2
  },
  "apartment-electric-bill-first-month": {
    prioritySections: [
      { heading: "Why the first bill can be misleading", body: "A first apartment bill may include a partial billing cycle, account setup timing, estimated readings, or usage from a move-in week with doors open and appliances running. Compare billing days before judging whether the apartment is expensive to power." },
      { heading: "Renter-specific checks", body: "Renters should confirm which appliances are electric, whether heating or hot water is included, and whether the meter serves only the unit. If the bill seems far too high for the apartment size, the next step is documentation: meter number, lease terms, billing dates, and photos of the meter if accessible." }
    ],
    priorityFaq: [
      { question: "Can a first apartment bill be high because of setup fees?", answer: "Yes. Review the line items separately from usage charges before assuming the apartment itself uses too much electricity." }
    ],
    qualityBoost: 2
  },
  "monthly-kwh-usage-normal-range": {
    prioritySections: [
      { heading: "Normal depends on what the home runs on", body: "A normal monthly kWh range changes sharply when heating, water heating, cooking, laundry, or vehicle charging moves from gas to electric. Two homes with the same square footage can have very different usage if one relies on electric resistance heat or charges an EV at home." },
      { heading: "How to read the range", body: "Use the range as a triage tool. Low usage with a high bill points toward rates, fees, or billing periods. High usage with an average rate points toward equipment, weather, occupancy, or behavior. The range is useful because it tells you which investigation path to take first." }
    ],
    priorityFaq: [
      { question: "Is high kWh always bad?", answer: "No. It can be normal for all-electric homes, extreme weather, larger households, or EV charging. The issue is whether the usage matches the home." }
    ],
    qualityBoost: 2
  },
  "work-from-home-electric-bill": {
    prioritySections: [
      { heading: "The hidden cost is usually comfort, not the laptop", body: "A laptop and monitor are visible, but daytime HVAC often moves the bill more. Working from home keeps rooms conditioned during hours that may have been set back before. On time-of-use plans, the same daytime comfort can also land inside a higher price window." },
      { heading: "A practical one-week test", body: "Track work hours, thermostat settings, and major appliance use for one week, then compare the next bill's kWh and billing days. If usage rose only slightly, the work setup may not be the problem. If daytime HVAC dominates, scheduling, zoning, filters, and window heat gain are better targets than unplugging small devices." }
    ],
    priorityFaq: [
      { question: "Does working from home always raise the electric bill a lot?", answer: "No. The largest increase usually appears when daytime heating or cooling changes, not from office electronics alone." }
    ],
    qualityBoost: 2
  },
  "air-conditioner-electricity-cost": {
    prioritySections: [
      { heading: "Runtime beats the label", body: "The unit's size matters, but monthly cost usually follows runtime. Poor airflow, dirty filters, direct sun, leaky ducts, or low insulation can make an efficient system run too long. That is why an AC cost estimate should combine equipment size with hours of operation and the local rate." },
      { heading: "What to change before buying equipment", body: "Start with filter replacement, shaded windows, reasonable setpoints, and blocked vent checks. If the bill is still high, compare kWh across similar weather months. A replacement decision should come after confirming that the current system is running long because of equipment condition, not just a hotter billing cycle." }
    ],
    priorityFaq: [
      { question: "Is a bigger AC always more expensive to run?", answer: "Not always. Oversizing can create comfort and cycling problems, but monthly cost depends on runtime, efficiency, weather, and rate." }
    ],
    qualityBoost: 3
  },
  "heat-pump-electric-bill-winter": {
    prioritySections: [
      { heading: "Auxiliary heat is the winter clue", body: "A winter heat pump bill often changes when backup or auxiliary heat runs more than expected. The bill will not label that clearly, so the clues are weather, thermostat jumps, system alerts, and a sudden rise in kWh compared with similar cold periods." },
      { heading: "When the bill is normal", body: "Higher winter kWh can be normal if the home is all-electric and temperatures fall below the system's most efficient range. The question is not whether the bill rose; it is whether the rise matches weather and comfort settings. If it does not, airflow, controls, or service issues move higher on the checklist." }
    ],
    priorityFaq: [
      { question: "Should I turn a heat pump way down at night?", answer: "Large setbacks can trigger backup heat in some homes. Smaller changes are often safer unless the system and climate support deeper setbacks." }
    ],
    qualityBoost: 3
  },
  "electric-water-heater-cost": {
    prioritySections: [
      { heading: "Water heating hides inside routine", body: "A water heater load rises with showers, laundry, guests, leaks, and temperature settings. Because it runs quietly, many households blame the HVAC system first. If hot water habits changed before the bill changed, the water heater deserves an early check." },
      { heading: "Signals worth checking", body: "Look for long recovery times, unusually hot settings, dripping fixtures, warm pipes near the tank, or a sudden change after guests or laundry volume increased. A simple usage review can prevent an unnecessary appliance purchase or a misleading rate complaint." }
    ],
    priorityFaq: [
      { question: "Can a small leak affect an electric water heater bill?", answer: "Yes. A hot-water leak can keep the heater cycling and raise kWh without looking dramatic day to day." }
    ],
    qualityBoost: 2
  },
  "ev-charging-electric-bill": {
    prioritySections: [
      { heading: "EV charging is a new household load", body: "Home charging adds kWh in a way most households can see quickly. The right question is not whether the electric bill rose, but whether the added cost is reasonable compared with miles driven, charging efficiency, and the rate plan used during charging hours." },
      { heading: "Off-peak timing can matter more than charger speed", body: "A Level 2 charger changes convenience and timing, not the energy needed to refill the battery. If the utility offers time-of-use rates, charging overnight may matter more than the hardware speed. Compare the rate window before assuming the charger caused the cost increase." }
    ],
    priorityFaq: [
      { question: "Does a Level 2 charger use more electricity than Level 1?", answer: "It can charge faster, but the energy needed depends mainly on miles and battery use. Timing and efficiency drive the bill difference." }
    ],
    qualityBoost: 3
  },
  "electric-bill-after-solar": {
    prioritySections: [
      { heading: "A solar bill is not supposed to be zero every month", body: "Even after solar, a bill can include fixed charges, minimum bills, taxes, delivery costs, or months when usage exceeds production. The useful review separates energy charges from non-bypassable or fixed line items before judging whether the system is underperforming." },
      { heading: "What to compare after installation", body: "Compare production, household usage, exported energy, imported energy, and billing credits over several months. A single cloudy month is not enough evidence. A pattern of high imports during expected production periods deserves a closer look at system output, shading, inverter data, and rate rules." }
    ],
    priorityFaq: [
      { question: "Why do I still have electric charges after solar?", answer: "Many bills still include fixed, delivery, minimum, or timing-based charges. Netting rules vary by utility and state." }
    ],
    qualityBoost: 2
  },
  "budget-billing-pros-cons": {
    prioritySections: [
      { heading: "Budget billing solves cash flow, not usage", body: "Budget billing can make payments predictable, but it does not erase high usage or high rates. The account may still reconcile later. The best candidate is a household that can afford the annual total but struggles with seasonal spikes." },
      { heading: "When to avoid it", body: "Avoid treating budget billing as assistance if the annual bill is unaffordable. In that case, payment arrangements, LIHEAP, weatherization, or usage reduction may be more relevant. Budget billing is a smoothing tool, not a hardship program." }
    ],
    priorityFaq: [
      { question: "Can budget billing create a balance later?", answer: "Yes. Many programs periodically reconcile actual usage against paid amounts, so review the terms before enrolling." }
    ],
    qualityBoost: 2
  },
  "electric-bill-past-due-plan": {
    prioritySections: [
      { heading: "Do the urgent tasks first", body: "A past-due plan should start with shutoff dates, payment arrangement options, assistance deadlines, and required documents. Energy-saving tips matter later; the first goal is keeping the account in a status where help is still available." },
      { heading: "What to say when you call", body: "Use specific facts: account number, amount past due, notice date, household income change if relevant, and what you can pay now. Ask about hardship protections, arrangement terms, fees, and whether applying for assistance pauses disconnection activity." }
    ],
    priorityFaq: [
      { question: "Should I wait until shutoff to ask for help?", answer: "No. Options are usually better before the account reaches the final notice stage." }
    ],
    qualityBoost: 3
  },
  "liheap-electric-bill-documents": {
    prioritySections: [
      { heading: "Documents reduce delays", body: "LIHEAP timing can be stressful because funding, eligibility windows, and local processing vary. Having ID, income proof, household details, account number, and a recent utility bill ready can prevent a small missing item from turning into a missed appointment or delayed benefit." },
      { heading: "What not to assume", body: "Do not assume one prior approval means the next application will match. Household income, program year rules, crisis status, utility account details, and available funds can change. Treat each application as a fresh file that needs complete documentation." }
    ],
    priorityFaq: [
      { question: "Does LIHEAP require the same documents in every state?", answer: "No. Common documents are similar, but local agencies set specific requirements and deadlines." }
    ],
    qualityBoost: 3
  },
  "electric-rate-increase-news-check": {
    prioritySections: [
      { heading: "News is not the same as your bill", body: "A rate increase headline may describe an average customer, a proposed case, a specific tariff class, or a phased change. Before reacting, match the story to your utility, customer class, effective date, and actual bill line items." },
      { heading: "Separate price from usage after the increase", body: "After a rate change, compare kWh and billing days first. If usage also rose, the headline is only part of the answer. If usage stayed stable and dollars rose, the rate or fee change becomes a stronger explanation." }
    ],
    priorityFaq: [
      { question: "Will a rate increase headline always raise my next bill?", answer: "Not always. Timing, tariff class, usage, fixed charges, and approval status determine how it appears on a bill." }
    ],
    qualityBoost: 2
  },
  "utility-rate-case-explained": {
    prioritySections: [
      { heading: "Why rate cases feel distant but matter", body: "A rate case can affect base rates, fixed charges, delivery charges, or cost recovery. Consumers usually see the result as a line-item change months later, which is why tracking dates and approved terms matters more than reacting to early headlines." },
      { heading: "What an average customer should look for", body: "Look for whether the case is proposed or approved, which customers it affects, when rates change, and whether the bill impact is usage-based or fixed. A fixed charge increase affects low-usage households differently from a per-kWh increase." }
    ],
    priorityFaq: [
      { question: "Is a rate case the same as retail shopping?", answer: "No. Rate cases are regulatory proceedings; retail shopping depends on state and service territory rules." }
    ],
    qualityBoost: 2
  },
  "texas-delivery-charges": {
    prioritySections: [
      { heading: "Shopping does not remove delivery", body: "In Texas, a retail plan can change the supply offer, but delivery charges still pay for wires and local delivery service. A cheap supply rate can still produce a disappointing bill if delivery, usage, or fixed fees are ignored." },
      { heading: "How to compare Texas offers more carefully", body: "Compare the energy charge, delivery charges, base fees, usage level assumptions, contract terms, and any bill credits. A plan that looks cheap at one usage level can be worse at another, so the comparison should use realistic monthly kWh." }
    ],
    priorityFaq: [
      { question: "Can I avoid Texas delivery charges by switching providers?", answer: "No. Delivery charges are tied to the delivery utility and generally remain even when the retail provider changes." }
    ],
    qualityBoost: 3
  },
  "california-baseline-electricity": {
    prioritySections: [
      { heading: "Baseline allowances change comparisons", body: "California baseline concepts can make simple average-rate comparisons confusing because usage tiers, climate zones, and household patterns affect how much energy falls into different price blocks. A statewide benchmark is useful, but it cannot explain every household bill." },
      { heading: "What to check before blaming usage", body: "Check baseline quantity, tiered usage, season, climate zone, and whether electrification changed the household load. A heat pump, EV, or electric water heater can move usage into a different billing context even when behavior is reasonable." }
    ],
    priorityFaq: [
      { question: "Does baseline electricity mean my bill should stay low?", answer: "No. It is a rate design concept, not a guarantee that total usage or total charges will be low." }
    ],
    qualityBoost: 2
  },
  "electric-bill-calculator-inputs": {
    prioritySections: [
      { heading: "The calculator is only as good as the inputs", body: "ZIP code or state alone is not enough for a useful estimate. Monthly kWh, billing days, cents per kWh, fixed charges, and whether the home has electric heating or EV charging usually matter more than location by itself." },
      { heading: "Use a range instead of one exact result", body: "A good calculator result should be a range because bills include fees, seasonal usage, rate structures, and plan-specific details. Use the result to decide whether the current bill is broadly normal, then read the actual line items for the exact answer." }
    ],
    priorityFaq: [
      { question: "What input matters most in an electric bill calculator?", answer: "Monthly kWh usually matters most because it captures the household's actual usage." }
    ],
    qualityBoost: 2
  },
  "kwh-to-dollars-electric-bill": {
    prioritySections: [
      { heading: "The simple conversion", body: "The basic conversion is kWh multiplied by the effective price per kWh. The hard part is choosing the right price. If the bill has fixed charges, tiers, or riders, the effective price may differ from the advertised energy rate." },
      { heading: "Why the math still helps", body: "Even when the exact bill includes extra charges, kWh-to-dollars math shows scale. It helps a reader see whether a device, an EV, or an HVAC change is likely to be a small detail or a major driver." }
    ],
    priorityFaq: [
      { question: "Can I multiply kWh by the advertised rate to get my exact bill?", answer: "Usually no. That estimate may miss fixed charges, delivery charges, taxes, tiers, or riders." }
    ],
    qualityBoost: 2
  },
  "electric-bill-normal-check": {
    prioritySections: [
      { heading: "Normal is a pattern, not a feeling", body: "A normality check should compare the bill with similar billing days, similar weather, and similar household routines. A single high month may be normal if it lines up with heat, cold, guests, EV charging, or a longer billing cycle." },
      { heading: "When normal still needs action", body: "A bill can be normal for the home and still unaffordable. If the benchmark says the bill is plausible but payment is difficult, the next step is assistance, budget billing, or usage reduction rather than a billing dispute." }
    ],
    priorityFaq: [
      { question: "What is the fastest way to check if my bill is normal?", answer: "Compare kWh, billing days, and rate against the prior month and a state benchmark before focusing on the dollar total." }
    ],
    qualityBoost: 2
  },
  "high-kwh-low-rate-diagnosis": {
    prioritySections: [
      { heading: "Low rates can hide a usage problem", body: "A low cents-per-kWh rate can make the bill feel reasonable until usage gets large enough to overwhelm the advantage. In that situation, shopping for a cheaper rate may not solve much. The better first question is which load created the high kWh." },
      { heading: "Find the load before changing plans", body: "Compare monthly kWh against weather, occupancy, HVAC runtime, water heating, EV charging, and appliance schedules. If the rate is already low, the biggest win usually comes from reducing unnecessary usage or fixing equipment behavior rather than chasing a marginal price change." }
    ],
    priorityFaq: [
      { question: "Can my bill be high even if my electricity rate is low?", answer: "Yes. High kWh can outweigh a low rate, especially with heating, cooling, water heating, or EV charging." }
    ],
    qualityBoost: 2
  }
};

const priorityDetailBlocks: Record<string, ArticleDetailBlock[]> = {
  "average-electric-bill-before-moving": [{ title: "Move-in estimate worksheet", kind: "table", intro: "Use these checks before treating an advertised average bill as reliable.", rows: [{ label: "Usage clue", value: "Recent monthly kWh", note: "Better than a dollar-only average because rates and billing days vary." }, { label: "Home clue", value: "Electric heat, cooling exposure, appliances", note: "Shows whether the home has large loads before you move in." }, { label: "Budget clue", value: "Low and high seasonal case", note: "Prevents a mild-month estimate from becoming the whole budget." }] }],
  "apartment-electric-bill-first-month": [{ title: "First-bill triage", kind: "checklist", intro: "A first bill needs a renter-specific review before it becomes evidence of a bad apartment.", rows: [{ label: "Billing days", value: "Partial or full cycle", note: "A short or long first cycle can distort the total." }, { label: "Line items", value: "Setup fees vs usage", note: "Separate one-time charges from kWh charges." }, { label: "Meter match", value: "Unit meter and lease terms", note: "Useful if the usage looks too high for the space." }] }],
  "monthly-kwh-usage-normal-range": [{ title: "Normal range interpretation", kind: "table", intro: "Read monthly kWh as a directional signal, not a universal score.", rows: [{ label: "Low kWh, high bill", value: "Rate or fees", note: "Check fixed charges, tiers, and billing days." }, { label: "High kWh, average rate", value: "Usage load", note: "Look at HVAC, water heating, EV charging, and occupancy." }, { label: "High kWh, high bill", value: "Priority diagnosis", note: "Use the benchmark, then inspect the largest household loads." }] }],
  "work-from-home-electric-bill": [{ title: "One-week work-from-home check", kind: "checklist", intro: "Track the change that likely moved the bill, not every device in the room.", rows: [{ label: "Comfort hours", value: "Daytime thermostat schedule", note: "Often larger than laptop or monitor electricity." }, { label: "Office load", value: "Computer, monitor, printer", note: "Usually visible but not always dominant." }, { label: "Rate timing", value: "Peak or off-peak work hours", note: "Important when the home is on time-of-use pricing." }] }],
  "air-conditioner-electricity-cost": [{ title: "AC cost example", kind: "calculation", intro: "Estimate the scale before assuming replacement is the only answer.", rows: [{ label: "Step 1", value: "Find AC runtime", note: "Hours matter more than the equipment label alone." }, { label: "Step 2", value: "Estimate kWh use", note: "Use conservative equipment data if exact numbers are unavailable." }, { label: "Step 3", value: "Apply local rate", note: "Then compare the result with the whole-bill kWh pattern." }] }],
  "heat-pump-electric-bill-winter": [{ title: "Winter heat pump clues", kind: "table", intro: "Use the bill and system behavior together; the bill alone rarely labels auxiliary heat.", rows: [{ label: "Weather clue", value: "Cold snap or long freeze", note: "Higher kWh may be normal if temperatures fell sharply." }, { label: "System clue", value: "Aux heat, alerts, long cycles", note: "Points toward backup heat or service review." }, { label: "Behavior clue", value: "Large thermostat setback", note: "Can trigger recovery patterns that raise kWh." }] }],
  "electric-water-heater-cost": [{ title: "Water-heater load signals", kind: "checklist", intro: "Water heating can be the hidden load when routines change.", rows: [{ label: "Usage change", value: "Guests, laundry, longer showers", note: "Often appears before the bill increase." }, { label: "Equipment clue", value: "High setting or long recovery", note: "Can keep the tank cycling more than expected." }, { label: "Leak clue", value: "Drips or warm pipes", note: "A small hot-water leak can create persistent kWh use." }] }],
  "ev-charging-electric-bill": [{ title: "EV charging bill math", kind: "calculation", intro: "Compare home charging with miles and timing, not charger speed alone.", rows: [{ label: "Miles", value: "Monthly driving distance", note: "Sets the size of the new energy load." }, { label: "Timing", value: "Peak vs off-peak charging", note: "Can matter more than Level 1 vs Level 2 hardware." }, { label: "Bill check", value: "Added kWh vs added dollars", note: "Separates reasonable EV load from rate-plan problems." }] }],
  "electric-bill-after-solar": [{ title: "Solar bill review", kind: "table", intro: "Separate a post-solar bill into production, usage, and remaining charges.", rows: [{ label: "Production", value: "System output", note: "Check inverter or portal data before blaming the bill." }, { label: "Imports", value: "Grid energy used", note: "High imports during sunny periods need closer review." }, { label: "Fixed charges", value: "Minimum, delivery, taxes", note: "Can remain even when energy charges fall." }] }],
  "budget-billing-pros-cons": [{ title: "Budget billing decision", kind: "table", intro: "Budget billing is useful only when the problem is timing, not total affordability.", rows: [{ label: "Good fit", value: "Seasonal spikes", note: "Smooths cash flow when the annual total is manageable." }, { label: "Weak fit", value: "Unaffordable annual bill", note: "Assistance or usage reduction may be more relevant." }, { label: "Risk", value: "Reconciliation balance", note: "Review how the utility settles under- or over-payment." }] }],
  "electric-bill-past-due-plan": [{ title: "Past-due priority order", kind: "checklist", intro: "A past-due bill needs triage before energy-saving advice.", rows: [{ label: "First", value: "Shutoff date and notice status", note: "Determines urgency and available options." }, { label: "Second", value: "Payment arrangement terms", note: "Ask about fees, deadlines, and default consequences." }, { label: "Third", value: "Assistance documents", note: "Prepare ID, income proof, account number, and recent bill." }] }],
  "liheap-electric-bill-documents": [{ title: "LIHEAP document checklist", kind: "checklist", intro: "Document readiness is one of the few parts a household can control.", rows: [{ label: "Identity", value: "ID and household details", note: "Agencies need to confirm who is applying." }, { label: "Income", value: "Recent income proof", note: "Requirements vary, so bring current documents." }, { label: "Utility", value: "Account number and recent bill", note: "Helps connect the application to the electric account." }] }],
  "electric-rate-increase-news-check": [{ title: "Rate news filter", kind: "table", intro: "Do not treat every rate headline as a next-bill forecast.", rows: [{ label: "Status", value: "Proposed or approved", note: "A proposal may change before it reaches bills." }, { label: "Customer class", value: "Residential or other", note: "Headlines may not apply to every tariff." }, { label: "Timing", value: "Effective date", note: "The change may not affect the current billing cycle." }] }],
  "utility-rate-case-explained": [{ title: "Rate case bill impact", kind: "table", intro: "The bill impact depends on what part of the rate changes.", rows: [{ label: "Fixed charge", value: "Monthly customer cost", note: "Hits low-usage homes even when kWh is low." }, { label: "Per-kWh rate", value: "Usage-based cost", note: "Affects high-usage months more strongly." }, { label: "Rider or recovery", value: "Line-item cost", note: "May appear separately from the base energy rate." }] }],
  "texas-delivery-charges": [{ title: "Texas plan comparison", kind: "table", intro: "A Texas plan comparison should include wires costs and realistic usage.", rows: [{ label: "Supply", value: "Retail energy charge", note: "This is only one part of the bill." }, { label: "Delivery", value: "TDU charges", note: "Switching retail providers does not erase these charges." }, { label: "Usage level", value: "Your real kWh", note: "Bill credits and rates can change by usage tier." }] }],
  "california-baseline-electricity": [{ title: "California baseline review", kind: "table", intro: "Baseline allowances require more context than a statewide average rate.", rows: [{ label: "Season", value: "Summer or winter allowance", note: "The relevant block can change by season." }, { label: "Climate", value: "Baseline territory", note: "Location can affect the allowance context." }, { label: "Electrification", value: "EV, heat pump, water heating", note: "New electric loads can change tier exposure." }] }],
  "electric-bill-calculator-inputs": [{ title: "Calculator input quality", kind: "table", intro: "Better inputs make a bill estimate useful instead of decorative.", rows: [{ label: "Best input", value: "Monthly kWh", note: "Captures actual usage better than home size alone." }, { label: "Important input", value: "Effective rate", note: "Use the bill when possible, not only an advertised rate." }, { label: "Context input", value: "Fixed fees and billing days", note: "Explains why exact bills differ from simple math." }] }],
  "kwh-to-dollars-electric-bill": [{ title: "kWh-to-dollars example", kind: "calculation", intro: "The simple conversion explains scale even when the exact bill has extra charges.", rows: [{ label: "Formula", value: "kWh x effective rate", note: "Use cents per kWh converted to dollars." }, { label: "Adjustment", value: "Add fixed and delivery charges", note: "Needed for a closer bill estimate." }, { label: "Use case", value: "Appliance or EV scale check", note: "Shows whether a load is worth investigating." }] }],
  "electric-bill-normal-check": [{ title: "Normal bill test", kind: "checklist", intro: "Normality depends on pattern matching, not the emotional size of the bill.", rows: [{ label: "Compare", value: "Same season or similar weather", note: "Prevents winter or summer from looking like a billing error." }, { label: "Match", value: "Billing days and kWh", note: "A long cycle can make a normal bill look high." }, { label: "Decide", value: "Normal but unaffordable?", note: "Then assistance or payment planning may matter more than a dispute." }] }],
  "high-kwh-low-rate-diagnosis": [{ title: "High-kWh diagnosis", kind: "table", intro: "A low rate does not protect a bill if usage is large enough.", rows: [{ label: "Likely cause", value: "HVAC, water heating, EV charging", note: "Large loads can overwhelm a cheap rate." }, { label: "Weak fix", value: "Chasing tiny rate changes", note: "May not solve the real bill driver." }, { label: "Better fix", value: "Find and reduce the dominant load", note: "Start with the load that moved first." }] }]
};

const topArticleDeepDives: Record<string, ArticleDetailBlock[]> = {
  "average-electric-bill-guide": [
    {
      title: "Average bill math examples",
      kind: "calculation",
      intro: "Use simple kWh math to test whether the average electric bill problem is usage, price, or fixed charges.",
      rows: [
        { label: "Moderate-use home", value: "800 kWh x $0.16 = $128", note: "This is before fixed fees, riders, taxes, or minimum charges." },
        { label: "High-use home", value: "1,200 kWh x $0.13 = $156", note: "A lower rate can still create a larger bill when kWh is much higher." },
        { label: "Fee check", value: "$128 + $22 fixed fees = $150", note: "The final bill can be meaningfully higher than energy-only math." }
      ]
    }
  ],
  "ev-charging-electric-bill": [
    {
      title: "EV charging monthly load scenarios",
      kind: "calculation",
      intro: "Estimate the new EV load before blaming the whole bill on the charger or the rate plan.",
      rows: [
        { label: "Light charging", value: "120 kWh x $0.15 = $18", note: "Useful for low-mileage households or partial workplace charging." },
        { label: "Typical added load", value: "250 kWh x $0.15 = $37.50", note: "Compare this with the bill increase to see whether another load also changed." },
        { label: "Timing risk", value: "Peak charging can outweigh hardware speed", note: "A Level 2 charger is not automatically expensive if charging is scheduled well." }
      ]
    }
  ],
  "liheap-electric-bill-documents": [
    {
      title: "Assistance path comparison",
      kind: "table",
      intro: "Choose the help path that matches the deadline instead of applying randomly.",
      rows: [
        { label: "Regular LIHEAP", value: "Income and account review", note: "Best when there is time to complete the normal application process." },
        { label: "Crisis assistance", value: "Shutoff or urgent arrears", note: "Bring the notice, account number, ID, and recent income proof first." },
        { label: "Weatherization", value: "Longer-term usage reduction", note: "Helpful when the bill problem repeats every heating or cooling season." }
      ]
    }
  ],
  "texas-delivery-charges": [
    {
      title: "Texas bill line-item split",
      kind: "table",
      intro: "A Texas electricity comparison should separate the retail energy price from charges that follow the wires company.",
      rows: [
        { label: "Retail energy", value: "Provider supply charge", note: "This is the part most plan-shopping pages emphasize." },
        { label: "TDU delivery", value: "Delivery charges", note: "These do not disappear just because the retail provider changes." },
        { label: "Bill credit math", value: "Usage level matters", note: "A plan that looks cheap at 1,000 kWh may be weaker at your real usage." }
      ]
    }
  ],
  "air-conditioner-electricity-cost": [
    {
      title: "AC runtime cost test",
      kind: "calculation",
      intro: "Runtime usually explains more than the nameplate alone, so estimate hours first.",
      rows: [
        { label: "Short daily runtime", value: "12 kWh/day x 30 x $0.16 = $57.60", note: "This may fit a mild month or a shaded, efficient home." },
        { label: "Long daily runtime", value: "28 kWh/day x 30 x $0.16 = $134.40", note: "A hot month can add a second-bill-sized load." },
        { label: "First fix to test", value: "Filter, airflow, setpoint, shade", note: "These are faster checks than replacing equipment immediately." }
      ]
    }
  ],
  "electric-bill-past-due-plan": [
    {
      title: "Past-due decision sequence",
      kind: "checklist",
      intro: "When the account is past due, the best content order is deadline first, savings second.",
      rows: [
        { label: "Same day", value: "Confirm shutoff date", note: "A payment plan depends on how close the account is to disconnection." },
        { label: "Before calling", value: "Prepare bill, ID, income proof", note: "This prevents a weak application or an incomplete assistance call." },
        { label: "After arrangement", value: "Lower the next bill driver", note: "Efficiency steps matter after the immediate deadline is stabilized." }
      ]
    }
  ],
  "electric-bill-calculator-inputs": [
    {
      title: "Calculator accuracy tiers",
      kind: "table",
      intro: "A calculator is only as useful as the inputs behind it.",
      rows: [
        { label: "Best estimate", value: "Actual kWh + effective rate + fixed fees", note: "Closest to the bill because it uses household evidence." },
        { label: "Medium estimate", value: "kWh + state average rate", note: "Good for planning, weaker for exact utility charges." },
        { label: "Rough estimate", value: "Home size only", note: "Useful for orientation but too broad for a payment decision." }
      ]
    }
  ],
  "kwh-to-dollars-electric-bill": [
    {
      title: "From kWh to bill dollars",
      kind: "calculation",
      intro: "The conversion is simple, but the interpretation changes once fixed fees and tiers appear.",
      rows: [
        { label: "Energy-only", value: "650 kWh x $0.17 = $110.50", note: "Good for measuring usage scale." },
        { label: "Closer bill", value: "$110.50 + $25 fees = $135.50", note: "Better when comparing against the actual statement." },
        { label: "Tier warning", value: "Use the effective rate when tiers apply", note: "A single advertised rate may not match the blended bill." }
      ]
    }
  ],
  "heat-pump-electric-bill-winter": [
    {
      title: "Winter heat pump pattern check",
      kind: "checklist",
      intro: "Use the bill pattern and thermostat behavior together before concluding the heat pump failed.",
      rows: [
        { label: "Weather", value: "Cold snap matched kWh jump", note: "The bill may be explainable if the weather changed sharply." },
        { label: "Controls", value: "Large setback and recovery", note: "Aggressive recovery can trigger backup heat on some systems." },
        { label: "Service clue", value: "Aux heat runs often", note: "Repeated auxiliary heat deserves a closer equipment review." }
      ]
    }
  ],
  "budget-billing-pros-cons": [
    {
      title: "Budget billing fit test",
      kind: "table",
      intro: "Budget billing solves cash-flow timing; it does not make an unaffordable annual bill disappear.",
      rows: [
        { label: "Strong fit", value: "Manageable annual cost, seasonal spikes", note: "Smoothing helps when summer or winter creates short-term stress." },
        { label: "Weak fit", value: "Annual bill is unaffordable", note: "Assistance, weatherization, or usage reduction should be reviewed first." },
        { label: "Review point", value: "Reconciliation balance", note: "The true-up can surprise households that ignore monthly usage." }
      ]
    }
  ]
};

const metaDescriptionOverrides: Record<string, string> = {
  "average-electric-bill-before-moving": "Average electric bill before moving: check monthly kWh, local rates, home loads, billing days, and move-in fees before setting a utility budget.",
  "apartment-electric-bill-first-month": "First apartment electric bill guide for renters: separate setup fees, billing days, appliance loads, and kWh usage before judging the unit.",
  "monthly-kwh-usage-normal-range": "Normal monthly kWh usage explained with home size, electric appliances, weather, rate benchmarks, and the signs that usage needs a closer check.",
  "work-from-home-electric-bill": "Work from home electric bill changes explained through daytime HVAC, office equipment, peak-hour rates, and a simple one-week usage check.",
  "air-conditioner-electricity-cost": "Air conditioner electricity cost guide with AC runtime, kWh examples, thermostat settings, airflow checks, and summer bill warning signs.",
  "heat-pump-electric-bill-winter": "Heat pump electric bill winter guide covering auxiliary heat, cold snaps, thermostat recovery, winter kWh, and when to request service.",
  "electric-water-heater-cost": "Electric water heater cost guide for hot water kWh, tank settings, leaks, guests, laundry changes, and monthly bill diagnosis.",
  "clothes-dryer-electricity-cost": "Clothes dryer electricity cost explained with dryer kWh, laundry frequency, heat pump dryers, hot water context, and bill-saving tradeoffs.",
  "refrigerator-electricity-cost": "Refrigerator electricity cost guide for always-on kWh, old fridge warning signs, standby load, and when replacement math makes sense.",
  "pool-pump-electricity-cost": "Pool pump electricity cost guide for pump kWh, timer schedules, variable-speed settings, summer bills, and usage checks before upgrades.",
  "space-heater-electric-bill": "Space heater electric bill math for portable heater wattage, winter kWh, room heating tradeoffs, and when plug-in heat gets expensive.",
  "ev-charging-electric-bill": "EV charging electric bill guide with home charging kWh, monthly driving, off-peak timing, Level 1 vs Level 2 context, and rate-plan checks.",
  "electric-bill-after-solar": "Electric bill after solar guide explaining net metering, fixed charges, grid imports, minimum bills, and why a solar bill may not be zero.",
  "budget-billing-pros-cons": "Budget billing pros and cons for electric bills: seasonal smoothing, reconciliation balances, payment risk, and when assistance is a better fit.",
  "electric-bill-past-due-plan": "Past-due electric bill plan with shutoff notice steps, payment arrangement questions, LIHEAP documents, and urgent bill triage.",
  "liheap-electric-bill-documents": "LIHEAP electric bill documents checklist covering ID, income proof, utility account details, crisis assistance, and application delays.",
  "electric-bill-too-high-complaint": "Electric bill too high complaint guide: gather kWh history, meter readings, billing days, line items, and evidence before disputing charges.",
  "utility-bill-audit-homeowner": "Utility bill audit homeowner guide using four numbers: monthly kWh, rate per kWh, billing period, fixed charges, and bill history.",
  "electric-rate-increase-news-check": "Electric rate increase news guide for checking proposed vs approved changes, effective dates, customer class, usage, and actual bill impact.",
  "utility-rate-case-explained": "Utility rate case explained for electric bills: fixed charges, per-kWh rates, riders, approval timing, and what changes on a statement.",
  "time-of-use-electric-rates": "Time-of-use electric rates guide for peak pricing, off-peak shifts, EV charging, HVAC timing, and households that should be careful.",
  "texas-delivery-charges": "Texas delivery charges explained with TDU charges, retail energy plans, bill credits, wires costs, and why shopping does not erase delivery.",
  "california-baseline-electricity": "California baseline electricity guide covering baseline allowances, tiered rates, climate zones, electrification loads, and bill comparison limits.",
  "electric-bill-calculator-inputs": "Electric bill calculator inputs that matter: monthly kWh, effective rate, fixed fees, billing days, state benchmarks, and appliance context.",
  "kwh-to-dollars-electric-bill": "kWh to dollars electric bill conversion with simple formulas, fixed fee adjustments, tier warnings, and examples for appliances or EV charging.",
  "electric-bill-normal-check": "Is my electric bill normal? Check kWh, billing days, rates, fixed fees, weather, and household changes before assuming an error.",
  "high-kwh-low-rate-diagnosis": "High kWh low rate diagnosis for electric bills: find usage drivers, HVAC, water heating, EV charging, and appliance loads before plan shopping.",
  "monthly-usage-slider-guide": "Monthly usage slider electric bill guide for choosing realistic kWh ranges, average usage, low-high scenarios, and bill estimator inputs.",
  "average-bill-range-not-single-number": "Average bill estimate range guide explaining why kWh, fixed fees, rate design, and seasonal uncertainty beat one precise-looking number.",
  "electric-bill-estimator-mistakes": "Electric bill estimator mistakes guide covering fake precision, weak kWh inputs, fixed fees, average rates, and better calculator habits."
};

const legacyArticles: Article[] = [
  {
    slug: "average-electric-bill-guide",
    title: "Average electric bill guide: rates, kWh usage, fees, and state benchmarks",
    subtitle: "Average electric bill guide using monthly kWh usage, electricity rates, fixed fees, and state benchmarks",
    metaTitle: "Average electric bill guide: rates and kWh",
    metaDescription: "Average electric bill guide explaining kWh usage, electricity rates, fixed fees, state benchmarks, calculator inputs, and practical next steps.",
    mainKeyword: "average electric bill",
    expandedKeywords: ["monthly kWh usage", "electricity rates", "fixed fees", "state benchmarks"],
    category: "Cornerstone",
    searchIntent: "Help readers understand what makes an electric bill average, high, or misleading.",
    readerLevel: "beginner",
    stateSlug: "texas",
    scheduledAt: "2026-06-07T00:00:00+09:00",
    date: "Jun 7, 2026",
    excerpt: "A hub guide for reading average electric bills with kWh, rates, fixed fees, and state benchmarks.",
    intro: "An average electric bill is not a single universal number. It is the result of monthly kWh usage, the effective electricity rate, fixed charges, billing days, weather, appliance mix, and local tariff rules. Use this guide as the hub before comparing a specific bill with a state benchmark.",
    answerSummary: "To judge an average electric bill, check kWh first, then the effective rate, fixed charges, billing days, and whether the home has major electric loads such as cooling, heating, water heating, or EV charging.",
    highlight: "The average is useful as a benchmark, but the actual bill is the authority. A household can have a normal bill that is still unaffordable, or a high bill that is explainable by usage.",
    actionItems: ["Find monthly kWh and billing days on the bill.", "Compare the effective rate with a state benchmark.", "Use appliance, heating, cooling, and EV clues to explain usage before assuming a billing error."],
    accentTone: "savings",
    readerProblem: "The reader wants to know whether a bill is normal, high, or misleading without confusing rates, usage, and fixed charges.",
    uniqueAngle: "This hub separates average bill questions into usage, price, fees, and household context so the next article or calculator step is obvious.",
    evidenceNotes: ["EIA electricity data is useful for broad residential benchmarks, but it does not replace the utility tariff on the bill.", "ENERGY STAR-style efficiency guidance is useful when the average bill problem is actually a home usage problem."],
    practicalExample: "Example: one household has a high electricity rate but low kWh, while another has a low rate but very high kWh. The first may need a rate and fee review; the second needs a usage diagnosis.",
    decisionChecklist: ["If kWh is high, diagnose loads first.", "If kWh is low but dollars are high, inspect rates and fees.", "If the bill is plausible but unaffordable, check assistance or budget billing."],
    commonMistake: "The common mistake is comparing only dollar totals across households without matching kWh, billing days, rate design, and major electric loads.",
    whenToAct: "Act quickly if the bill threatens payment stability, includes an estimated reading, or shows a sudden kWh jump without a household explanation.",
    contentLayout: "evidence-first",
    detailBlocks: [
      {
        title: "Average bill diagnostic map",
        kind: "table",
        intro: "Use this map to choose the right next article instead of reading every guide.",
        rows: [
          { label: "High kWh", value: "Usage diagnosis", note: "Start with HVAC, water heating, EV charging, and occupancy changes." },
          { label: "Low kWh, high bill", value: "Rate and fee review", note: "Check fixed charges, delivery charges, riders, and billing days." },
          { label: "Bill is plausible but hard to pay", value: "Assistance path", note: "Look at payment arrangements, LIHEAP, weatherization, or budget billing." }
        ]
      }
    ],
    sections: [
      { heading: "What an average electric bill can tell you", body: "Averages are useful for orientation. They help a reader see whether a bill belongs in a normal range, deserves a usage review, or points toward a rate and fee issue. The average is weakest when it is treated like a promise, because utility tariffs and household loads vary widely." },
      { heading: "The four numbers to read first", body: "Start with monthly kWh, billing days, total dollars, and the effective rate. Those four numbers separate most bill questions. A high total with high kWh is a different problem from a high total with low kWh." },
      { heading: "When to use state benchmarks", body: "State benchmarks help compare broad electricity price context. They are especially useful before moving, checking a first apartment bill, or deciding whether a home looks unusual. They cannot identify every utility-specific fee or time-of-use window." },
      { heading: "Where to go next", body: "If the issue is usage, read a device or home-load guide. If the issue is price, use the state comparison and methodology pages. If the issue is payment stress, move directly to bill help resources rather than spending time on minor efficiency tips." }
    ],
    faq: [
      { question: "What is the best first number for checking an average electric bill?", answer: "Monthly kWh is usually the best first number because it shows whether the household used more electricity before rates or fees are considered." },
      { question: "Can an average electric bill still be unaffordable?", answer: "Yes. A bill can be normal for the home and still difficult to pay. In that case, assistance and payment planning matter more than proving the bill is unusual." },
      { question: "Should I compare my bill with a neighbor's bill?", answer: "Only carefully. Compare home size, heating fuel, cooling exposure, appliances, occupancy, billing days, and kWh before treating the neighbor's bill as a benchmark." }
    ],
    internalLinks: [
      { href: "/compare", label: "compare state electricity benchmarks" },
      { href: "/guides/electric-bill-normal-check", label: "check whether an electric bill is normal" },
      { href: "/guides/high-kwh-low-rate-diagnosis", label: "diagnose high kWh with a low rate" },
      { href: "/assistance/texas", label: "review bill help options" }
    ],
    externalSource: sourceMap.eia,
    cta: { href: "/compare", label: "Compare state benchmarks" },
    schemaType: "Article",
    qualityScore: 98,
    codexOnlyGeneration: true,
    wordCount: 1250
  },
  {
    slug: "why-your-electric-bill-jumps-in-summer",
    title: "Why your electric bill jumps in summer",
    subtitle: "Summer electric bill spikes explained with cooling load, kWh usage, and state electricity rates",
    metaTitle: "Summer electric bill spikes: why costs jump",
    metaDescription: "Summer electric bill spikes explained with cooling usage, state electricity rates, estimator examples, and practical ways to reduce bill shock.",
    mainKeyword: "summer electric bill spikes",
    expandedKeywords: ["cooling load", "air conditioning kWh", "state electricity rates", "high summer bill"],
    category: "Seasonal bills",
    searchIntent: "Explain a sudden summer bill increase and give next steps.",
    readerLevel: "beginner",
    stateSlug: "texas",
    scheduledAt: "2026-06-07T00:00:00+09:00",
    date: "Jun 7, 2026",
    excerpt: "How cooling load turns average electric rates into a much larger monthly bill.",
    intro: "A summer electric bill spike usually comes from usage first and rate second. The same cents-per-kWh price can feel manageable in spring and painful in July because cooling hours multiply the number of kWh on the bill.",
    sections: [
      { heading: "Cooling drives usage", body: "Air conditioning is a long-duration load. A system that runs for several extra hours each day can add hundreds of kWh before the household notices a comfort change. That is why the first diagnostic is not the rate alone; it is whether monthly usage rose sharply from the shoulder season." },
      { heading: "Rate still matters", body: "A high-rate state turns the same cooling load into a larger bill. Use the estimator with the actual kWh from the bill, then compare the midpoint with the state benchmark to separate usage shock from rate shock." },
      { heading: "What to try first", body: "Seal obvious air leaks, replace dirty filters, shade high-sun windows, and raise the cooling setpoint a few degrees during the hottest window. If cash flow is the issue, ask the utility about budget billing before arrears grow." }
    ],
    faq: [
      { question: "Is a high summer bill always a rate increase?", answer: "No. In many homes the rate is stable while cooling usage rises. Check kWh before assuming the tariff changed." }
    ],
    internalLinks: [{ href: "/texas", label: "Texas electricity rates" }, { href: "/compare", label: "state comparison tool" }],
    externalSource: sourceMap.energystar,
    cta: { href: "/texas", label: "Estimate a Texas bill" },
    schemaType: "Article",
    qualityScore: 94,
    codexOnlyGeneration: true
  },
  {
    slug: "time-of-use-electric-rates",
    title: "Time-of-use electric rates: when they help and when they do not",
    subtitle: "Time-of-use electric rates compared with peak pricing, off-peak usage, and household bill risk",
    metaTitle: "Time-of-use electric rates: when they help",
    metaDescription: "Time-of-use electric rates explained with peak windows, off-peak shifts, household examples, and bill-risk checks.",
    mainKeyword: "time-of-use electric rates",
    expandedKeywords: ["TOU rates", "peak pricing", "off-peak electricity", "demand response"],
    category: "Rate plans",
    searchIntent: "Help a reader decide whether a time-of-use rate is suitable.",
    readerLevel: "intermediate",
    stateSlug: "california",
    scheduledAt: "2026-06-07T00:00:00+09:00",
    date: "Jun 7, 2026",
    excerpt: "A practical guide to peak windows, off-peak usage, and bill risk.",
    intro: "Time-of-use pricing rewards households that can move flexible loads away from peak windows. It can punish households whose largest loads happen exactly when the price is highest.",
    sections: [
      { heading: "What TOU means", body: "The price per kWh changes by hour or block of hours. A TOU plan can be useful when laundry, dishwashing, EV charging, or pool pumping can move to cheaper windows." },
      { heading: "Peak vs off-peak", body: "Peak windows can be several times more expensive than off-peak windows. The plan is not automatically good or bad; it depends on whether your actual usage can shift." },
      { heading: "Who should avoid it", body: "If someone works from home during the peak period, if medical equipment requires steady power, or if cooling cannot be shifted, a flat benchmark may be easier to manage." }
    ],
    faq: [{ question: "Do TOU rates always save money?", answer: "No. They save money only when enough usage moves to cheaper hours." }],
    internalLinks: [{ href: "/california", label: "California electricity rates" }, { href: "/methodology", label: "bill estimate methodology" }],
    externalSource: sourceMap.doe,
    cta: { href: "/california", label: "Estimate a California bill" },
    schemaType: "Article",
    qualityScore: 94,
    codexOnlyGeneration: true
  },
  {
    slug: "electric-bill-help",
    title: "What to do if you cannot pay your electric bill",
    subtitle: "Electric bill help options including LIHEAP, payment arrangements, and weatherization assistance",
    metaTitle: "Electric bill help: LIHEAP and payment options",
    metaDescription: "Electric bill help steps for LIHEAP, utility payment arrangements, budget billing, weatherization, and documents to prepare.",
    mainKeyword: "electric bill help",
    expandedKeywords: ["LIHEAP", "payment arrangement", "budget billing", "weatherization assistance"],
    category: "Assistance",
    searchIntent: "Show practical help steps for a household behind on bills.",
    readerLevel: "beginner",
    stateSlug: "california",
    scheduledAt: "2026-06-07T00:00:00+09:00",
    date: "Jun 7, 2026",
    excerpt: "LIHEAP, weatherization, budget billing, and the application steps to try first.",
    intro: "If the bill is already hard to pay, the best first move is to contact the utility before the account reaches a shutoff deadline. Then check assistance programs with the documents ready.",
    sections: [
      { heading: "Start before shutoff", body: "Ask about payment arrangements, hardship protections, and budget billing. A short call can preserve options that disappear once the account reaches a late-stage notice." },
      { heading: "Programs to check", body: "LIHEAP, weatherization assistance, local charities, and state energy offices solve different problems. One may cover emergency help while another lowers future energy use." },
      { heading: "Documents to gather", body: "Most programs ask for ID, income proof, account number, and a recent utility bill. Requirements vary by state and agency." }
    ],
    faq: [{ question: "Does LIHEAP pay every electric bill?", answer: "No. Eligibility, benefit size, timing, and funding vary by state and program year." }],
    internalLinks: [{ href: "/assistance/california", label: "California bill help" }, { href: "/blog", label: "electric bill blog" }],
    externalSource: sourceMap.liheap,
    cta: { href: "/assistance/california", label: "Check bill help options" },
    schemaType: "Article",
    qualityScore: 95,
    codexOnlyGeneration: true
  },
  {
    slug: "regulated-vs-deregulated-electricity",
    title: "Regulated vs deregulated electricity markets",
    subtitle: "Regulated and deregulated electricity markets compared for rates, shopping, and average bill benchmarks",
    metaTitle: "Regulated vs deregulated electricity markets",
    metaDescription: "Regulated vs deregulated electricity markets explained with average rate benchmarks, shopping caveats, and state page wording.",
    mainKeyword: "regulated vs deregulated electricity",
    expandedKeywords: ["competitive electricity market", "regulated utility", "retail electricity choice", "state rate benchmark"],
    category: "Market rules",
    searchIntent: "Explain why electricity shopping applies in some states but not others.",
    readerLevel: "intermediate",
    stateSlug: "texas",
    scheduledAt: "2026-06-07T00:00:00+09:00",
    date: "Jun 7, 2026",
    excerpt: "Why shopping language belongs on some state pages but not others.",
    intro: "Electricity market rules change what a consumer can do. Some states are mainly utility-regulated, while others allow retail supply shopping. Average rates are still useful, but the next step differs.",
    sections: [
      { heading: "Two market models", body: "Regulated states generally route pricing through utilities and public commissions. Competitive states separate supply choice from delivery service." },
      { heading: "Why wording matters", body: "A regulated state guide should not tell readers to shop for a plan if that is not how the state works. A competitive market guide should label the public-data number as a benchmark, not a selected offer." },
      { heading: "What stays comparable", body: "Average rate, usage, trend, and bill range still make a useful baseline across both market types. The benchmark helps people decide whether their bill is broadly normal." }
    ],
    faq: [{ question: "Can every household shop for electricity?", answer: "No. Retail choice depends on state and service territory rules." }],
    internalLinks: [{ href: "/texas", label: "Texas electricity rates" }, { href: "/compare", label: "compare electricity rates" }],
    externalSource: sourceMap.eia,
    cta: { href: "/compare", label: "Compare state benchmarks" },
    schemaType: "Article",
    qualityScore: 94,
    codexOnlyGeneration: true
  }
];

const topicSeeds: ArticleSeed[] = [
  { slug: "average-electric-bill-before-moving", title: "How to estimate an average electric bill before moving", mainKeyword: "average electric bill before moving", expandedKeywords: ["moving utility costs", "state electricity rate", "monthly kWh estimate", "new home energy budget"], category: "Moving", searchIntent: "Estimate a bill before choosing a home or apartment.", readerLevel: "beginner", stateSlug: "texas", format: "decision", source: "eia", angle: "relocation budgeting" },
  { slug: "apartment-electric-bill-first-month", title: "What your first apartment electric bill is trying to tell you", mainKeyword: "first apartment electric bill", expandedKeywords: ["apartment kWh usage", "renter electricity cost", "utility setup", "average monthly bill"], category: "Renters", searchIntent: "Help renters interpret a first bill.", readerLevel: "beginner", stateSlug: "california", format: "scenario", source: "energystar", angle: "renter first bill" },
  { slug: "electric-bill-for-small-house", title: "Small house electric bill benchmarks without false precision", mainKeyword: "small house electric bill", expandedKeywords: ["home size electricity use", "kWh per month", "residential rate", "bill estimate"], category: "Home size", searchIntent: "Benchmark a small home bill.", readerLevel: "beginner", stateSlug: "washington", format: "data-led", source: "eia", angle: "small home expectations" },
  { slug: "large-home-electric-bill-check", title: "Large home electric bill check: rate problem or usage problem", mainKeyword: "large home electric bill", expandedKeywords: ["high kWh usage", "HVAC electricity", "state rate benchmark", "home energy audit"], category: "Home size", searchIntent: "Diagnose a large home bill.", readerLevel: "intermediate", stateSlug: "texas", format: "troubleshooting", source: "energystar", angle: "large home diagnosis" },
  { slug: "electricity-cost-per-room", title: "Electricity cost per room is a useful shortcut if you know its limits", mainKeyword: "electricity cost per room", expandedKeywords: ["room-by-room energy use", "home office electricity", "bedroom kWh", "appliance load"], category: "Usage math", searchIntent: "Use room-level thinking without overclaiming.", readerLevel: "intermediate", stateSlug: "california", format: "glossary", source: "energystar", angle: "room-level budgeting" },
  { slug: "monthly-kwh-usage-normal-range", title: "What is a normal monthly kWh usage range for a home", mainKeyword: "normal monthly kWh usage", expandedKeywords: ["average kWh per month", "residential electricity use", "high electric usage", "bill estimator"], category: "Usage math", searchIntent: "Define normal usage range.", readerLevel: "beginner", stateSlug: "washington", format: "data-led", source: "eia", angle: "usage range" },
  { slug: "electric-bill-after-new-baby", title: "Why an electric bill can change after a new baby arrives", mainKeyword: "electric bill after new baby", expandedKeywords: ["laundry electricity use", "nursery heating", "family energy use", "monthly utility bill"], category: "Life changes", searchIntent: "Explain household change in usage.", readerLevel: "beginner", stateSlug: "texas", format: "scenario", source: "energystar", angle: "family routine shift" },
  { slug: "work-from-home-electric-bill", title: "Work-from-home electric bill changes that are easy to miss", mainKeyword: "work from home electric bill", expandedKeywords: ["home office power use", "daytime HVAC", "computer electricity cost", "TOU peak hours"], category: "Life changes", searchIntent: "Explain WFH bill changes.", readerLevel: "beginner", stateSlug: "california", format: "checklist", source: "doe", angle: "daytime occupancy" },
  { slug: "vacation-home-electric-bill", title: "Vacation home electric bills should be low but not zero", mainKeyword: "vacation home electric bill", expandedKeywords: ["standby electricity", "second home utility", "thermostat setting", "baseline kWh"], category: "Home type", searchIntent: "Explain standby bills for second homes.", readerLevel: "beginner", stateSlug: "washington", format: "troubleshooting", source: "energystar", angle: "empty home baseline" },
  { slug: "new-construction-electric-bill", title: "New construction electric bill surprises after the first season", mainKeyword: "new construction electric bill", expandedKeywords: ["efficient home electricity", "heat pump usage", "builder grade appliances", "seasonal kWh"], category: "Home type", searchIntent: "Explain why new homes still get high bills.", readerLevel: "intermediate", stateSlug: "texas", format: "mistakes", source: "energystar", angle: "new home assumptions" },
  { slug: "air-conditioner-electricity-cost", title: "Air conditioner electricity cost depends more on run time than size labels", mainKeyword: "air conditioner electricity cost", expandedKeywords: ["AC kWh", "cooling bill", "thermostat setting", "summer electricity usage"], category: "Appliances", searchIntent: "Estimate AC cost drivers.", readerLevel: "beginner", stateSlug: "texas", format: "howto", source: "energystar", angle: "cooling runtime" },
  { slug: "heat-pump-electric-bill-winter", title: "Heat pump electric bill in winter: what is normal and what is not", mainKeyword: "heat pump electric bill winter", expandedKeywords: ["auxiliary heat", "winter kWh", "electric heating cost", "heat pump efficiency"], category: "Heating", searchIntent: "Diagnose winter heat pump bills.", readerLevel: "intermediate", stateSlug: "washington", format: "troubleshooting", source: "energystar", angle: "winter heating" },
  { slug: "electric-water-heater-cost", title: "Electric water heater cost signs hidden in your monthly bill", mainKeyword: "electric water heater cost", expandedKeywords: ["water heating kWh", "hot water electricity", "tank temperature", "family utility bill"], category: "Appliances", searchIntent: "Identify water heater usage.", readerLevel: "beginner", stateSlug: "california", format: "checklist", source: "energystar", angle: "hot water load" },
  { slug: "clothes-dryer-electricity-cost", title: "Clothes dryer electricity cost is small daily and large monthly", mainKeyword: "clothes dryer electricity cost", expandedKeywords: ["dryer kWh", "laundry electricity", "heat pump dryer", "utility bill savings"], category: "Appliances", searchIntent: "Estimate laundry impact.", readerLevel: "beginner", stateSlug: "texas", format: "case", source: "energystar", angle: "laundry routine" },
  { slug: "refrigerator-electricity-cost", title: "Refrigerator electricity cost: the quiet load that never clocks out", mainKeyword: "refrigerator electricity cost", expandedKeywords: ["fridge kWh", "old refrigerator", "standby load", "energy efficient appliance"], category: "Appliances", searchIntent: "Explain continuous appliance load.", readerLevel: "beginner", stateSlug: "washington", format: "glossary", source: "energystar", angle: "always-on appliance" },
  { slug: "pool-pump-electricity-cost", title: "Pool pump electricity cost can dominate a warm-weather bill", mainKeyword: "pool pump electricity cost", expandedKeywords: ["pool pump kWh", "timer schedule", "variable speed pump", "summer bill"], category: "Appliances", searchIntent: "Reduce pool pump bill impact.", readerLevel: "intermediate", stateSlug: "california", format: "howto", source: "energystar", angle: "pool schedule" },
  { slug: "space-heater-electric-bill", title: "Space heater electric bill math before you plug in another one", mainKeyword: "space heater electric bill", expandedKeywords: ["portable heater kWh", "electric heating cost", "winter bill", "heater wattage"], category: "Heating", searchIntent: "Explain portable heater cost.", readerLevel: "beginner", stateSlug: "texas", format: "decision", source: "energystar", angle: "portable heat" },
  { slug: "ev-charging-electric-bill", title: "EV charging electric bill impact for households that charge at home", mainKeyword: "EV charging electric bill", expandedKeywords: ["home EV charging kWh", "electric vehicle utility bill", "off peak charging", "TOU rates"], category: "EV", searchIntent: "Estimate EV home charging impact.", readerLevel: "intermediate", stateSlug: "california", format: "comparison", source: "doe", angle: "home charging load" },
  { slug: "dishwasher-electricity-cost", title: "Dishwasher electricity cost is not just the wash cycle", mainKeyword: "dishwasher electricity cost", expandedKeywords: ["heated dry", "hot water energy", "kitchen appliance kWh", "energy saver mode"], category: "Appliances", searchIntent: "Explain dishwasher energy use.", readerLevel: "beginner", stateSlug: "washington", format: "mistakes", source: "energystar", angle: "kitchen load" },
  { slug: "dehumidifier-electricity-cost", title: "Dehumidifier electricity cost when humidity becomes a utility problem", mainKeyword: "dehumidifier electricity cost", expandedKeywords: ["dehumidifier kWh", "basement humidity", "summer electricity bill", "moisture control"], category: "Appliances", searchIntent: "Estimate dehumidifier load.", readerLevel: "intermediate", stateSlug: "texas", format: "scenario", source: "energystar", angle: "humidity load" },
  { slug: "electric-bill-after-solar", title: "Electric bill after solar: why a low bill can still have charges", mainKeyword: "electric bill after solar", expandedKeywords: ["solar utility bill", "net metering", "fixed charges", "minimum bill"], category: "Solar", searchIntent: "Explain solar bill remnants.", readerLevel: "intermediate", stateSlug: "california", format: "glossary", source: "eia", angle: "solar bill components" },
  { slug: "solar-with-heat-pump-bill", title: "Solar with a heat pump changes the electric bill tradeoff", mainKeyword: "solar heat pump electric bill", expandedKeywords: ["home electrification", "winter kWh", "solar offset", "heating load"], category: "Solar", searchIntent: "Explain combined solar and heat pump bills.", readerLevel: "advanced", stateSlug: "washington", format: "comparison", source: "energystar", angle: "electrification bundle" },
  { slug: "battery-backup-electric-bill", title: "Battery backup does not automatically lower an electric bill", mainKeyword: "battery backup electric bill", expandedKeywords: ["home battery", "time-of-use arbitrage", "solar storage", "backup power"], category: "Solar", searchIntent: "Clarify bill savings vs backup value.", readerLevel: "advanced", stateSlug: "california", format: "decision", source: "doe", angle: "backup versus savings" },
  { slug: "electric-panel-upgrade-bill", title: "Electric panel upgrades affect comfort before they affect the bill", mainKeyword: "electric panel upgrade bill", expandedKeywords: ["home electrification", "service panel", "EV charger", "heat pump"], category: "Electrification", searchIntent: "Explain panel upgrade bill expectations.", readerLevel: "intermediate", stateSlug: "texas", format: "case", source: "energystar", angle: "capacity not consumption" },
  { slug: "induction-stove-electricity-cost", title: "Induction stove electricity cost is usually not the bill villain", mainKeyword: "induction stove electricity cost", expandedKeywords: ["cooking electricity", "kitchen energy", "gas to electric", "appliance kWh"], category: "Electrification", searchIntent: "Put induction cooking in bill context.", readerLevel: "beginner", stateSlug: "washington", format: "data-led", source: "energystar", angle: "cooking load scale" },
  { slug: "electric-laundry-room-cost", title: "Electric laundry room cost: dryer, washer, water, and timing", mainKeyword: "electric laundry room cost", expandedKeywords: ["laundry electricity", "dryer load", "hot water kWh", "TOU laundry"], category: "Appliances", searchIntent: "Assess laundry room energy.", readerLevel: "beginner", stateSlug: "california", format: "checklist", source: "energystar", angle: "combined laundry loads" },
  { slug: "smart-thermostat-bill-savings", title: "Smart thermostat bill savings depend on what it changes", mainKeyword: "smart thermostat bill savings", expandedKeywords: ["HVAC schedule", "cooling savings", "heating savings", "thermostat setback"], category: "Efficiency", searchIntent: "Evaluate smart thermostat savings.", readerLevel: "beginner", stateSlug: "texas", format: "decision", source: "energystar", angle: "behavior change" },
  { slug: "attic-insulation-electric-bill", title: "Attic insulation and electric bills: why savings show up seasonally", mainKeyword: "attic insulation electric bill", expandedKeywords: ["home insulation", "cooling load", "heating load", "energy efficiency"], category: "Efficiency", searchIntent: "Explain insulation impact.", readerLevel: "intermediate", stateSlug: "washington", format: "scenario", source: "energystar", angle: "envelope upgrade" },
  { slug: "window-ac-vs-central-air-cost", title: "Window AC vs central air cost is a room-by-room decision", mainKeyword: "window AC vs central air cost", expandedKeywords: ["cooling electricity", "room AC", "central HVAC", "summer bill"], category: "Cooling", searchIntent: "Compare cooling options.", readerLevel: "intermediate", stateSlug: "california", format: "comparison", source: "energystar", angle: "targeted cooling" },
  { slug: "ceiling-fan-electricity-cost", title: "Ceiling fan electricity cost is tiny only if the thermostat changes", mainKeyword: "ceiling fan electricity cost", expandedKeywords: ["fan kWh", "cooling comfort", "thermostat setting", "summer savings"], category: "Cooling", searchIntent: "Explain fan savings caveat.", readerLevel: "beginner", stateSlug: "texas", format: "mistakes", source: "energystar", angle: "comfort versus cooling" },
  { slug: "bill-shock-after-rate-increase", title: "Bill shock after a rate increase: how to separate price from usage", mainKeyword: "bill shock after rate increase", expandedKeywords: ["electric rate increase", "usage change", "average bill", "state benchmark"], category: "Bill shock", searchIntent: "Diagnose a larger bill after rate news.", readerLevel: "intermediate", stateSlug: "california", format: "troubleshooting", source: "eia", angle: "price versus usage" },
  { slug: "delivery-charges-electric-bill", title: "Delivery charges on an electric bill are not the same as energy use", mainKeyword: "delivery charges electric bill", expandedKeywords: ["distribution charges", "utility delivery", "supply charges", "bill line items"], category: "Bill literacy", searchIntent: "Explain bill line items.", readerLevel: "intermediate", stateSlug: "texas", format: "glossary", source: "eia", angle: "line item literacy" },
  { slug: "fixed-fee-electric-bill", title: "Fixed fees on electric bills explain why low usage still costs money", mainKeyword: "fixed fee electric bill", expandedKeywords: ["basic service charge", "minimum bill", "low kWh bill", "utility customer charge"], category: "Bill literacy", searchIntent: "Explain fixed fees.", readerLevel: "beginner", stateSlug: "washington", format: "data-led", source: "eia", angle: "low usage bills" },
  { slug: "estimated-meter-reading-bill", title: "Estimated meter reading on an electric bill can hide the real trend", mainKeyword: "estimated meter reading electric bill", expandedKeywords: ["meter estimate", "actual reading", "billing correction", "usage spike"], category: "Bill literacy", searchIntent: "Troubleshoot estimated readings.", readerLevel: "beginner", stateSlug: "california", format: "troubleshooting", source: "eia", angle: "meter correction" },
  { slug: "budget-billing-pros-cons", title: "Budget billing pros and cons for electric bills that swing by season", mainKeyword: "budget billing pros and cons", expandedKeywords: ["levelized billing", "utility payment plan", "seasonal bills", "cash flow"], category: "Bill management", searchIntent: "Decide whether budget billing helps.", readerLevel: "beginner", stateSlug: "texas", format: "decision", source: "liheap", angle: "cash flow smoothing" },
  { slug: "electric-bill-past-due-plan", title: "Past-due electric bill plan: what to do before the balance grows", mainKeyword: "past-due electric bill plan", expandedKeywords: ["payment arrangement", "shutoff notice", "utility assistance", "LIHEAP"], category: "Assistance", searchIntent: "Create a plan for arrears.", readerLevel: "beginner", stateSlug: "california", format: "howto", source: "liheap", angle: "arrears triage" },
  { slug: "electric-bill-too-high-complaint", title: "When an electric bill seems too high, complain with evidence", mainKeyword: "electric bill too high complaint", expandedKeywords: ["dispute utility bill", "meter reading", "usage history", "billing error"], category: "Bill dispute", searchIntent: "Prepare a bill dispute.", readerLevel: "intermediate", stateSlug: "washington", format: "checklist", source: "eia", angle: "evidence-first dispute" },
  { slug: "utility-bill-audit-homeowner", title: "A homeowner utility bill audit starts with four boring numbers", mainKeyword: "utility bill audit homeowner", expandedKeywords: ["kWh usage", "rate per kWh", "billing period", "fixed charge"], category: "Bill audit", searchIntent: "Audit a bill using key numbers.", readerLevel: "intermediate", stateSlug: "texas", format: "howto", source: "eia", angle: "simple audit" },
  { slug: "electric-bill-after-smart-meter", title: "Electric bill after a smart meter: better data, same usage questions", mainKeyword: "electric bill after smart meter", expandedKeywords: ["smart meter data", "interval usage", "billing change", "usage pattern"], category: "Bill literacy", searchIntent: "Explain smart meter bill concerns.", readerLevel: "intermediate", stateSlug: "california", format: "scenario", source: "doe", angle: "interval data" },
  { slug: "why-electric-rate-average-misleads", title: "Why an average electric rate can mislead without usage context", mainKeyword: "average electric rate misleading", expandedKeywords: ["cents per kWh", "average bill", "fixed fees", "usage level"], category: "Methodology", searchIntent: "Explain limitations of average rates.", readerLevel: "advanced", stateSlug: "washington", format: "data-led", source: "eia", angle: "data limitation" },
  { slug: "state-electricity-rankings-explained", title: "State electricity rankings explained without turning them into claims", mainKeyword: "state electricity rankings explained", expandedKeywords: ["cheapest electricity states", "expensive electricity states", "EIA rates", "state comparison"], category: "Methodology", searchIntent: "Explain rankings caveats.", readerLevel: "intermediate", stateSlug: "texas", format: "glossary", source: "eia", angle: "ranking caveats" },
  { slug: "cheapest-electricity-state-not-cheapest-bill", title: "The cheapest electricity state may not give you the cheapest bill", mainKeyword: "cheapest electricity state bill", expandedKeywords: ["low rate high usage", "state comparison", "average electric bill", "climate load"], category: "Comparisons", searchIntent: "Explain rate versus bill ranking.", readerLevel: "beginner", stateSlug: "washington", format: "comparison", source: "eia", angle: "rate versus bill" },
  { slug: "high-electric-rate-low-usage", title: "High electric rate, low usage: why the bill can still look normal", mainKeyword: "high electric rate low usage", expandedKeywords: ["California electricity usage", "mild climate", "average bill", "cents per kWh"], category: "Comparisons", searchIntent: "Explain high rate but moderate bill.", readerLevel: "beginner", stateSlug: "california", format: "scenario", source: "eia", angle: "usage offsets rate" },
  { slug: "low-electric-rate-high-usage", title: "Low electric rate, high usage: the hidden bill risk in cheap states", mainKeyword: "low electric rate high usage", expandedKeywords: ["cheap electricity states", "high kWh", "heating load", "average bill"], category: "Comparisons", searchIntent: "Explain usage risk in low-rate states.", readerLevel: "beginner", stateSlug: "washington", format: "case", source: "eia", angle: "usage overwhelms rate" },
  { slug: "neighbor-electric-bill-comparison", title: "Comparing your electric bill to a neighbor can lead you wrong", mainKeyword: "neighbor electric bill comparison", expandedKeywords: ["home energy use", "bill benchmark", "appliance differences", "household size"], category: "Comparisons", searchIntent: "Explain why neighbor comparisons fail.", readerLevel: "beginner", stateSlug: "texas", format: "mistakes", source: "energystar", angle: "bad comparison" },
  { slug: "electric-bill-per-square-foot", title: "Electric bill per square foot is helpful only after climate is considered", mainKeyword: "electric bill per square foot", expandedKeywords: ["home size electricity", "climate zone", "kWh per square foot", "bill estimate"], category: "Comparisons", searchIntent: "Use square-foot metric carefully.", readerLevel: "intermediate", stateSlug: "california", format: "data-led", source: "eia", angle: "size metric caveat" },
  { slug: "electric-bill-for-renters-vs-owners", title: "Renters vs owners: why electric bills behave differently", mainKeyword: "renters vs owners electric bill", expandedKeywords: ["renter utility bill", "homeowner energy upgrades", "apartment electricity", "insulation"], category: "Renters", searchIntent: "Compare renters and owners.", readerLevel: "beginner", stateSlug: "washington", format: "comparison", source: "energystar", angle: "control over upgrades" },
  { slug: "shared-meter-electric-bill", title: "Shared meter electric bill warning signs for renters", mainKeyword: "shared meter electric bill", expandedKeywords: ["renter utility issue", "apartment meter", "electric bill dispute", "landlord utility"], category: "Renters", searchIntent: "Spot possible shared meter problems.", readerLevel: "intermediate", stateSlug: "texas", format: "checklist", source: "eia", angle: "renter protection" },
  { slug: "landlord-included-electricity", title: "Electricity included in rent is not always a good deal", mainKeyword: "electricity included in rent", expandedKeywords: ["utility included rent", "apartment energy cost", "renter lease", "average electric bill"], category: "Renters", searchIntent: "Assess included utility rent.", readerLevel: "beginner", stateSlug: "california", format: "decision", source: "eia", angle: "lease tradeoff" },
  { slug: "roommate-electric-bill-split", title: "Roommate electric bill split: fair methods that avoid arguments", mainKeyword: "roommate electric bill split", expandedKeywords: ["shared utility bill", "apartment electricity", "roommate expenses", "kWh usage"], category: "Renters", searchIntent: "Choose a fair split method.", readerLevel: "beginner", stateSlug: "washington", format: "howto", source: "eia", angle: "shared household rules" },
  { slug: "college-apartment-electric-bill", title: "College apartment electric bill basics students learn too late", mainKeyword: "college apartment electric bill", expandedKeywords: ["student utility bill", "first apartment electricity", "roommate bill", "renter kWh"], category: "Renters", searchIntent: "Guide students on utility bills.", readerLevel: "beginner", stateSlug: "texas", format: "scenario", source: "energystar", angle: "student housing" },
  { slug: "mobile-home-electric-bill", title: "Mobile home electric bills often reveal insulation problems first", mainKeyword: "mobile home electric bill", expandedKeywords: ["manufactured home energy", "insulation", "HVAC load", "weatherization"], category: "Home type", searchIntent: "Explain mobile home bills.", readerLevel: "beginner", stateSlug: "california", format: "troubleshooting", source: "liheap", angle: "weatherization need" },
  { slug: "older-home-electric-bill", title: "Older home electric bill problems usually start with the envelope", mainKeyword: "older home electric bill", expandedKeywords: ["drafty home", "insulation", "HVAC usage", "energy audit"], category: "Home type", searchIntent: "Diagnose old home costs.", readerLevel: "intermediate", stateSlug: "washington", format: "checklist", source: "energystar", angle: "envelope-first diagnosis" },
  { slug: "all-electric-home-bill", title: "All-electric home bill expectations after gas appliances disappear", mainKeyword: "all-electric home bill", expandedKeywords: ["home electrification", "heat pump", "electric water heater", "monthly kWh"], category: "Electrification", searchIntent: "Explain all-electric home bills.", readerLevel: "intermediate", stateSlug: "texas", format: "comparison", source: "energystar", angle: "fuel switching" },
  { slug: "electric-bill-after-adding-ev", title: "Electric bill after adding an EV: what changes and what should not", mainKeyword: "electric bill after adding EV", expandedKeywords: ["EV charging kWh", "home charging cost", "off peak charging", "utility bill"], category: "EV", searchIntent: "Prepare for EV bill changes.", readerLevel: "intermediate", stateSlug: "california", format: "case", source: "doe", angle: "new load" },
  { slug: "ev-charging-off-peak-worth-it", title: "Is off-peak EV charging worth changing your routine", mainKeyword: "off-peak EV charging worth it", expandedKeywords: ["time-of-use EV rate", "home charging", "peak hours", "electric vehicle bill"], category: "EV", searchIntent: "Evaluate off-peak EV charging.", readerLevel: "intermediate", stateSlug: "washington", format: "decision", source: "doe", angle: "routine tradeoff" },
  { slug: "level-2-charger-electric-bill", title: "Level 2 charger electric bill myths that confuse new EV owners", mainKeyword: "Level 2 charger electric bill", expandedKeywords: ["EV charger kWh", "charging speed", "home utility bill", "electric vehicle charging"], category: "EV", searchIntent: "Clarify charger speed vs energy cost.", readerLevel: "beginner", stateSlug: "texas", format: "mistakes", source: "doe", angle: "power versus energy" },
  { slug: "heat-pump-water-heater-bill", title: "Heat pump water heater bill savings depend on the room around it", mainKeyword: "heat pump water heater bill", expandedKeywords: ["water heater efficiency", "basement temperature", "electric water heating", "home energy savings"], category: "Efficiency", searchIntent: "Explain heat pump water heater savings.", readerLevel: "intermediate", stateSlug: "california", format: "scenario", source: "energystar", angle: "equipment context" },
  { slug: "weatherization-electric-bill", title: "Weatherization electric bill savings are quiet but durable", mainKeyword: "weatherization electric bill", expandedKeywords: ["air sealing", "insulation", "LIHEAP weatherization", "energy efficiency"], category: "Assistance", searchIntent: "Explain weatherization value.", readerLevel: "beginner", stateSlug: "washington", format: "howto", source: "liheap", angle: "durable assistance" },
  { slug: "liheap-electric-bill-documents", title: "LIHEAP electric bill documents to gather before you apply", mainKeyword: "LIHEAP electric bill documents", expandedKeywords: ["energy assistance application", "income proof", "utility bill help", "household documents"], category: "Assistance", searchIntent: "Prepare LIHEAP application documents.", readerLevel: "beginner", stateSlug: "texas", format: "checklist", source: "liheap", angle: "application readiness" },
  { slug: "electric-bill-hardship-letter", title: "Electric bill hardship letter: what to include and what to avoid", mainKeyword: "electric bill hardship letter", expandedKeywords: ["utility payment arrangement", "hardship request", "past due bill", "shutoff prevention"], category: "Assistance", searchIntent: "Write a hardship request.", readerLevel: "beginner", stateSlug: "california", format: "howto", source: "liheap", angle: "communication" },
  { slug: "shutoff-notice-electric-bill", title: "Shutoff notice for an electric bill: the order to act in", mainKeyword: "shutoff notice electric bill", expandedKeywords: ["utility disconnection", "payment plan", "energy assistance", "arrears"], category: "Assistance", searchIntent: "Prioritize actions after a notice.", readerLevel: "beginner", stateSlug: "washington", format: "troubleshooting", source: "liheap", angle: "urgent triage" },
  { slug: "energy-assistance-vs-budget-billing", title: "Energy assistance vs budget billing: two tools for different problems", mainKeyword: "energy assistance vs budget billing", expandedKeywords: ["LIHEAP", "levelized billing", "past due bill", "monthly utility payment"], category: "Assistance", searchIntent: "Compare help options.", readerLevel: "beginner", stateSlug: "texas", format: "comparison", source: "liheap", angle: "cash versus affordability" },
  { slug: "low-income-electric-bill-help", title: "Low-income electric bill help should start before the emergency", mainKeyword: "low-income electric bill help", expandedKeywords: ["LIHEAP", "weatherization", "utility assistance", "payment arrangement"], category: "Assistance", searchIntent: "Explain help options for low-income households.", readerLevel: "beginner", stateSlug: "california", format: "scenario", source: "liheap", angle: "early action" },
  { slug: "senior-electric-bill-assistance", title: "Senior electric bill assistance: questions to ask before applying", mainKeyword: "senior electric bill assistance", expandedKeywords: ["LIHEAP seniors", "fixed income utility bill", "energy assistance", "payment plan"], category: "Assistance", searchIntent: "Guide seniors/fixed-income households.", readerLevel: "beginner", stateSlug: "washington", format: "checklist", source: "liheap", angle: "fixed income" },
  { slug: "medical-equipment-electric-bill", title: "Medical equipment electric bill concerns need a different checklist", mainKeyword: "medical equipment electric bill", expandedKeywords: ["life support electricity", "utility medical baseline", "power reliability", "assistance program"], category: "Assistance", searchIntent: "Guide households with medical equipment.", readerLevel: "intermediate", stateSlug: "texas", format: "checklist", source: "liheap", angle: "medical load" },
  { slug: "electric-bill-help-for-renters", title: "Electric bill help for renters when the lease limits your options", mainKeyword: "electric bill help for renters", expandedKeywords: ["renter utility assistance", "LIHEAP", "landlord utility", "apartment bill"], category: "Assistance", searchIntent: "Help renters find options.", readerLevel: "beginner", stateSlug: "california", format: "decision", source: "liheap", angle: "limited control" },
  { slug: "utility-payment-arrangement-mistakes", title: "Utility payment arrangement mistakes that make the next bill harder", mainKeyword: "utility payment arrangement mistakes", expandedKeywords: ["past due electric bill", "payment plan", "budget billing", "arrears"], category: "Assistance", searchIntent: "Avoid payment plan errors.", readerLevel: "beginner", stateSlug: "washington", format: "mistakes", source: "liheap", angle: "payment plan pitfalls" },
  { slug: "electric-rate-increase-news-check", title: "Electric rate increase news: what to check before worrying", mainKeyword: "electric rate increase news", expandedKeywords: ["rate hike", "average bill", "public utility commission", "EIA data"], category: "Rate changes", searchIntent: "Interpret rate hike news.", readerLevel: "intermediate", stateSlug: "texas", format: "checklist", source: "eia", angle: "news literacy" },
  { slug: "utility-rate-case-explained", title: "Utility rate case explained for people who only see the bill", mainKeyword: "utility rate case explained", expandedKeywords: ["public utility commission", "rate increase", "electric bill", "regulated utility"], category: "Rate changes", searchIntent: "Explain rate cases.", readerLevel: "intermediate", stateSlug: "california", format: "glossary", source: "eia", angle: "regulatory process" },
  { slug: "transmission-costs-electric-bill", title: "Transmission costs on electric bills are invisible until rates rise", mainKeyword: "transmission costs electric bill", expandedKeywords: ["grid investment", "utility rates", "delivery charges", "electric infrastructure"], category: "Rate changes", searchIntent: "Explain grid cost drivers.", readerLevel: "advanced", stateSlug: "washington", format: "data-led", source: "eia", angle: "grid cost" },
  { slug: "wildfire-costs-electric-rates", title: "Wildfire costs and electric rates: why some bills carry risk spending", mainKeyword: "wildfire costs electric rates", expandedKeywords: ["utility wildfire mitigation", "California rates", "grid hardening", "electric bill"], category: "Rate changes", searchIntent: "Explain wildfire cost pressure.", readerLevel: "advanced", stateSlug: "california", format: "case", source: "eia", angle: "risk spending" },
  { slug: "fuel-cost-adjustment-electric-bill", title: "Fuel cost adjustment on an electric bill can move faster than base rates", mainKeyword: "fuel cost adjustment electric bill", expandedKeywords: ["power cost adjustment", "fuel rider", "utility bill line item", "rate volatility"], category: "Bill literacy", searchIntent: "Explain fuel adjustment charges.", readerLevel: "intermediate", stateSlug: "texas", format: "glossary", source: "eia", angle: "variable charges" },
  { slug: "demand-charge-home-electric-bill", title: "Demand charge on a home electric bill: rare, but worth understanding", mainKeyword: "demand charge home electric bill", expandedKeywords: ["peak demand", "kW charge", "residential demand rate", "TOU billing"], category: "Rate plans", searchIntent: "Explain residential demand charges.", readerLevel: "advanced", stateSlug: "washington", format: "glossary", source: "doe", angle: "peak power" },
  { slug: "community-choice-electric-bill", title: "Community choice electric bills need a supply-and-delivery reading", mainKeyword: "community choice electric bill", expandedKeywords: ["CCA bill", "supply charge", "delivery charge", "California electricity"], category: "Market rules", searchIntent: "Explain CCA bills.", readerLevel: "intermediate", stateSlug: "california", format: "troubleshooting", source: "eia", angle: "supply split" },
  { slug: "municipal-utility-electric-rates", title: "Municipal utility electric rates can look different for good reasons", mainKeyword: "municipal utility electric rates", expandedKeywords: ["public power", "city utility", "average rate", "utility benchmark"], category: "Utility types", searchIntent: "Explain municipal utilities.", readerLevel: "intermediate", stateSlug: "washington", format: "comparison", source: "eia", angle: "utility ownership" },
  { slug: "rural-electric-coop-bill", title: "Rural electric co-op bills reflect distance as much as demand", mainKeyword: "rural electric co-op bill", expandedKeywords: ["electric cooperative", "distribution cost", "rural utility", "average rate"], category: "Utility types", searchIntent: "Explain co-op bill structure.", readerLevel: "intermediate", stateSlug: "texas", format: "data-led", source: "eia", angle: "rural delivery" },
  { slug: "investor-owned-utility-rates", title: "Investor-owned utility rates: what the average customer should know", mainKeyword: "investor-owned utility rates", expandedKeywords: ["IOU electricity", "regulated rates", "utility benchmark", "rate case"], category: "Utility types", searchIntent: "Explain IOU rates.", readerLevel: "intermediate", stateSlug: "california", format: "glossary", source: "eia", angle: "regulated business model" },
  { slug: "public-power-electric-bill", title: "Public power electric bills: why local ownership does not guarantee cheap", mainKeyword: "public power electric bill", expandedKeywords: ["municipal utility", "public power rates", "local utility", "average bill"], category: "Utility types", searchIntent: "Set expectations for public power.", readerLevel: "intermediate", stateSlug: "washington", format: "mistakes", source: "eia", angle: "ownership caveat" },
  { slug: "texas-delivery-charges", title: "Texas delivery charges: why shopping plans does not erase wires costs", mainKeyword: "Texas delivery charges", expandedKeywords: ["TDU charges", "Oncor delivery", "CenterPoint delivery", "Texas electric bill"], category: "Texas", searchIntent: "Explain Texas delivery charges.", readerLevel: "intermediate", stateSlug: "texas", format: "glossary", source: "eia", angle: "competitive market line items" },
  { slug: "california-baseline-electricity", title: "California baseline electricity allowances can confuse bill comparisons", mainKeyword: "California baseline electricity", expandedKeywords: ["baseline allowance", "tiered rates", "California electric bill", "kWh allowance"], category: "California", searchIntent: "Explain baseline allowances.", readerLevel: "intermediate", stateSlug: "california", format: "troubleshooting", source: "eia", angle: "tiered context" },
  { slug: "washington-hydropower-electric-rates", title: "Washington hydropower and electric rates: cheap does not mean simple", mainKeyword: "Washington hydropower electric rates", expandedKeywords: ["hydroelectric power", "Washington electricity", "public power", "low rates"], category: "Washington", searchIntent: "Explain Washington rate context.", readerLevel: "intermediate", stateSlug: "washington", format: "data-led", source: "eia", angle: "hydro context" },
  { slug: "florida-air-conditioning-electric-bill", title: "Florida air conditioning electric bill planning for long cooling seasons", mainKeyword: "Florida air conditioning electric bill", expandedKeywords: ["cooling season", "summer kWh", "Florida electricity rates", "HVAC usage"], category: "State guides", searchIntent: "Plan Florida cooling bills.", readerLevel: "beginner", stateSlug: "texas", format: "scenario", source: "energystar", angle: "long cooling season" },
  { slug: "new-york-apartment-electric-bill", title: "New York apartment electric bill expectations for renters", mainKeyword: "New York apartment electric bill", expandedKeywords: ["NY electricity rates", "apartment kWh", "renter utility", "winter electric bill"], category: "State guides", searchIntent: "Set expectations for NY renters.", readerLevel: "beginner", stateSlug: "california", format: "decision", source: "eia", angle: "urban apartment" },
  { slug: "massachusetts-winter-electric-bill", title: "Massachusetts winter electric bill checks before blaming the rate", mainKeyword: "Massachusetts winter electric bill", expandedKeywords: ["winter kWh", "electric heating", "high rates", "heat pump"], category: "State guides", searchIntent: "Diagnose MA winter bills.", readerLevel: "intermediate", stateSlug: "washington", format: "troubleshooting", source: "energystar", angle: "cold climate" },
  { slug: "hawaii-electric-bill-benchmark", title: "Hawaii electric bill benchmarks require rate and usage humility", mainKeyword: "Hawaii electric bill benchmark", expandedKeywords: ["high electricity rates", "island grid", "average bill", "state comparison"], category: "State guides", searchIntent: "Explain Hawaii benchmark limits.", readerLevel: "intermediate", stateSlug: "california", format: "data-led", source: "eia", angle: "extreme rate context" },
  { slug: "north-dakota-electricity-cheap", title: "North Dakota electricity is cheap, but winter usage still matters", mainKeyword: "North Dakota cheap electricity", expandedKeywords: ["low electricity rates", "winter usage", "state ranking", "average bill"], category: "State guides", searchIntent: "Explain cheap state bill caveat.", readerLevel: "beginner", stateSlug: "washington", format: "comparison", source: "eia", angle: "cheap rate caveat" },
  { slug: "connecticut-electric-bill-high", title: "Connecticut electric bills feel high for more than one reason", mainKeyword: "Connecticut electric bill high", expandedKeywords: ["high electricity rates", "delivery charges", "state comparison", "average bill"], category: "State guides", searchIntent: "Explain CT bill pressure.", readerLevel: "intermediate", stateSlug: "california", format: "case", source: "eia", angle: "multi-cause high bill" },
  { slug: "illinois-electric-choice-bill", title: "Illinois electric choice bills need a benchmark before shopping", mainKeyword: "Illinois electric choice bill", expandedKeywords: ["retail electric supplier", "Illinois rates", "supply charge", "average bill"], category: "State guides", searchIntent: "Explain IL choice context.", readerLevel: "intermediate", stateSlug: "texas", format: "decision", source: "eia", angle: "shopping benchmark" },
  { slug: "nebraska-public-power-rates", title: "Nebraska public power rates and the limits of state averages", mainKeyword: "Nebraska public power rates", expandedKeywords: ["public power", "low electricity rates", "state average", "utility benchmark"], category: "State guides", searchIntent: "Explain NE public power context.", readerLevel: "intermediate", stateSlug: "washington", format: "data-led", source: "eia", angle: "public power nuance" },
  { slug: "louisiana-electric-bill-summer", title: "Louisiana summer electric bills: humidity changes the math", mainKeyword: "Louisiana summer electric bill", expandedKeywords: ["humidity load", "air conditioning", "summer kWh", "average bill"], category: "State guides", searchIntent: "Explain LA summer usage.", readerLevel: "beginner", stateSlug: "texas", format: "scenario", source: "energystar", angle: "humidity and cooling" },
  { slug: "idaho-electric-bill-low-rate", title: "Idaho electric bills show why low rates still need usage checks", mainKeyword: "Idaho electric bill low rate", expandedKeywords: ["cheap electricity", "state benchmark", "monthly kWh", "average bill"], category: "State guides", searchIntent: "Explain low-rate state checks.", readerLevel: "beginner", stateSlug: "washington", format: "checklist", source: "eia", angle: "low-rate discipline" },
  { slug: "electric-bill-calculator-inputs", title: "Electric bill calculator inputs that matter more than ZIP code", mainKeyword: "electric bill calculator inputs", expandedKeywords: ["kWh usage", "cents per kWh", "state rates", "bill estimate"], category: "Tools", searchIntent: "Explain calculator inputs.", readerLevel: "beginner", stateSlug: "texas", format: "howto", source: "eia", angle: "input quality" },
  { slug: "kwh-to-dollars-electric-bill", title: "kWh to dollars: the electric bill conversion everyone should know", mainKeyword: "kWh to dollars electric bill", expandedKeywords: ["cents per kWh", "monthly usage", "bill estimate", "electricity rate"], category: "Tools", searchIntent: "Teach kWh conversion.", readerLevel: "beginner", stateSlug: "california", format: "glossary", source: "eia", angle: "basic math" },
  { slug: "electricity-rate-vs-electric-bill", title: "Electricity rate vs electric bill: the difference that prevents panic", mainKeyword: "electricity rate vs electric bill", expandedKeywords: ["cents per kWh", "monthly bill", "usage", "fixed fees"], category: "Tools", searchIntent: "Define rate vs bill.", readerLevel: "beginner", stateSlug: "washington", format: "comparison", source: "eia", angle: "concept separation" },
  { slug: "average-bill-range-not-single-number", title: "Why a good average bill estimate should be a range", mainKeyword: "average bill estimate range", expandedKeywords: ["electric bill estimate", "fixed fees", "TOU pricing", "state average"], category: "Methodology", searchIntent: "Explain range estimates.", readerLevel: "intermediate", stateSlug: "texas", format: "data-led", source: "eia", angle: "honest uncertainty" },
  { slug: "electric-bill-estimator-mistakes", title: "Electric bill estimator mistakes that produce fake precision", mainKeyword: "electric bill estimator mistakes", expandedKeywords: ["average rate", "kWh estimate", "fixed fees", "bill calculator"], category: "Tools", searchIntent: "Avoid calculator mistakes.", readerLevel: "intermediate", stateSlug: "california", format: "mistakes", source: "eia", angle: "precision warning" },
  { slug: "monthly-usage-slider-guide", title: "Monthly usage slider guide for estimating a realistic electric bill", mainKeyword: "monthly usage slider electric bill", expandedKeywords: ["kWh slider", "average usage", "low high usage", "bill estimator"], category: "Tools", searchIntent: "Use usage slider correctly.", readerLevel: "beginner", stateSlug: "washington", format: "howto", source: "eia", angle: "tool usage" },
  { slug: "electric-bill-normal-check", title: "Is my electric bill normal? A calmer way to check", mainKeyword: "is my electric bill normal", expandedKeywords: ["average electric bill", "state benchmark", "kWh usage", "bill comparison"], category: "Tools", searchIntent: "Quick normality check.", readerLevel: "beginner", stateSlug: "texas", format: "checklist", source: "eia", angle: "bill reassurance" },
  { slug: "high-kwh-low-rate-diagnosis", title: "High kWh and low rate: the diagnosis most people skip", mainKeyword: "high kWh low rate", expandedKeywords: ["usage problem", "electric bill", "state rate", "appliance load"], category: "Tools", searchIntent: "Diagnose high usage.", readerLevel: "intermediate", stateSlug: "california", format: "troubleshooting", source: "energystar", angle: "usage-first audit" },
  { slug: "low-kwh-high-bill-diagnosis", title: "Low kWh and high bill: fees, rates, and billing periods to check", mainKeyword: "low kWh high electric bill", expandedKeywords: ["fixed charges", "high rate", "billing period", "utility bill"], category: "Tools", searchIntent: "Diagnose low usage high bill.", readerLevel: "intermediate", stateSlug: "washington", format: "troubleshooting", source: "eia", angle: "line item audit" },
  { slug: "electric-bill-comparison-table", title: "Electric bill comparison tables work best when they include usage", mainKeyword: "electric bill comparison table", expandedKeywords: ["state comparison", "average bill", "kWh usage", "electricity rates"], category: "Tools", searchIntent: "Explain comparison tables.", readerLevel: "intermediate", stateSlug: "texas", format: "data-led", source: "eia", angle: "table design" },
  { slug: "home-energy-audit-before-upgrades", title: "Do a home energy audit before buying expensive upgrades", mainKeyword: "home energy audit before upgrades", expandedKeywords: ["electric bill savings", "air sealing", "appliance upgrade", "HVAC load"], category: "Efficiency", searchIntent: "Prioritize upgrades.", readerLevel: "intermediate", stateSlug: "california", format: "decision", source: "energystar", angle: "audit before spending" },
  { slug: "no-cost-electric-bill-cuts", title: "No-cost electric bill cuts that do not require a new appliance", mainKeyword: "no-cost electric bill cuts", expandedKeywords: ["lower electricity usage", "thermostat setting", "laundry habits", "energy savings"], category: "Efficiency", searchIntent: "Find no-cost savings.", readerLevel: "beginner", stateSlug: "washington", format: "checklist", source: "energystar", angle: "behavior first" },
  { slug: "cheap-energy-upgrades-under-50", title: "Cheap energy upgrades under $50 that can still change a bill", mainKeyword: "cheap energy upgrades under 50", expandedKeywords: ["weatherstripping", "LED bulbs", "smart plugs", "electric bill savings"], category: "Efficiency", searchIntent: "Find low-cost upgrades.", readerLevel: "beginner", stateSlug: "texas", format: "checklist", source: "energystar", angle: "small upgrades" },
  { slug: "electric-bill-savings-that-backfire", title: "Electric bill savings ideas that backfire in real homes", mainKeyword: "electric bill savings backfire", expandedKeywords: ["energy saving mistakes", "comfort tradeoff", "TOU mistakes", "appliance myths"], category: "Efficiency", searchIntent: "Avoid bad savings advice.", readerLevel: "intermediate", stateSlug: "california", format: "mistakes", source: "energystar", angle: "bad advice" },
  { slug: "energy-efficient-appliance-payback", title: "Energy-efficient appliance payback starts with your actual kWh", mainKeyword: "energy efficient appliance payback", expandedKeywords: ["appliance savings", "kWh reduction", "ENERGY STAR", "electric bill"], category: "Efficiency", searchIntent: "Evaluate appliance payback.", readerLevel: "intermediate", stateSlug: "washington", format: "decision", source: "energystar", angle: "payback realism" },
  { slug: "led-lighting-electric-bill", title: "LED lighting electric bill savings are real but rarely the whole story", mainKeyword: "LED lighting electric bill", expandedKeywords: ["lighting kWh", "energy efficient bulbs", "home electricity savings", "appliance loads"], category: "Efficiency", searchIntent: "Set LED savings expectations.", readerLevel: "beginner", stateSlug: "texas", format: "comparison", source: "energystar", angle: "lighting scale" },
  { slug: "phantom-load-electric-bill", title: "Phantom load electric bill myths: what standby power can and cannot do", mainKeyword: "phantom load electric bill", expandedKeywords: ["standby power", "smart plugs", "always-on devices", "home energy use"], category: "Efficiency", searchIntent: "Explain standby loads.", readerLevel: "beginner", stateSlug: "california", format: "glossary", source: "energystar", angle: "standby reality" },
  { slug: "thermostat-setting-electric-bill", title: "Thermostat settings and electric bills: the comfort tradeoff in plain numbers", mainKeyword: "thermostat setting electric bill", expandedKeywords: ["cooling setpoint", "heating setpoint", "HVAC runtime", "energy savings"], category: "Efficiency", searchIntent: "Understand thermostat effect.", readerLevel: "beginner", stateSlug: "washington", format: "howto", source: "energystar", angle: "setpoint tradeoff" },
  { slug: "air-filter-electric-bill", title: "Dirty air filters can raise an electric bill without looking dramatic", mainKeyword: "dirty air filter electric bill", expandedKeywords: ["HVAC efficiency", "filter replacement", "cooling cost", "heating cost"], category: "Efficiency", searchIntent: "Explain filter impact.", readerLevel: "beginner", stateSlug: "texas", format: "scenario", source: "energystar", angle: "maintenance load" },
  { slug: "energy-saving-priority-order", title: "Energy-saving priority order for households with one weekend to act", mainKeyword: "energy saving priority order", expandedKeywords: ["lower electric bill", "home energy checklist", "HVAC savings", "appliance usage"], category: "Efficiency", searchIntent: "Prioritize quick actions.", readerLevel: "beginner", stateSlug: "california", format: "howto", source: "energystar", angle: "weekend plan" }
];

function scheduleAt(index: number) {
  return new Date(new Date(firstScheduledAt).getTime() + index * fiveHours).toISOString();
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "Asia/Seoul" }).format(new Date(value));
}

function stateName(slug: string) {
  return states.find((state) => state.slug === slug)?.name || "your state";
}

function firstExpandedKeyword(seed: ArticleSeed) {
  return seed.expandedKeywords[0] || seed.mainKeyword;
}

function secondExpandedKeyword(seed: ArticleSeed) {
  return seed.expandedKeywords[1] || seed.mainKeyword;
}

function articleTitle(seed: ArticleSeed) {
  const base = seed.title.toLowerCase().includes(seed.mainKeyword.toLowerCase()) ? seed.title : `${seed.title} for ${seed.mainKeyword}`;
  const expanded = firstExpandedKeyword(seed);
  if (base.toLowerCase().includes(expanded.toLowerCase())) return base;
  const variants = [
    `${base} using ${expanded}`,
    `${base} with ${expanded}`,
    `${base}: ${expanded}`,
    `${base} when ${expanded} matters`
  ];
  return variants[seed.slug.length % variants.length];
}

function articleSubtitle(seed: ArticleSeed) {
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const third = seed.expandedKeywords[2] || seed.category.toLowerCase();
  const variants = [
    `${seed.mainKeyword} explained through ${first}, ${second}, and ${third} so the next bill decision is easier.`,
    `A practical ${seed.mainKeyword} guide connecting ${first}, ${second}, and ${third} with bill-reading steps.`,
    `How ${seed.mainKeyword} changes when ${first}, ${second}, and ${third} are read together instead of separately.`,
    `${seed.mainKeyword} in plain language, with ${first}, ${second}, and ${third} turned into actions.`
  ];
  return variants[seed.title.length % variants.length];
}

function answerSummary(seed: ArticleSeed) {
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const variants = [
    `${seed.mainKeyword} should be judged by kWh first, then by ${first} and ${second}; that order keeps the answer practical instead of dramatic.`,
    `A useful answer to ${seed.mainKeyword} compares the actual bill with ${first}, then checks whether ${second} explains the difference.`,
    `The safest reading of ${seed.mainKeyword} is a two-step check: confirm the usage pattern, then use ${first} and ${second} to choose the next action.`,
    `${seed.mainKeyword} is not a single number. It is a bill-reading question shaped by ${first}, ${second}, and the local benchmark.`
  ];
  return variants[seed.slug.length % variants.length];
}

function highlight(seed: ArticleSeed) {
  const variants = [
    `Reader takeaway: do not spend money until the bill shows whether ${firstExpandedKeyword(seed)} or ${secondExpandedKeyword(seed)} is actually driving the change.`,
    `Best use: treat this guide as a diagnostic note for ${seed.searchIntent.toLowerCase()} before changing plans, equipment, or payment strategy.`,
    `Evidence check: ${sourceMap[seed.source].label} supports the public-data context, while your own bill decides the household-specific answer.`,
    `Practical limit: ${seed.mainKeyword} can point you toward a better question, but it cannot replace the tariff and line items on the actual bill.`
  ];
  return variants[seed.title.length % variants.length];
}

function actionItems(seed: ArticleSeed) {
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const third = seed.expandedKeywords[2] || seed.mainKeyword;
  const fourth = seed.expandedKeywords[3] || seed.category.toLowerCase();
  const variants = [
    [`Write down monthly kWh and billing days.`, `Compare ${first} with the state benchmark.`, `Use ${second} to decide whether the fix is behavior, equipment, billing, or assistance.`],
    [`Check whether ${first} changed before the dollar total changed.`, `Look for ${third} in the bill history or household routine.`, `Choose one reversible action and review the next bill.`],
    [`Separate usage charges from fixed or delivery charges.`, `Ask whether ${second} explains the timing of the bill.`, `Use ${fourth} only as context, not as a guaranteed savings claim.`],
    [`Mark the line item that changed most.`, `Compare it with ${first} and ${third}.`, `Escalate to the utility or assistance office only after the bill evidence is organized.`]
  ];
  return variants[(seed.slug.charCodeAt(0) + seed.slug.charCodeAt(seed.slug.length - 1)) % variants.length];
}

function readerProblem(seed: ArticleSeed) {
  const state = stateName(seed.stateSlug);
  const first = firstExpandedKeyword(seed);
  const variants = [
    `The reader is trying to decide whether ${seed.mainKeyword} is a real bill problem or just a confusing line item in ${state}.`,
    `The reader likely searched because ${first} made a recent bill feel abnormal and they need a grounded next step.`,
    `The reader needs a practical way to connect ${seed.mainKeyword} with the bill, the home, and the local benchmark before acting.`,
    `The reader wants to avoid overreacting to ${seed.mainKeyword} while still catching a costly usage, rate, or assistance issue.`
  ];
  return variants[seed.mainKeyword.length % variants.length];
}

function uniqueAngle(seed: ArticleSeed) {
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const variants: Record<ArticleSeed["format"], string> = {
    checklist: `This guide treats ${seed.mainKeyword} as a sequence of checks, starting with ${first} before moving to ${second}.`,
    comparison: `This guide compares ${first} and ${second} without pretending two homes, utilities, or rate plans are identical.`,
    troubleshooting: `This guide reads ${seed.mainKeyword} like a bill investigation, not a list of generic energy-saving tips.`,
    decision: `This guide frames ${seed.mainKeyword} as a decision point where the wrong next step can waste money or time.`,
    "data-led": `This guide uses public benchmark data carefully and explains where ${first} stops being enough.`,
    mistakes: `This guide focuses on the mistakes that make ${seed.mainKeyword} harder to diagnose than it needs to be.`,
    scenario: `This guide follows a realistic household situation so ${seed.mainKeyword} feels concrete instead of abstract.`,
    glossary: `This guide defines ${seed.mainKeyword} in billing language, then translates the definition into action.`,
    howto: `This guide turns ${seed.mainKeyword} into a short workflow that a reader can use with a real bill.`,
    case: `This guide uses a case-pattern lens to show how ${first} and ${second} change the answer.`
  };
  return variants[seed.format];
}

function evidenceNotes(seed: ArticleSeed) {
  const source = sourceMap[seed.source].label;
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const notes: Record<ArticleSeed["source"], string[]> = {
    eia: [
      `${source} is useful for broad residential electricity benchmarks, not for a household's exact tariff.`,
      `Use EIA-style averages to compare ${first}, then use the utility bill to confirm fees, riders, and billing days.`
    ],
    doe: [
      `${source} is most useful when ${seed.mainKeyword} depends on peak timing, demand response, or flexible usage.`,
      `The bill still decides the outcome: compare ${first} with actual kWh before changing a routine.`
    ],
    energystar: [
      `${source} supports practical home-efficiency context for ${first}, especially when equipment or behavior affects usage.`,
      `Savings claims should stay conservative because ${second} varies by home, climate, and appliance condition.`
    ],
    liheap: [
      `${source} is the right official anchor when payment risk, hardship, or assistance timing matters.`,
      `For ${seed.mainKeyword}, eligibility and help amounts vary, so readers should prepare documents before assuming approval.`
    ]
  };
  return notes[seed.source];
}

function practicalExample(seed: ArticleSeed) {
  const state = stateName(seed.stateSlug);
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const variants = [
    `Example: a household in ${state} sees the same total bill as last month but notices ${first} changed. That points to a different answer than a pure rate increase.`,
    `Example: if ${second} appears right after a seasonal routine change, the useful test is one billing cycle long, not a year-long equipment plan.`,
    `Example: a renter checking ${seed.mainKeyword} should compare kWh and billing days before asking whether the lease, meter, or utility setup is the real issue.`,
    `Example: a homeowner can use the state benchmark to decide whether ${first} is a normal context clue or a reason to inspect equipment.`
  ];
  return variants[(seed.category.length + seed.slug.length) % variants.length];
}

function decisionChecklist(seed: ArticleSeed) {
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const third = seed.expandedKeywords[2] || seed.category.toLowerCase();
  const byFormat: Record<ArticleSeed["format"], string[]> = {
    checklist: [`Confirm the billing period before reading ${first}.`, `Compare kWh before comparing dollars.`, `Pick one next step tied to ${second}.`],
    comparison: [`Compare like with like: home size, season, and usage.`, `Check whether ${first} changes the benchmark.`, `Use ${second} to decide whether the comparison is fair.`],
    troubleshooting: [`Find the first month where the pattern changed.`, `Separate rate, usage, and fee changes.`, `Contact the utility only after the evidence is organized.`],
    decision: [`Name the decision before using the benchmark.`, `Avoid irreversible purchases until ${first} is confirmed.`, `Choose the lowest-risk action that addresses ${second}.`],
    "data-led": [`Use the public average as a benchmark, not a promise.`, `Check whether ${third} is missing from the data.`, `Let the actual bill override the average.`],
    mistakes: [`Do not diagnose from dollars alone.`, `Do not copy advice meant for a different home type.`, `Do not ignore ${first} when timing changes.`],
    scenario: [`Write down what changed in the household.`, `Check whether ${second} moved before the bill moved.`, `Review the next bill before escalating.`],
    glossary: [`Define the term on the bill first.`, `Separate ${first} from ${second}.`, `Apply the definition to one real line item.`],
    howto: [`Read the bill, then benchmark it.`, `Tie ${first} to a specific action.`, `Review the result after one billing cycle.`],
    case: [`Identify the dominant cause.`, `Check whether ${second} explains the timing.`, `Keep the fix narrower than the fear.`]
  };
  return byFormat[seed.format];
}

function commonMistake(seed: ArticleSeed) {
  const first = firstExpandedKeyword(seed);
  const second = secondExpandedKeyword(seed);
  const variants = [
    `The common mistake is treating ${seed.mainKeyword} as proof of waste before checking whether ${first} changed first.`,
    `The common mistake is comparing two bills without matching billing days, kWh, and ${second}.`,
    `The common mistake is jumping to a purchase or plan switch when a utility call, assistance check, or one-cycle test would be safer.`,
    `The common mistake is using a state average as if it included every fixed charge, tariff rule, and household habit.`
  ];
  return variants[seed.slug.charCodeAt(1) % variants.length];
}

function whenToAct(seed: ArticleSeed) {
  const first = firstExpandedKeyword(seed);
  const state = stateName(seed.stateSlug);
  const variants = [
    `Act now if the bill threatens payment stability, the meter reading looks estimated, or ${first} changed without a clear household reason.`,
    `Use the ${state} estimator when the bill is confusing but not urgent; contact the utility first if a shutoff notice or billing correction is involved.`,
    `Move from reading to action when two bills show the same pattern or when ${first} points to a specific appliance, schedule, fee, or assistance need.`,
    `If the issue is only curiosity, benchmark it. If the issue affects cash flow or safety, document the bill and ask the utility or assistance office about options.`
  ];
  return variants[seed.title.length % variants.length];
}

function contentLayout(seed: ArticleSeed, index: number): Article["contentLayout"] {
  const layouts: Article["contentLayout"][] = ["diagnostic", "example-first", "evidence-first", "action-first"];
  return layouts[index % layouts.length];
}

function estimateWordCount(article: Pick<Article, "intro" | "answerSummary" | "highlight" | "sections" | "faq" | "actionItems" | "readerProblem" | "uniqueAngle" | "evidenceNotes" | "practicalExample" | "decisionChecklist" | "commonMistake" | "whenToAct" | "detailBlocks">) {
  const chunks = [
    article.intro,
    article.answerSummary,
    article.highlight,
    article.readerProblem,
    article.uniqueAngle,
    article.practicalExample,
    article.commonMistake,
    article.whenToAct,
    ...(article.actionItems || []),
    ...(article.evidenceNotes || []),
    ...(article.decisionChecklist || []),
    ...(article.detailBlocks || []).flatMap((block) => [block.title, block.intro, ...block.rows.flatMap((row) => [row.label, row.value, row.note])]),
    ...article.sections.flatMap((section) => [section.heading, section.body]),
    ...article.faq.flatMap((item) => [item.question, item.answer])
  ].filter(Boolean);
  return chunks.join(" ").trim().split(/\s+/).filter(Boolean).length + 120;
}

function formatSections(seed: ArticleSeed): ArticleSection[] {
  const state = stateName(seed.stateSlug);
  const keyword = seed.mainKeyword;
  const related = seed.expandedKeywords.slice(0, 3).join(", ");
  const source = sourceMap[seed.source].label;
  const formats: Record<ArticleSeed["format"], ArticleSection[]> = {
    checklist: [
      { heading: `Start with the ${keyword} signal`, body: `A useful ${keyword} check begins with the bill details that do not change with opinion: billing period, kWh usage, cents per kWh, and fixed charges. In ${state}, compare the current bill with the prior month before assuming the household did something wrong. The pattern matters more than one isolated number.` },
      { heading: "Separate usage from price", body: `Look at usage first, then price. ${related} can all change the bill, but they do not change it in the same way. If kWh rose, the answer is usually behavior, weather, equipment, or occupancy. If kWh stayed flat and dollars rose, the issue is more likely rate, fee, or billing-period related.` },
      { heading: "Make one practical move", body: `Choose one action that fits the evidence. A cooling-heavy bill needs thermostat and airflow work. A fixed-fee-heavy bill needs expectation management. A hardship bill needs payment planning, not another calculator. Use ${source} as the evidence anchor when a factual claim needs support.` }
    ],
    comparison: [
      { heading: "What you are really comparing", body: `${keyword} is not a single comparison. It combines usage, rate design, climate, appliance mix, and household routine. A fair comparison asks whether two homes used similar kWh under similar conditions before treating one bill as normal and the other as wasteful.` },
      { heading: "Where the benchmark helps", body: `The state benchmark gives a sanity check. In ${state}, it can show whether the bill is broadly aligned with average residential prices. It cannot identify every tariff, discount, fixed charge, or time-of-use window. That limitation is why a range is more honest than a single claim.` },
      { heading: "How to use the result", body: `If the comparison shows a large gap, move from broad rate data to household details: HVAC runtime, water heating, standby loads, and billing period length. ${related} should guide the next question instead of becoming a keyword-stuffed answer.` }
    ],
    troubleshooting: [
      { heading: "The fastest diagnostic path", body: `For ${keyword}, do not start with a theory. Start with the old bill and the new bill. Compare kWh, days in the billing cycle, cents per kWh, fixed charges, and any adjustment line. This prevents a common mistake: blaming a rate change when usage quietly doubled.` },
      { heading: "Likely causes to test", body: `The usual causes are seasonal HVAC use, new equipment, longer occupancy, billing corrections, or rate design. In ${state}, the same monthly usage can feel different when the benchmark rate is above or below the national average. ${related} are the clues that narrow the cause.` },
      { heading: "When to contact the utility", body: `Contact the utility when the meter reading looks estimated, the billing period is unusual, a line item appears for the first time, or the bill threatens payment stability. Bring dates, readings, and usage history so the conversation stays factual.` }
    ],
    decision: [
      { heading: "The decision this article should support", body: `${keyword} is useful only if it changes a decision: whether to move, switch routines, request help, buy equipment, or challenge a bill. Treat the article as a decision aid, not a promise of exact savings.` },
      { heading: "The evidence to gather", body: `Gather the monthly kWh, the current cents-per-kWh benchmark, the household's biggest electric loads, and the reason the bill is being reviewed now. ${related} can each point to a different next step, so keep the evidence tied to the decision.` },
      { heading: "The conservative answer", body: `Use the lowest-risk action first. In ${state}, a benchmark can show bill normality, but it cannot replace the actual tariff. That is why the next step should be reversible: adjust usage, compare the bill, ask for assistance, or verify the line item before spending money.` }
    ],
    "data-led": [
      { heading: "What the data can say", body: `Public electricity data can support ${keyword} by showing average residential prices, relative state position, and broad trend direction. It is strongest when used for benchmarking and weakest when stretched into exact household predictions.` },
      { heading: "What the data cannot say", body: `Average data does not include every fixed fee, tier, time-of-use window, tax, or plan-specific discount. For ${state}, a benchmark is still valuable because it gives a starting point, but the bill itself remains the final evidence.` },
      { heading: "A better reading habit", body: `Use data to ask better questions. If the state rate is high but usage is low, the bill may be normal. If the rate is low but usage is high, appliances or climate may be the issue. ${related} are context, not decoration.` }
    ],
    mistakes: [
      { heading: "Mistake one: chasing the wrong number", body: `The first mistake with ${keyword} is staring at dollars without checking kWh. Dollars show pain; kWh shows behavior and equipment. The rate tells you how expensive each unit became.` },
      { heading: "Mistake two: copying generic advice", body: `Generic advice can miss the real cause. A renter, a large-home owner, and an EV driver may all see a high bill for different reasons. ${related} need different fixes, even when the monthly total looks similar.` },
      { heading: "Mistake three: expecting instant certainty", body: `Electric bills rarely explain themselves in one line. Compare two or three months, note weather and occupancy changes, and then use the benchmark for ${state}. That produces a calmer answer than a dramatic claim.` }
    ],
    scenario: [
      { heading: "A realistic household scenario", body: `Imagine a household in ${state} checking ${keyword} after a bill that feels out of line. The first reaction is frustration, but the useful work is slower: compare kWh, billing days, rate, and the household routine that changed.` },
      { heading: "What changes the answer", body: `The answer changes if someone started working from home, added an appliance, changed thermostat habits, or entered a seasonal weather period. ${related} can all be part of the story, but only the bill history shows which one moved first.` },
      { heading: "A practical ending", body: `The household should not jump straight to a major purchase. It should test the likely cause for one billing cycle, use a benchmark estimate, and contact the utility or assistance office if payment risk is the real problem.` }
    ],
    glossary: [
      { heading: `What ${keyword} means`, body: `${keyword} describes a billing question that mixes price, usage, and household context. It should not be read as a universal number. In electricity, the same phrase can mean a rate issue, a usage issue, a fee issue, or a timing issue.` },
      { heading: "Terms that prevent confusion", body: `Keep cents per kWh separate from the total bill. Keep fixed charges separate from usage charges. Keep state averages separate from utility-specific tariffs. ${related} are useful only when the terms stay distinct.` },
      { heading: "How to apply the definition", body: `Apply the definition to the bill in front of you. Use the benchmark, read the line items, and decide whether the next step is saving energy, comparing data, or asking for help.` }
    ],
    howto: [
      { heading: "Step 1: Read the bill", body: `For ${keyword}, start by writing down monthly kWh, billing days, total dollars, and any fixed or adjustment charges. This turns an emotional bill into a small set of facts.` },
      { heading: "Step 2: Compare the benchmark", body: `Compare the household rate and usage with the ${state} benchmark. If ${related} explain the difference, choose the fix that matches the cause rather than the most popular tip.` },
      { heading: "Step 3: Choose the next action", body: `The next action should be small, testable, and tied to the evidence. Adjust a schedule, check equipment, ask about assistance, or document a billing dispute. Then compare the next bill.` }
    ],
    case: [
      { heading: "Case pattern: the bill looks wrong", body: `A common ${keyword} case begins with a bill that feels too high. The useful question is not whether the bill is annoying; it is whether kWh, rate, fees, or billing days changed.` },
      { heading: "Case pattern: one cause dominates", body: `Often one cause dominates. A new EV adds kWh. A rate case changes price. A cold snap extends heating runtime. ${related} help identify which pattern fits the household.` },
      { heading: "Case pattern: the fix is narrower than expected", body: `The best fix is usually narrower than the first fear. A schedule change, a utility call, or a targeted efficiency step may do more than a broad plan to overhaul the home.` }
    ]
  };
  return formats[seed.format];
}

function buildArticle(seed: ArticleSeed, index: number): Article {
  const scheduledAt = scheduleAt(index);
  const state = stateName(seed.stateSlug);
  const enhancement = priorityArticleEnhancements[seed.slug];
  const detailBlocks = priorityDetailBlocks[seed.slug];
  const baseSections = formatSections(seed);
  const sections = enhancement ? [...baseSections, ...enhancement.prioritySections] : baseSections;
  const baseFaq = [
    { question: `Is ${seed.mainKeyword} the same for every household?`, answer: `No. It depends on usage, rate design, billing period, and household equipment. Use the state benchmark as a starting point, then check the bill details.` },
    { question: `What should I check first for ${seed.mainKeyword}?`, answer: `Check monthly kWh first, then the rate, fixed charges, and any billing adjustment. That order separates usage problems from price problems.` }
  ];
  const article: Article = {
    slug: seed.slug,
    title: articleTitle(seed),
    subtitle: articleSubtitle(seed),
    metaTitle: `${seed.mainKeyword}: practical electricity guide`,
    metaDescription: metaDescriptionOverrides[seed.slug] || `${seed.mainKeyword} explained with ${seed.expandedKeywords.slice(0, 3).join(", ")}, state benchmarks, source-backed context, and a clear next step.`,
    mainKeyword: seed.mainKeyword,
    expandedKeywords: seed.expandedKeywords,
    category: seed.category,
    searchIntent: seed.searchIntent,
    readerLevel: seed.readerLevel,
    stateSlug: seed.stateSlug,
    scheduledAt,
    date: formatDate(scheduledAt),
    excerpt: `${seed.angle} for readers comparing electricity rates, usage, and average bill signals in ${state}.`,
    intro: `${seed.title} is best answered by combining public rate data with the household details that actually move a bill. This guide uses ${seed.mainKeyword} as the main lens, then connects ${seed.expandedKeywords.slice(0, 2).join(" and ")} to practical decisions a reader can take without pretending the average rate is an exact tariff.`,
    answerSummary: answerSummary(seed),
    highlight: highlight(seed),
    actionItems: actionItems(seed),
    accentTone: index % 2 === 0 ? "savings" : "warning",
    readerProblem: readerProblem(seed),
    uniqueAngle: uniqueAngle(seed),
    evidenceNotes: evidenceNotes(seed),
    practicalExample: practicalExample(seed),
    decisionChecklist: decisionChecklist(seed),
    commonMistake: commonMistake(seed),
    whenToAct: whenToAct(seed),
    contentLayout: contentLayout(seed, index),
    detailBlocks,
    sections,
    faq: enhancement?.priorityFaq ? [...enhancement.priorityFaq, ...baseFaq] : baseFaq,
    internalLinks: [
      { href: `/${seed.stateSlug}`, label: `${state} electricity rates` },
      { href: "/guides/average-electric-bill-guide", label: "average electric bill guide" },
      { href: "/compare", label: "compare state electricity rates" },
      { href: seed.category === "Assistance" ? `/assistance/${seed.stateSlug}` : "/methodology", label: seed.category === "Assistance" ? "bill assistance options" : "bill estimate methodology" }
    ],
    externalSource: sourceMap[seed.source],
    cta: { href: `/${seed.stateSlug}`, label: `Estimate a ${state} electric bill` },
    schemaType: seed.format === "howto" || seed.format === "checklist" ? "HowTo" : "Article",
    qualityScore: Math.min(99, 92 + (index % 6) + (enhancement?.qualityBoost || 0)),
    codexOnlyGeneration: true
  };
  return { ...article, wordCount: estimateWordCount(article) };
}

function applyTopArticleDeepDives(article: Article): Article {
  const deepDiveBlocks = topArticleDeepDives[article.slug];
  if (!deepDiveBlocks) return article;
  const updated = {
    ...article,
    detailBlocks: [...(article.detailBlocks || []), ...deepDiveBlocks]
  };
  return { ...updated, wordCount: estimateWordCount(updated) };
}

function applyMetaDescriptionOverride(article: Article): Article {
  const metaDescription = metaDescriptionOverrides[article.slug];
  return metaDescription ? { ...article, metaDescription } : article;
}

export const newArticles: Article[] = topicSeeds.slice(0, 100).map((seed, index) => buildArticle(seed, index));
export const articles: Article[] = [...legacyArticles, ...newArticles].map(applyMetaDescriptionOverride).map(applyTopArticleDeepDives);

export function contentNow() {
  return new Date(process.env.CONTENT_NOW || Date.now());
}

export function isPublished(article: Article, now = contentNow()) {
  return new Date(article.scheduledAt).getTime() <= now.getTime();
}

export function getPublishedArticles(now = contentNow()) {
  return articles.filter((article) => isPublished(article, now));
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

function normalizeTokens(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/[\s-]+/)
    .filter((token) => token.length > 2 && !["the", "and", "for", "with", "bill", "electric", "electricity"].includes(token));
}

function articleTokens(article: Article) {
  return new Set([
    ...normalizeTokens(article.mainKeyword),
    ...article.expandedKeywords.flatMap(normalizeTokens),
    ...normalizeTokens(article.title),
    ...normalizeTokens(article.category)
  ]);
}

export function getRelatedArticles(article: Article, limit = 3, now = contentNow()) {
  const sourceTokens = articleTokens(article);
  const candidates = getPublishedArticles(now).filter((candidate) => candidate.slug !== article.slug);
  return candidates
    .map((candidate) => {
      const candidateTokens = articleTokens(candidate);
      const sharedTokenScore = [...sourceTokens].filter((token) => candidateTokens.has(token)).length;
      const categoryScore = candidate.category === article.category ? 8 : 0;
      const stateScore = candidate.stateSlug === article.stateSlug ? 2 : 0;
      const cornerstoneScore = candidate.slug === "average-electric-bill-guide" ? 3 : 0;
      const actionScore = candidate.category === "Tools" || candidate.category === "Assistance" ? 1 : 0;
      return { article: candidate, score: categoryScore + sharedTokenScore * 3 + stateScore + cornerstoneScore + actionScore };
    })
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || b.article.qualityScore - a.article.qualityScore || a.article.title.localeCompare(b.article.title))
    .slice(0, limit)
    .map((item) => item.article);
}

export function articleIntent(article: Pick<Article, "category" | "mainKeyword" | "searchIntent" | "title">) {
  const text = `${article.category} ${article.mainKeyword} ${article.searchIntent} ${article.title}`.toLowerCase();
  if (text.includes("assistance") || text.includes("liheap") || text.includes("past-due") || text.includes("cannot pay") || text.includes("shutoff")) return "Assistance";
  if (text.includes("calculator") || text.includes("estimate") || text.includes("kwh") || text.includes("dollars")) return "Calculator";
  if (text.includes("compare") || text.includes("versus") || text.includes("vs") || text.includes("regulated") || text.includes("deregulated")) return "Comparison";
  if (text.includes("cost") || text.includes("appliance") || text.includes("air conditioner") || text.includes("heat pump") || text.includes("charger")) return "Cost check";
  if (text.includes("diagnosis") || text.includes("normal") || text.includes("high") || text.includes("jump")) return "Diagnosis";
  if (text.includes("how") || text.includes("step") || text.includes("documents")) return "Checklist";
  return "Guide";
}
