import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: 'process.env.OPENAI_API_KEY',
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
