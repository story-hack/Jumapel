import { openai } from "@/utils/openai";
import { createWhitepaperPDF, uploadPDFToIPFS } from "@/utils/pdfWhitepaper";
import { toHex } from "viem";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return Response.json(
        { error: "Missing or invalid product idea." },
        { status: 400 }
      );
    }

    const prompt = `You are a branding and naming expert. You MUST respond with ONLY valid JSON format.

Your job is to take a raw or messy startup/product idea and do the following:

Step 1: Extract the name of the person who submitted the idea if it's mentioned in the input (e.g., "I'm Ron", "This is Jane"). Store it as "creator". If not mentioned, return "Unknown".

Step 2: Interpret and rewrite the idea as a polished, 2–3 line description with clarity, purpose, and appeal. This should highlight the core concept, target audience, and value proposition. 
Avoid mentioning the person who submitted the idea or using pronouns like "his", "her", or names. The description should focus entirely on the idea itself.

Step 3: Based on the refined idea, suggest a short, catchy, and unique brand name. Keep it creative, relevant, and easy to remember.

Step 4: Search the web to find an available .com domain related to the brand name. Prioritize exact matches, but creative and relevant alternatives are acceptable.

Step 5: Estimate the potential market value (in USD) of this idea based on its uniqueness, market trends, and comparable products. Provide a short justification for your estimate.

Step 6: Generate a whitepaper for the idea consisting of introduction, background, problems, solution, possible technologies and conclusion.

CRITICAL: You MUST respond with ONLY the JSON object below. Do not include any other text, explanations, or formatting outside of this JSON structure:

{
  "creator": "...",
  "refinedIdea": "...",
  "brandName": "...",
  "availableDomain": "...",
  "marketValue": {
    "estimate": "...",
    "justification": "..."
  },
  "whitepaper": {
    "introduction": "...",
    "background": "...",
    "problems": "...",
    "solution": "...",
    "technologies": "...",
    "conclusion": "..."
  }
}

Raw idea: "${idea}"`;

    const completion = await openai.chat.completions
      .create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `You are a creative branding assistant who helps turn rough product ideas into clear, engaging, and professional brand pitches.

CRITICAL INSTRUCTIONS:
1. You MUST respond with ONLY valid JSON format
2. Do not include any text outside of the JSON structure
3. Do not add explanations, comments, or additional formatting
4. Your entire response should be a single, valid JSON object

Your job is to:
- Highlight the core concept, value proposition, and potential audience
- Avoid referencing the submitter in any way. Do not use names or pronouns like "his", "her", "my", or "their"
- Focus entirely on the idea itself, making it sound like a standalone product pitch
- Keep the tone neutral, concise, and creative — suitable for use in a branding or marketing context

RESPOND WITH ONLY JSON - NO OTHER TEXT.`,
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2500,
      })
      .catch((error) => {
        console.error("OpenAI API Error:", {
          status: error.status,
          message: error.message,
          type: error.type,
          code: error.code,
        });
        throw error;
      });

    const messageContent = completion.choices?.[0]?.message?.content || "";

    // Log the raw response for debugging
    console.log("Raw OpenAI Response:", messageContent);

    // Try to find JSON in the response
    let jsonMatch = messageContent.match(/\{[\s\S]*\}/);

    // If no JSON brackets found, try to parse the entire response as JSON
    if (!jsonMatch) {
      try {
        // Sometimes the AI returns pure JSON without extra text
        JSON.parse(messageContent.trim());
        jsonMatch = [messageContent.trim()];
      } catch (e) {
        console.log(e);
        console.log("No JSON found in response:", messageContent);
        return Response.json({
          brandName: "",
          domain: "N/A",
          raw: messageContent,
          error: "AI did not return valid JSON format. Please try again.",
        });
      }
    }

    let result;
    try {
      // Clean up common JSON issues from LLMs: remove trailing commas before } or ]
      const jsonString = jsonMatch[0]
        .replace(/,\s*([}\]])/g, "$1") // Remove trailing commas
        .replace(/\n\s*\n/g, "\n") // Remove double newlines
        .replace(/```json/g, "") // Remove markdown code blocks if present
        .replace(/```/g, "")
        .trim();

      result = JSON.parse(jsonString);
    } catch (e) {
      const error = e as Error;
      console.log("Error parsing JSON after cleanup:", error.message);
      console.log("Attempted to parse:", jsonMatch[0]);
      return Response.json({
        brandName: "",
        domain: "N/A",
        raw: messageContent,
        jsonError: "Malformed JSON from agent. Please try again.",
      });
    }

    // Validate that we have the expected structure
    if (!result || typeof result !== "object") {
      return Response.json({
        brandName: "",
        domain: "N/A",
        raw: messageContent,
        error: "Invalid JSON structure returned from AI",
      });
    }

    // Generate PDF from whitepaper object and upload to IPFS
    let whitepaperPdfUrl = "";
    let pdfHash = "";
    try {
      if (result.whitepaper) {
        const pdfBuffer = await createWhitepaperPDF(result.whitepaper);
        const hashBuffer = await crypto.subtle.digest("SHA-256", pdfBuffer);
        pdfHash = toHex(new Uint8Array(hashBuffer), { size: 32 });
        const ipfsHash = await uploadPDFToIPFS(pdfBuffer, "whitepaper.pdf");
        whitepaperPdfUrl = `https://orange-bright-loon-792.mypinata.cloud/ipfs/${ipfsHash}`;
      }
    } catch (e) {
      console.error("Whitepaper PDF generation/upload failed:", e);
    }

    return Response.json({
      creator: result.creator || "Unknown",
      brandName: result.brandName || "",
      domain: result.availableDomain || result.domain || "N/A",
      refinedIdea: result.refinedIdea || "",
      marketValue: result.marketValue || {
        estimate: "N/A",
        justification: "N/A",
      },
      whitepaperPdfUrl,
      pdfHash,
    });
  } catch (error: unknown) {
    const err = error as Error;
    console.error("Error in agentTest route:", err);
    return Response.json(
      { error: err.message || "OpenAI error" },
      { status: 500 }
    );
  }
}
