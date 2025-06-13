import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: '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',
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:3000', // Optional. Site URL for rankings on openrouter.ai.
    'X-Title': 'Jumapel', // Optional. Site title for rankings on openrouter.ai.
  },
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: 'openai/gpt-4o',
    messages: [
      {
        role: 'user',
        content: 'What is the meaning of life?',
      },
    ],
  });

  console.log(completion.choices[0].message);
}

main();
