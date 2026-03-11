import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(request) {
  try {
    const { headers, rows, question } = await request.json();

    if (!headers || !rows || !question) {
      return NextResponse.json(
        { success: false, error: "Missing required fields: headers, rows, question" },
        { status: 400 }
      );
    }

    const sampleRows = rows.slice(0, 60);

    const systemPrompt = `You are a precise data analyst. You will receive a dataset with column headers and rows, and a user question about this data.

Analyze the data carefully and return ONLY valid JSON (no markdown fences, no explanation outside JSON).

Response format:
{
  "answer": "1-3 sentence answer to the question with specific numbers",
  "insight": "1 additional business observation from the data",
  "chart": {
    "title": "Chart title",
    "data": [{"label": "Category1", "value": 1234}, {"label": "Category2", "value": 5678}]
  }
}

Rules:
- answer: Direct answer with actual numbers from the data. Be specific.
- insight: One actionable business insight related to the question.
- chart: Provide chart data when the answer involves comparing categories/values. Set to null if the question is purely descriptive with no comparables.
- data array: Maximum 10 items, sorted by value descending. Use meaningful labels.
- value: Must be a number (integer or float). Do NOT return strings for values.
- Return ONLY the JSON object. No text before or after.`;

    const userPrompt = `Dataset columns: ${headers.join(", ")}

Data (${rows.length} total rows, showing first ${sampleRows.length}):
${JSON.stringify(sampleRows)}

Question: ${question}`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.1,
      max_tokens: 1024,
    });

    let responseText = chatCompletion.choices[0]?.message?.content || "";

    // Strip markdown fences if present
    responseText = responseText.replace(/```json\s*/gi, "").replace(/```\s*/gi, "").trim();

    const parsed = JSON.parse(responseText);

    return NextResponse.json({
      success: true,
      answer: parsed.answer,
      insight: parsed.insight,
      chart: parsed.chart || null,
    });
  } catch (error) {
    console.error("Query API error:", error);

    let userMessage = "Failed to process query. Please try again.";
    if (error.status === 401 || error.message?.includes("API Key")) {
      userMessage = "Invalid API key. Please set a valid GROQ_API_KEY in your .env.local file.";
    } else if (error.message?.includes("JSON")) {
      userMessage = "The AI returned an unexpected format. Please rephrase your question.";
    } else if (error.message?.includes("rate")) {
      userMessage = "Rate limit reached. Please wait a moment and try again.";
    }

    return NextResponse.json(
      { success: false, error: userMessage },
      { status: 500 }
    );
  }
}
