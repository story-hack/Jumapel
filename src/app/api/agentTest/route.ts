import { openai } from "@/utils/openai";
import { createWhitepaperPDF, uploadPDFToIPFS } from "@/utils/pdfWhitepaper";

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

                    Step 4: Estimate the potential market value (in USD) of this idea based on its uniqueness, market trends, and comparable products. Provide a short justification for your estimate.

                    Step 5: Generate a whitepaper for the idea consisting of introduction, background, problems, solution, possible technologies and conclusion

                    Return your answer in the following JSON format:

                    {
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
      // Clean up common JSON issues from LLMs: remove trailing commas before } or ]
      let jsonString = jsonMatch[0]
        .replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
        .replace(/\n\s*\n/g, '\n'); // Remove double newlines (optional)
      result = JSON.parse(jsonString);
    } catch (e) {
      const error = e as Error;
      console.log("error parsing JSON after cleanup:", error.message);
      return Response.json({
        brandName: "",
        domain: "N/A",
        raw: messageContent,
        jsonError: "Malformed JSON from agent. Please try again.",
      });
    }

    // Generate PDF from whitepaper object and upload to IPFS
    let whitepaperPdfUrl = "";
    try {
      if (result.whitepaper) {
        const pdfBuffer = await createWhitepaperPDF(result.whitepaper);
        const ipfsHash = await uploadPDFToIPFS(pdfBuffer, "whitepaper.pdf");
        whitepaperPdfUrl = `https://orange-bright-loon-792.mypinata.cloud/ipfs/${ipfsHash}`;
      }
    } catch (e) {
      console.error("Whitepaper PDF generation/upload failed:", e);
    }

    return Response.json({
      brandName: result.brandName || "",
      domain: result.availableDomain || result.domain || "N/A",
      refinedIdea: result.refinedIdea || "",
      marketValue: result.marketValue || { estimate: "N/A", justification: "N/A" },
      whitepaperPdfUrl,
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
