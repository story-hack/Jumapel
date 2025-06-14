import { openai } from "@/utils/openai";

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== "string") {
      return Response.json(
        { error: "Missing or invalid product idea." },
        { status: 400 }
      );
    }

    const prompt = `You are a branding and naming expert.

                    Your job is to take a raw or messy startup/product idea and do the following:

                    Step 1: Interpret and rewrite the idea as a polished, 2–3 line description with clarity, purpose, and appeal. This should highlight the core concept, target audience, and value proposition. This becomes the final \"refinedIdea\".

                    Step 2: Based on the refined idea, suggest a short, catchy, and unique brand name. Keep it creative, relevant, and easy to remember.

                    Step 3: Search the web to find an available .com domain related to the brand name. Prioritize exact matches, but creative and relevant alternatives are acceptable.

                    Return your answer in the following JSON format:

                    {
                      "refinedIdea": "...",
                      "brandName": "...",
                      "availableDomain": "..."
                    }

                    Raw idea: "${idea}"`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: "You are a creative branding assistant." },
        { role: "user", content: prompt },
      ],
    }).catch((error ) => {
      console.error("OpenAI API Error:", {
        status: error.status,
        message: error.message,
        type: error.type,
        code: error.code
      });
      throw error;
    });

    const messageContent = completion.choices?.[0]?.message?.content || "";
    const jsonMatch = messageContent.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      console.log("No JSON found in response:", messageContent);
      return Response.json({ brandName: "", domain: "N/A", raw: messageContent });
    }

    let result;
    try {
      result = JSON.parse(jsonMatch[0]);
    } catch (e) {
      const error = e as Error;
      console.log("error parsing JSON:", error.message);
      return Response.json({ brandName: "", domain: "N/A", raw: messageContent });
    }

    return Response.json({
      brandName: result.brandName || "",
      domain: result.availableDomain || result.domain || "N/A",
      refinedIdea: result.refinedIdea || ""
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
