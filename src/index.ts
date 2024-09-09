import { Request, Response, route } from './httpSupport'

import OpenAI from 'openai'

async function GET(req: Request): Promise<Response> {
    let result = { message: '' }
    const queries = req.queries
    const openaiApiKey = queries.openaiApiKey ? queries.openaiApiKey[0] as string : undefined;
    const openai = new OpenAI({
        apiKey: openaiApiKey,
        baseURL: 'https://faraday.cloud/v1'
    });
    // Choose from any model listed here https://platform.openai.com/docs/models
    const openAiModel = (queries.openAiModel) ? queries.openAiModel[0] : 'gpt-4o-mini';
    const query = (queries.chatQuery) ? queries.chatQuery[0] as string : 'Who are you?'

    const completion = await openai.chat.completions.create({
        messages: [{ role: "system", content: `${query}` }],
        model: `${openAiModel}`,
    })

    result.message = (completion.choices) ? completion.choices[0].message.content as string : 'Failed to get result'

    return new Response(JSON.stringify(result))
}

async function POST(req: Request): Promise<Response> {
    return new Response(JSON.stringify({message: 'Not Implemented'}))
}

export default async function main(request: string) {
    return await route({ GET, POST }, request)
}
