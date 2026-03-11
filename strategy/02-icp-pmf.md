# ICP & Product-Market Fit

## Ideal Customer Profile (ICP)

### Segment: Indian Fintech — NBFCs & Digital Lenders

**Why this ICP?**
India's NBFC sector manages ₹54 lakh crore ($650B) in assets with **explosive data growth** but **severe analytics bottlenecks**. RBI mandates (circular 2024/NB-04) now require granular data governance — making cloud-based AI tools essentially unusable for sensitive financial data.

### Company Profile

| Parameter | Ideal Customer |
|-----------|---------------|
| **Industry** | NBFC, Digital Lending, Fintech |
| **Company Size** | 100–1,000 employees |
| **AUM** | ₹500 Cr – ₹10,000 Cr |
| **Data Team** | 2–5 analysts (bottleneck) |
| **Current Tools** | Excel, basic Power BI, manual SQL reports |
| **Pain Intensity** | 🔴 Critical — regulatory + operational |

---

## Product-Market Fit: The "Burning Pain"

### What Dashboards Miss

| Pain Point | Dashboard Reality | Talking Rabbitt Solution |
|-----------|-------------------|--------------------------|
| **Speed** | VP asks analyst → analyst builds query → 2-4 hours → report | VP asks Rabbitt → 5-second answer |
| **Access** | Only SQL-trained analysts can query data | Anyone who can type a question |
| **Compliance** | Power BI/Tableau send data to US cloud servers | Data stays in customer's private cloud (India region) |
| **Cost** | $75-115/user/month for Tableau Creator | Fraction of the cost with open-source LLMs |
| **Real-time** | Weekly/monthly report cadence | Instant, on-demand conversational access |

### The "Magic Moment"

> A VP of Collections at an NBFC uploads their delinquency CSV and asks: *"Which branch has the highest NPA ratio this quarter?"* — and gets the answer in 5 seconds instead of waiting for a 2-hour analyst turnaround.

**This is the exact experience our MVP demonstrates.**

---

## Top 5 Target Companies

| # | Company | AUM | Why They're Ideal |
|---|---------|-----|-------------------|
| 1 | **Bajaj Finance** | ₹3.3L Cr | Largest NBFC, massive data ops, strong digital push |
| 2 | **Muthoot Finance** | ₹95,000 Cr | Gold loan leader, branch-heavy, needs real-time analytics |
| 3 | **Manappuram Finance** | ₹42,000 Cr | Multi-product NBFC, growing data complexity |
| 4 | **Poonawalla Fincorp** | ₹25,000 Cr | Digital-first NBFC, rapid growth, lean data team |
| 5 | **IIFL Finance** | ₹73,000 Cr | Diversified lending, strong compliance focus |

---

## Buyer Persona

| Field | Detail |
|-------|--------|
| **Title** | VP Analytics / Head of FP&A / Chief Data Officer |
| **Age** | 35–50 |
| **Reports to** | CFO or CEO |
| **Key Metrics** | Loan book growth, NPA ratio, collection efficiency, portfolio-at-risk |
| **Daily Frustration** | "I need to know our Region-wise disbursement numbers NOW, not after Ravi builds the query tomorrow" |
| **Decision Criteria** | Data security, deployment speed, ROI vs existing tools |

### Predicted Objections & Responses

| Objection | Response |
|-----------|----------|
| 🔐 **"Is our financial data safe?"** | Private cloud deployment — data never leaves your VPC. Open-source models, no third-party API calls. RBI-compliant by design. |
| 📊 **"How accurate is the AI?"** | LLaMA 3.3-70b achieves 94%+ accuracy on structured data queries. We use low-temperature inference (0.1) for deterministic results. |
| 💰 **"We already pay for Power BI"** | Power BI is a visualization tool, not a conversational layer. Talking Rabbitt *sits on top* of your existing data — no replacement, just augmentation. |
| ⏱️ **"How long to deploy?"** | MVP in 1 week. Full deployment in 4-6 weeks. No schema modeling required. |
| 🤷 **"My team can just use SQL"** | Your team of 3 analysts serves 20 VPs. Talking Rabbitt gives every VP self-service access, freeing analysts for deeper work. |
