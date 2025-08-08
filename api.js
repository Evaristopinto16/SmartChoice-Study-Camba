import fs from 'fs'
import OpenAI from 'openai'
import path from 'path'

/*  */

const  model =  'gpt-3.5-turbo'
const openai = new OpenAI(
    {
        apiKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImNlNGQ2NjUyLWU1NGEtNDNiOC05OTFjLWNiNzY3ODEzZTc2YyIsImlzRGV2ZWxvcGVyIjp0cnVlLCJpYXQiOjE3NDkzNjQ2OTEsImV4cCI6MjA2NDk0MDY5MX0.nchwZMd6-J9iRyFK6dnpuXqhrlQfzwFwVVOlL3i8JgI",
        baseURL: 'https://bothub.chat/api/v2/openai/v1'
    }
)
/*
const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // required but unused
})

const completion = await openai.chat.completions.create({
  model: 'gemma3:1b',
  messages: [{ role: 'user', content: 'EM QUE ANO ESTAMOS' }],
})*/

//console.log(completion.choices[0].message.content)

const SelecionarRelevanteFicheiro =  async (pergunta)=>{
     
    const caminhoFicheiroDoc = await  fs.readdirSync('./docs')
    console.log(caminhoFicheiroDoc)
    const ListasCursosUniversidades = await caminhoFicheiroDoc.map(curso => ({filname: curso}))
    console.log(ListasCursosUniversidades);

    const response = await openai.chat.completions.create(
        {
            
           //model: 'gemma3:1b', 
          model,
           messages: [
            {
                role: "system",
content: "Você é um assistente útil que seleciona o arquivo de documentação mais relevante com base na pergunta de um usuário. Responda em formato JSON com os campos 'filename' e 'reason'."
            },
            {
                role:  `user`,
               content:  `  documentos disponiveis : ${JSON.stringify(ListasCursosUniversidades)} 
                            pergunta do usuario: ${pergunta}
                            Selecione o arquivo mais relevante e explique o porquê. Responda em formato JSON.   
            ` 
            }
           
           ]
            
        }
    )

    return response.choices[0].message.content

}

const RaciocionioInteligenteAplicandoRAG = async (pergunta)=>{

    let selecidoFicheiro = await SelecionarRelevanteFicheiro(pergunta)
    selecidoFicheiro = JSON.parse(selecidoFicheiro)
console.log(selecidoFicheiro)
    if(!selecidoFicheiro.filename) return

    const LerConteudoCurso = await fs.readFileSync(`./docs/${selecidoFicheiro.filename}`, "utf8")

    console.log(LerConteudoCurso)

    const response = await openai.chat.completions.create(
        {
            model,
            messages: [
                {
                    role: 'system',
                    content: "Você é um assistente prestativo que responde perguntas com base na documentação fornecida."
                }, {
                    role: "user",
                      content: `

                        escreve Sobre o ${selecidoFicheiro.filename} seus Pontos-chaves, principais assuntos e saida no Mercado Angolano ou Principalmente na Provincia Do Cuando Cubango,
                        com Base no documentos demostre a sua missão vissão e seu site: ${selecidoFicheiro.filename}:
                        ${LerConteudoCurso} 
                        question: ${pergunta}
                       Por favor, responda com base nesta documentação. Se a resposta não estiver na documentação, diga isso de forma educada.
                        `
                }
            ]
        }
    )
   

}

RaciocionioInteligenteAplicandoRAG("eu gosto muito de aprender sobre tecnologica e tenciono cursar p ensino superior na area relaciona a tecnoligias")