# Snakke Project Brief

**Regulatory and market-validation edition**
**Status date:** 14 June 2026
**Applicant:** Digital Ark AS
**Organization number:** 936 295 190
**Location:** Volda municipality, Møre og Romsdal, Norway
**Product:** Snakke, a web-based augmentative and alternative communication
(AAC/ASK) application
**Prototype:** https://snakke.vercel.app

> This brief distinguishes verified current functionality, planned work, and
> claims that require external legal, clinical, accessibility, or procurement
> validation. It is not legal advice or a declaration of regulatory conformity.

## 1. Project Purpose

Digital Ark AS has developed a functional prototype of Snakke, a Progressive
Web App intended to support people who use alternative and augmentative
communication. The prototype provides an icon-based communication board,
text-to-icon matching, speech output, custom icons, user accounts, pairing, and
selected offline functionality.

The proposed six-month project will determine whether Snakke can become a
secure, accessible, and commercially viable service for families, schools,
municipalities, and professionals.

The project is an **avklaringsprosjekt**. It will validate:

1. whether target users and institutional buyers have a documented need;
2. whether the product can meet applicable privacy, security, accessibility,
   and procurement expectations;
3. whether its intended purpose would make it medical-device software;
4. whether future AI-assisted functions trigger additional AI Act duties; and
5. whether a sustainable commercial model exists.

## 2. Funding Fit

Møre og Romsdal county describes Hoppid avklaringsmidlar as support for
activities that clarify market potential, profitability, organization,
strategic choices, and progress. Its current public guidance says applicants
may seek up to **NOK 40,000** and should contact their municipal Hoppid office.
Volda municipality directs founders to the local Hoppid service operated
through Sunnmøre Kulturnæringshage.

This project therefore prioritizes market interviews, external assessments,
pilot preparation, and technical feasibility evidence. Final eligible costs,
grant amount, own contribution, and reporting requirements must be confirmed
with the local Hoppid adviser before submission.

## 3. Problem and Opportunity

People who have limited or no functional speech may use AAC tools to support or
replace speech. NAV states that communication aids can be relevant where speech
and language difficulties are lasting, and where an aid is necessary and
appropriate for daily life, education, or work.

NAV's current communication-aid framework includes both low-technology and
high-technology solutions. NAV also maintains framework agreements with
suppliers. This confirms an established Norwegian market, but it does **not**
mean Snakke is automatically eligible for NAV funding or procurement.

Snakke's commercial hypothesis is that a browser-based, hardware-independent
AAC service can reduce deployment and administration friction for families and
institutions using mixed Android, Windows, iOS, and desktop environments.

The project must validate this hypothesis without claiming that existing
solutions are universally hardware-locked, obsolete, or unsuitable.

## 4. Current Prototype State

### Implemented

- Next.js 16 App Router PWA with TypeScript and Tailwind CSS v4
- Icon-based AAC board with 101 built-in pictograms
- Text-to-icon matching and browser speech features
- Custom icon upload and management
- English and Norwegian interface support
- User accounts, credential login, email verification, and password reset
- Guardian, therapist, teacher, and child roles
- User pairing, communication history, preferences, and selected messaging
- IndexedDB-based local persistence for selected features
- Serwist service worker and installable PWA behavior
- Drizzle schema definitions for a future tenant/RLS foundation

### Not Yet Demonstrated

- Complete and conflict-safe offline synchronization
- Guaranteed operation of every feature without network access
- Applied and independently tested tenant Row-Level Security in every database
- A complete institutional administration portal
- Formal GDPR compliance, completed DPIA, or approved lawful-basis analysis
- Verified EEA-only processing across all subprocessors and support operations
- WCAG conformance established by an external audit
- Switch-access compatibility established through physical-device testing
- NAV framework eligibility or municipal purchasing commitments
- Medical-device classification or exclusion determination
- AI Act classification for future AI-assisted features
- Cyber Resilience Act conformity

## 5. Technical Architecture

| Layer | Current Technology |
|---|---|
| Application | Next.js 16, App Router, webpack |
| Language | TypeScript |
| Interface | Tailwind CSS v4 |
| Client state | Redux Toolkit |
| Authentication | NextAuth.js v5, JWT sessions |
| Database | Neon Serverless Postgres |
| ORM | Drizzle ORM |
| Object storage | Vercel Blob |
| Local storage | IndexedDB through `idb` |
| PWA/service worker | `@serwist/next` and Serwist |
| Hosting | Vercel prototype deployment |

