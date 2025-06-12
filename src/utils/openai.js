require('dotenv').config({ path: './.env.local' });

const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

(async function run() {
  const completion = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'user', content: 'Hello world' }
    ],
  });
  console.log(completion.choices[0].message.content);
})();

