import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import 'dotenv/config';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.post("/api/suggest-hall", async (req, res) => {
    try {
      const { pax, eventType } = req.body;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `You are a banquet hall manager. Suggest the most optimal hall to minimize wastage for an event.
Event Type: ${eventType}
Number of Pax: ${pax}

Available Halls:
1. Crystal Ballroom (Capacity: 800 pax) - Best for large weddings, galas, and big corporate events.
2. Garden Lawn (Capacity: 400 pax) - Best for outdoor events, medium weddings, evening parties.
3. Ruby Suite (Capacity: 150 pax) - Best for intimate gatherings, seminars, small birthdays.

Rules:
- You MUST choose the hall that fits the pax without having too much unused space (minimize wastage).
- If pax > 400, MUST be Crystal Ballroom.
- If pax > 150 and <= 400, MUST be Garden Lawn.
- If pax <= 150, MUST be Ruby Suite.
- Also factor in event type if pax is close to the boundary (e.g., outdoor weddings might prefer lawn if weather/pax permits).

Return ONLY a JSON response in the following format, with no markdown formatting or backticks:
{
  "recommendedHall": "Hall Name",
  "reason": "Short explanation of why this hall is optimal and minimizes wastage."
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      let responseText = response.text;
      if (!responseText) {
        throw new Error("No response from AI");
      }
      
      // Clean up markdown block if present
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      
      const suggestion = JSON.parse(responseText);
      res.json(suggestion);
    } catch (error) {
      console.error("AI Suggestion Error:", error);
      res.status(500).json({ error: "Failed to generate suggestion" });
    }
  });

  app.post("/api/energy-efficiency", async (req, res) => {
    try {
      const { events } = req.body;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const eventsList = events.map((e: any) => `- ${e.title} (Pax: ${e.pax || 'Unknown'}, Hall: ${e.hall || 'Unassigned'})`).join('\n');
      
      const prompt = `You are a facility management AI for a banquet and event center.
Analyze the following upcoming events and suggest the most energy-efficient HVAC (heating, ventilation, and air conditioning) and lighting configurations to minimize wastage.

Upcoming Events:
${eventsList}

Halls Available:
1. Crystal Ballroom (Capacity: 800 pax)
2. Garden Lawn (Capacity: 400 pax)
3. Ruby Suite (Capacity: 150 pax)

Rules:
- Provide specific, actionable advice on lighting zones and HVAC temperature/timing.
- Consider pax size vs hall capacity (e.g., if a small event is in a large hall, suggest partitioning or zone control).
- Keep it concise, professional, and directly useful.
- Return ONLY a JSON response in the following format, with no markdown formatting or backticks:
{
  "recommendations": [
    { "hall": "Hall Name", "suggestion": "Specific HVAC/Lighting advice." }
  ],
  "estimatedSavings": "Brief note on why this saves energy"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      let responseText = response.text;
      if (!responseText) throw new Error("No response from AI");
      
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const suggestion = JSON.parse(responseText);
      
      res.json(suggestion);
    } catch (error) {
      console.error("AI Efficiency Suggestion Error:", error);
      res.status(500).json({ error: "Failed to generate efficiency suggestion" });
    }
  });

  app.post("/api/parse-booking", async (req, res) => {
    try {
      const { transcript } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const today = new Date();
      const currentYear = today.getFullYear();
      const currentDateStr = today.toISOString().slice(0, 10);
      const dayOfWeek = today.toLocaleDateString('en-US', { weekday: 'long' });

      const prompt = `You are an AI assistant for a premier banquet hall booking system.
Extract the booking details from the user's spoken or typed transcript.

Transcript: "${transcript}"

Current Date Context (Use this to resolve relative dates like "tomorrow", "next Friday", "this weekend", "September 15"):
- Today is: ${currentDateStr} (${dayOfWeek})
- Current Year: ${currentYear}

Available Halls (Select closest matching halls from this list):
- "Crystal Ballroom"
- "Garden Lawn"
- "Ruby Suite"

Available Event Types (Map to the closest match):
- "Wedding"
- "Conference"
- "Birthday"
- "Corporate Meeting"
- "Seminar / Training"

Extract the following fields and return as a JSON object:
1. customerName: Name of the person or company booking the hall. Use "New Customer" if not specified.
2. eventType: One of the available event types. Choose "Wedding" or "Corporate Meeting" if unclear from context.
3. pax: Number of attendees. Look for numbers near "pax", "people", "guests", "members", "attendees", "seats". Default to 50 if missing.
4. halls: Array of matching hall names. If a user specifies a hall (e.g., "Crystal" or "Ruby" or "Lawn"), map it to the full name. Default to ["Crystal Ballroom"] if missing.
5. startDate: Deduce the date as "YYYY-MM-DD" based on the transcript and current date context.
6. endDate: Deduce the date as "YYYY-MM-DD". If the event is single-day, set endDate same as startDate.

Return ONLY a valid, raw JSON object with these keys, with no markdown backticks, prefix or suffix:
{
  "customerName": "string",
  "eventType": "string",
  "pax": number,
  "halls": ["string"],
  "startDate": "YYYY-MM-DD",
  "endDate": "YYYY-MM-DD"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: prompt,
      });

      let responseText = response.text;
      if (!responseText) throw new Error("No response from AI");
      
      responseText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(responseText);
      
      res.json(parsedData);
    } catch (error) {
      console.error("AI Parse Booking Error:", error);
      res.status(500).json({ error: "Failed to parse booking details" });
    }
  });  app.post("/api/send-email", async (req, res) => {
    try {
      const { templateName, recipient, subject, body } = req.body;
      console.log(`\n[EMAIL SERVICE] Sending '${templateName}' to ${recipient}...`);
      console.log(`[EMAIL SERVICE] Subject: ${subject}`);
      console.log(`[EMAIL SERVICE] Body:\n${body}\n`);
      // In a real application, you would integrate SendGrid, AWS SES, or NodeMailer here.
      res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
      console.error("Email Sending Error:", error);
      res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const { message, context } = req.body;
      
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `You are a helpful AI assistant for a Banquet Hall Management System. 
Respond concisely to the manager's query using the provided context.

Context (Current System State):
${context}

Manager's Query: ${message}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
      });

      res.json({ reply: response.text });
    } catch (error) {
      console.error("AI Chat Error:", error);
      res.status(500).json({ error: "Failed to process chat query" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