The architecture is suitable for continued feasibility work. Production
readiness depends on documented data flows, tested tenant isolation, reliable
offline behavior, vulnerability management, incident response, retention and
deletion workflows, backups, and processor/subprocessor review.

## 6. Regulatory Baseline as of 14 June 2026

### 6.1 GDPR and Norwegian Privacy Law

Norway implements the GDPR through the Personal Data Act. All processing of
personal data requires a lawful basis. Health data is a special category under
GDPR Article 9, but Snakke data is not automatically health data merely because
the service is an AAC tool. Classification depends on the data, purpose,
context, and inferences made.

Because the intended users may include children and other vulnerable people,
the project will apply a high-protection approach even where Article 9 is not
conclusively triggered.

Required work before a controlled pilot:

- define controller and processor roles for each operating model;
- create a record of processing activities and data-flow map;
- document Article 6 lawful basis and, where applicable, an Article 9 exception;
- establish purpose limitation, minimization, retention, deletion, access,
  correction, export, and incident procedures;
- complete processor and subprocessor assessments and agreements;
- assess all transfers or remote access outside the EEA;
- implement privacy by design and default;
- determine whether a DPIA is required and complete it before high-risk
  processing begins.

Datatilsynet states that a DPIA must be performed before processing starts when
the processing is likely to result in high risk. Sensitive or highly personal
data, vulnerable data subjects, new technology, systematic monitoring, and
large-scale processing are relevant criteria.

### 6.2 Cloud Location and International Transfers

The project will prefer EEA processing and storage, but it will not claim
"sovereign cloud" solely from selecting an EU hosting region. Data location,
support access, telemetry, subprocessors, corporate jurisdiction, and transfer
mechanisms must all be assessed.

Datatilsynet states that every transfer of personal data outside the EEA needs
a valid transfer basis. The EU-US Data Privacy Framework adequacy decision
remains in force as of the status date, but it only covers eligible,
participating US organizations and does not remove the need to map processing
and verify the relevant mechanism.

### 6.3 Accessibility

Norwegian law requires public and private organizations to universally design
main ICT solutions directed at or made available to the public, subject to the
applicable scope and exceptions. Snakke will treat accessibility as a product
requirement, not claim compliance based only on Tailwind CSS or existing
settings.

The European Accessibility Act applies in the EU from 28 June 2025 to specified
products and consumer services, including e-commerce services. Its precise
application to Snakke and its Norwegian implementation must be assessed before
commercial launch.

The project target is external assessment against applicable Norwegian rules
and relevant WCAG requirements, including keyboard access, screen readers,
focus behavior, contrast, zoom/reflow, reduced motion, cognitive usability, and
physical switch testing.

### 6.4 Medical-Device Boundary

Norway's Directorate for Medical Products states that software qualification
depends on the manufacturer's documented intended purpose. Digital Ark AS must
decide and document whether Snakke is intended only as a communication aid or
whether it makes medical, diagnostic, monitoring, prediction, treatment, or
clinical decision-support claims.

Before commercial launch, the project will obtain a written medical-device
boundary assessment. Product copy and features must remain consistent with the
chosen intended purpose. No claim of medical-device status or exclusion is made
in this brief.

### 6.5 EU AI Act

The AI Act entered into force on 1 August 2024. Prohibited-practice and AI
literacy provisions have applied since 2 February 2025. Most provisions are
scheduled to apply from **2 August 2026**, shortly after this brief's status
date, with other obligations following separate timelines. Proposed or
politically agreed timeline changes are not treated as effective law until
formally adopted and applicable.

Snakke's present keyword-based icon matching is not automatically a high-risk
AI system. Future generative, predictive, diagnostic, educational-assessment,
or medical-device AI functions require documented classification before
release. The project will maintain an AI feature inventory and prohibit
unreviewed AI features from making clinical or consequential decisions.

### 6.6 Cyber Resilience Act

The EU Cyber Resilience Act covers products with digital elements placed on the
market in commercial activity. Main obligations apply from 11 December 2027,
while vulnerability and severe-incident reporting obligations begin on
11 September 2026. EEA incorporation and precise applicability to Snakke must
be monitored.

The project will begin CRA-aligned preparation now through:

- software bill of materials and dependency inventory;
- vulnerability intake and remediation process;
- supported-product-lifetime policy;
- secure update and disclosure process;
- incident classification and reporting playbook.

### 6.7 NAV and Public Procurement

NAV confirms that AAC communication aids form part of the Norwegian aid market,
that individual eligibility depends on lasting need and necessity, and that NAV
uses supplier agreements. Snakke must not state that a particular form,
recommendation, or legal provision guarantees state purchase.

