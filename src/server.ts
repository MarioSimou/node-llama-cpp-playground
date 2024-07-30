import Fastify from 'fastify'
import {LlamaModel, LlamaContext, LlamaChatSession} from 'node-llama-cpp'
import {resolve} from 'node:path'

const app = Fastify({ 
    logger: true
})

const {PORT, HOST, MODEL_PATH } = process.env

const port = PORT ? parseInt(PORT) : 8080
const host = HOST ?? '0.0.0.0'
const modelRelativePath = MODEL_PATH ?? './Qwen2-0.5B-Instruct-Q8_0.gguf'   

const __dirname = import.meta.dirname

const model = new LlamaModel({
    modelPath: resolve(__dirname, modelRelativePath),
})

const SYSTEM_PROMPT = 'You are a helpful assistant'



app.get('/api/v1/healthcheck', async () => 'healthy')

app.post('/api/v1/analyze', async (req, res) => {
    const question = req.body

    if(!question){
        return res.status(400).send('Bad Request')
    }

    const context = new LlamaContext({model});
    const session = new LlamaChatSession({context, systemPrompt: SYSTEM_PROMPT});
    
    const result = await session.prompt(question as string)
    return result
})

await app.listen({port, host})
console.log(app.printRoutes())