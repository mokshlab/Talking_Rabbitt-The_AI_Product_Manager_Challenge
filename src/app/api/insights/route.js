import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { headers, rows } = await request.json();

    if (!headers || !rows) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: headers, rows" },
        { status: 400 }
      );
    }

    const sampleRows = rows.slice(0, 40);

    const systemPrompt = `You are a data analyst performing an initial scan of a new dataset. Provide exactly 3 quick, high-impact insights about this data.

Return ONLY valid JSON (no markdown fences, no explanation outside JSON).

Response format:
{
  "summary": "1 sentence describing what this dataset contains",
  "insights": [
    {"icon": "📈", "title": "Short title", "detail": "1-2 sentence insight with specific numbers"},
    {"icon": "⚠️", "title": "Short title", "detail": "1-2 sentence insight with specific numbers"},
    {"icon": "💡", "title": "Short title", "detail": "1-2 sentence insight with specific numbers"}
  ]
}

Rules:
- summary: Describe the dataset in plain English (e.g., "Sales data across 4 regions with 16 transactions")
- insights: 3 observations — one trend/highlight, one potential concern, one actionable suggestion
- Use actual numbers from the data. Be specific.
- Icons should be relevant emojis (📈 📉 ⚠️ 💡 🏆 📊 🔍 💰)
- Return ONLY the JSON object.`;

    const userPrompt = `Dataset columns: ${headers.join(", ")}

Data (${rows.length} total rows, showing first ${sampleRows.length}):
${JSON.stringify(sampleRows)}

Analyze this dataset and provide 3 quick insights.`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.3,
      max_tokens: 512,
    });

    let responseText = chatCompletion.choices[0]?.message?.content || "";
    responseText = responseText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      summary: parsed.summary,
      insights: parsed.insights || [],
    });
  } catch (error) {
    console.error("Auto-insights error:", error);
    // Auto-insights are non-critical — fail silently with empty result
    return NextResponse.json({
      success: true,
      summary: null,
      insights: [],
    });
  }
}