The NAV pathway is a long-term validation track requiring dialogue with NAV
Hjelpemiddelsentral, relevant professionals, and procurement channels.

For municipal sales, public procurement rules depend on the estimated total
contract value and procurement context. New EEA thresholds took effect on
21 April 2026. The national threshold remains NOK 1.3 million, while current
EEA thresholds include NOK 2.5 million for municipal and county authority
goods and services contracts. Parliament has adopted a future increase in the
general entry threshold from NOK 100,000 to NOK 500,000, but implementation
timing and applicable rules must be checked when procurement begins.

## 7. Target Market and Validation Questions

### Primary Near-Term Segment

Municipal schools, specialist educators, PPT-related stakeholders, and small
professional practices that need a manageable AAC service across mixed devices.

### Secondary Segment

Families and individual professionals seeking a simple communication board and
collaboration tools.

### Long-Term Institutional Track

NAV-related aid supply and larger municipal or clinical agreements, subject to
product maturity, evidence, procurement eligibility, and regulatory review.

### Questions the Project Must Answer

1. Which user group has the most urgent, measurable problem?
2. Which current alternatives do users rely on, and why?
3. Which Snakke functions create sufficient value to support payment?
4. Who is the buyer, decision-maker, controller, and daily administrator?
5. What evidence and integrations are required by schools and municipalities?
6. Can Digital Ark AS support the security, accessibility, and service levels
   expected by institutional customers?

## 8. Six-Month Work Plan

### Work Package 1: Market and Procurement Validation

- Interview families, AAC users where appropriate, specialist teachers,
  speech-language professionals, municipal IT/procurement staff, and NAV
  stakeholders.
- Map competitors and substitutes without unsupported pricing claims.
- Test pricing, purchasing authority, onboarding needs, and support burden.
- Confirm Hoppid eligible activities and reporting requirements.

**Deliverables:** interview evidence, market map, buyer map, pricing hypothesis,
and go/no-go criteria.

### Work Package 2: Privacy and Regulatory Assessment

- Create data inventory, data-flow map, role matrix, lawful-basis analysis,
  retention plan, and rights procedures.
- Determine Article 9 relevance and DPIA requirement.
- Review Vercel, Neon, Resend, and Blob processing, locations, subprocessors,
  and transfer mechanisms.
- Obtain a medical-device intended-purpose assessment.
- Create AI Act and CRA applicability registers.

**Deliverables:** compliance gap report, DPIA or documented DPIA decision,
processor register, intended-purpose statement, and remediation plan.

### Work Package 3: Tenant Security and Technical Evidence

- Create and review tenant/RLS database migrations.
- Apply migrations in a controlled environment.
- Add database-enforced isolation policies and cross-tenant tests.
- Verify auth, registration, password reset, and data rights workflows.
- Document backups, deletion, logging, incidents, and vulnerability handling.

**Deliverables:** migration package, automated isolation evidence, security test
report, and technical operations handbook.

### Work Package 4: Offline Reliability and Accessibility

- Define exactly which workflows must operate offline.
- Implement and test queued synchronization, retries, conflict handling, and
  user-visible sync state.
- Prevent inappropriate caching of sensitive authenticated responses.
- Perform keyboard, screen-reader, contrast, zoom/reflow, and switch-device
  testing.
- Commission an external accessibility assessment.

**Deliverables:** offline capability matrix, reconnect test results,
accessibility report, and prioritized remediation backlog.

### Work Package 5: Controlled Pilot Preparation

- Define participant criteria, informed information, consent/assent process,
  support procedures, incident handling, and success metrics.
- Do not start high-risk personal-data processing before required assessments
  and safeguards are complete.
- Run a small, time-limited pilot only after readiness review.

**Deliverables:** pilot protocol, participant materials, measurement framework,
pilot findings, and commercialization recommendation.

## 9. Proposed Budget

The final budget must be approved against current Hoppid rules. A proposed
NOK 40,000 allocation is:

| Activity | Amount |
|---|---:|
| External privacy, cloud-transfer, and regulatory boundary assessment | NOK 15,000 |
| External accessibility and assistive-technology assessment | NOK 15,000 |
| Market interviews, pilot preparation, travel, and testing materials | NOK 10,000 |
| **Total** | **NOK 40,000** |

Internal development time, hosting, and administrative effort should be shown
separately and treated according to the funding scheme's confirmed rules.

## 10. Success Criteria

At project completion, Digital Ark AS will have:

- at least 15 structured market interviews across users, professionals, and
  buyers;
