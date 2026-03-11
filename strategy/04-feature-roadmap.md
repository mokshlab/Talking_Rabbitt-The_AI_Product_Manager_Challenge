# Feature Roadmap — Prioritized with RICE Framework

## Three High-Impact Feature Recommendations

Based on our ICP research (Indian Fintech/NBFCs), competitive analysis, and the core product thesis, these are the three features that would generate the highest value for customers and the strongest market differentiation.

---

## RICE Scoring

**Scale**: Reach (1-10), Impact (1-3), Confidence (0-100%), Effort (person-months)  
**Score** = (Reach × Impact × Confidence) / Effort

| # | Feature | Reach | Impact | Confidence | Effort | RICE Score | Priority |
|---|---------|-------|--------|------------|--------|------------|----------|
| 1 | **Scheduled Alert Reports** | 9 | 3 | 90% | 2 | **12.15** | 🟢 P0 |
| 2 | **Multi-Source Data Connectors** | 8 | 3 | 80% | 4 | **4.80** | 🟡 P1 |
| 3 | **Audit Trail & Explainability** | 7 | 2 | 95% | 1.5 | **8.87** | 🟢 P0 |

---

## Feature Deep Dives

### Feature 1: Scheduled Alert Reports (RICE: 12.15 — Highest)

**What**: Users define natural language alert rules like *"Notify me every Monday if any branch NPA exceeds 5%"* — the system runs the query automatically and sends results via email/Slack/WhatsApp.

**Why it matters**:
- NBFCs have **daily/weekly compliance reporting requirements** (RBI NPA norms)
- Current process: analyst manually runs SQL → formats Excel → emails to 15 VPs → repeat every Monday
- **Rabbitt automates the entire chain** with natural language rules

**Value Proposition**: "Set it once in English, get weekly insights forever."

**Technical Approach**:
- Cron job layer on existing LLM query pipeline
- Template engine for email/Slack output
- Alert rule CRUD stored in user config DB

---

### Feature 2: Multi-Source Data Connectors (RICE: 4.80)

**What**: Native connectors to enterprise data sources — PostgreSQL, MySQL, Snowflake, Google Sheets, REST APIs — beyond CSV upload.

**Why it matters**:
- CSV upload proves the concept; real enterprise value requires **live data connections**
- Competitors (ThoughtSpot, Power BI) differentiate heavily on connector breadth
- NBFCs typically use a mix of core banking systems (Finnone, Nucleus), CRMs, and spreadsheets

**Value Proposition**: "Connect once, query forever — across every data source."

**Technical Approach**:
- Adapter pattern: BaseConnector → SQLConnector, APIConnector, SheetConnector
- Connection credentials encrypted at rest in customer VPC
- Schema auto-detection for column/table discovery

---

### Feature 3: Audit Trail & Explainability (RICE: 8.87)

**What**: Every query logged with: who asked, when, what data was accessed, what the AI returned, and **how** it arrived at the answer (show the SQL/logic the LLM generated).

**Why it matters**:
- **RBI compliance**: Regulated entities must demonstrate data access governance
- **Trust building**: CISOs won't approve a black-box AI accessing financial data
- **No competitor offers this** in the NLQ analytics space — it's a unique differentiator

**Value Proposition**: "Every answer is auditable. Every query is explainable."

**Technical Approach**:
- Query log table: user_id, timestamp, question, generated_logic, response, data_scope
- "Show reasoning" toggle in UI that displays the LLM's analytical steps
- Exportable audit reports (CSV/PDF) for compliance teams

---

## Roadmap Timeline

```
Q1 2026 (NOW)     Q2 2026           Q3 2026           Q4 2026
───────────────────────────────────────────────────────────────
[MVP: CSV +       [Audit Trail      [Scheduled         [Multi-Source
 NLQ + Charts]     & Explainability]  Alert Reports]    Connectors]
     ▲                  ▲                 ▲                ▲
  We are here     Compliance-first  Automation layer  Enterprise scale
```

**Rationale**: Audit Trail ships first because it unblocks enterprise sales (CISO approval). Scheduled Alerts follow because they demonstrate recurring value. Multi-Source Connectors are highest effort but unlock the full vision.
