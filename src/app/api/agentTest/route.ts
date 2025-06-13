import openai from '@/utils/openai';

export async function POST(req: Request) {
  try {
    const { idea } = await req.json();
    if (!idea || typeof idea !== 'string') {
      return Response.json({ error: 'Missing or invalid product idea.' }, { status: 400 });
    }

    const prompt = `You are a creative branding assistant.
                   Given a product idea, suggest a catchy, unique brand name and check for an available .com domain. Reply in this JSON format: { "brandName": "...", "availableDomain": "..." }. Product idea: "${idea}"`;

    const completion = await openai.chat.completions.create({
      model: 'openai/gpt-4o',
      messages: [
        { role: 'system', content: 'You are a creative branding assistant.' },
        { role: 'user', content: prompt }
      ],
    });

    let result = null;
    try {
      const message = completion.choices[0].message;
      const content = (typeof message === 'string') ? message : (message && message.content ? message.content : '');
      const match = content.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
        // Ensure both brandName and domain fields are present for frontend
        return Response.json({
          brandName: result.brandName || '',
          domain: result.availableDomain || result.domain || 'N/A',
        });
      } else {
        throw new Error('No JSON found in AI response');
      }
    } catch (e) {
      const message = completion.choices[0].message;
      const content = (typeof message === 'string') ? message : (message && message.content ? message.content : '');
      return Response.json({ brandName: '', domain: 'N/A', raw: content });
    }

    return Response.json(result);
  } catch (error: any) {
    return Response.json({ error: error.message || 'OpenAI error' }, { status: 500 });
  }
}