- a documented target customer, buyer, and pricing hypothesis;
- a written privacy and regulatory gap assessment;
- a completed DPIA or documented professional decision that one is not required
  for the proposed pilot;
- verified processor, subprocessor, region, and transfer documentation;
- a written medical-device intended-purpose assessment;
- an AI Act and CRA applicability register;
- automated evidence that tenant data cannot cross tested boundaries;
- an offline capability matrix with reconnect test results;
- an external accessibility report;
- a controlled-pilot readiness decision; and
- a board-level go/no-go recommendation for commercialization.

## 11. Non-Negotiable Development Rules

All future development work must:

1. distinguish implemented, tested, planned, and externally verified claims;
2. minimize personal data and avoid national identification numbers and
   diagnoses unless a documented need and lawful basis are established;
3. use explicit tenant ownership and database-enforced isolation for
   institutional data;
4. preserve offline communication while clearly communicating sync state;
5. prevent service workers from exposing sensitive authenticated data;
6. maintain accessibility throughout design and testing;
7. document intended purpose before adding clinical or diagnostic claims;
8. classify future AI features before release;
9. maintain dependency, vulnerability, and incident-response processes; and
10. require professional review before making legal, compliance, NAV,
    procurement, medical-device, or conformity claims.

## 12. Primary Sources Reviewed

Sources were reviewed on 14 June 2026.

- Møre og Romsdal county, Hoppid service and avklaringsmidlar:
  https://mrfylke.no/tenester/narings-og-samfunnsutvikling/naringsutvikling/grundertenesta-hoppid-no/
- Møre og Romsdal county, 2026 Hoppid allocation:
  https://mrfylke.no/nyheiter/3-mill-til-hoppid-no-desse-far-midlar-i-2026.39226.aspx
- Volda municipality, business development and local Hoppid office:
  https://www.volda.kommune.no/tenester/naring-og-skatt/naringsutvikling/
- NAV, speech/language difficulties and AAC:
  https://www.nav.no/tale-sprak
- NAV, digital communication aids:
  https://www.nav.no/digitale-kommunikasjonshjelpemidler
- NAV/FinnHjelpemiddel, communication-aid framework agreement:
  https://finnhjelpemiddel.nav.no/rammeavtale/1f74afc7-9740-41cc-8648-cd942c392d42
- Lovdata, Norwegian Personal Data Act:
  https://lovdata.no/lov/2018-06-15-38
- EUR-Lex, GDPR:
  https://eur-lex.europa.eu/eli/reg/2016/679/oj/eng
- Datatilsynet, when a DPIA is required:
  https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/vurdering-av-personvernkonsekvenser/nar-ma-man-gjennomfore-en-vurdering-av-personvernkonsekvenser/
- Datatilsynet, privacy by design and default:
  https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/innebygd-personvern-og-personvern-som-standard/
- Datatilsynet, transfer bases outside the EEA:
  https://www.datatilsynet.no/rettigheter-og-plikter/virksomhetenes-plikter/overforing-av-personopplysninger-ut-av-eos/overforingsgrunnlag/
- EUR-Lex, EU-US Data Privacy Framework adequacy decision:
  https://eur-lex.europa.eu/eli/dec_impl/2023/1795/oj/eng
- Lovdata, Equality and Anti-Discrimination Act:
  https://lovdata.no/dokument/NL/lov/2017-06-16-51
- Lovdata, ICT universal-design regulation:
  https://lovdata.no/forskrift/2013-06-21-732
- EUR-Lex, European Accessibility Act:
  https://eur-lex.europa.eu/eli/dir/2019/882/oj/eng
- Norwegian Medical Products Agency, software as a medical device:
  https://www.dmp.no/medisinsk-utstyr/utvikling-og-produksjon/programvare-som-medisinsk-utstyr
- European Commission, AI Act framework and timeline:
  https://digital-strategy.ec.europa.eu/en/policies/regulatory-framework-ai
- EUR-Lex, AI Act:
  https://eur-lex.europa.eu/eli/reg/2024/1689/oj/eng
- European Commission, Cyber Resilience Act:
  https://digital-strategy.ec.europa.eu/en/policies/cyber-resilience-act
- DFØ, procurement thresholds effective 21 April 2026:
  https://www.anskaffelser.no/anskaffelsesregelverk/terskelverdier-offentlige-anskaffelser
- DFØ, adopted changes to the Norwegian Procurement Act:
  https://www.anskaffelser.no/anskaffelsesregelverk/lov-og-forskrifter/stortinget-har-vedtatt-endringer-i-anskaffelsesloven
