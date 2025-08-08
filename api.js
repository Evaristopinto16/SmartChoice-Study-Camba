import fs from 'fs'
import OpenAI from 'openai'
import path from 'path'

/*  */

const  model =  'gpt-3.5-turbo'
const openai = new OpenAI(
    {
        apiKey: "",
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

    if(!selecidoFicheiro.filename) return

    const LerConteudoCurso = await fs.readFileSync(`./docs/${selecidoFicheiro.filename}`, "utf8")

     

    const response = await openai.chat.completions.create(
        {
            model,
            messages: [
                {
                    role: 'system',
                    content: "Você é um assistente prestativo que ajudas o usuario escolher o curso ideial para o ensino superior e algumas informaçoes sobre a universidade irás encontrar na documentação fornecida."
                }, {
                    role: "user",
                      content: `
                         question: ${pergunta} com base a pergunta do usuario 
                        acoselha Sobre o curso ${selecidoFicheiro.filename} destacando os  seus Pontos-chaves, principais assuntos a serem estudados  e saida no Mercado de trabalho em  Angolano ou Principalmente na Provincia Do Cuando Cubango,
                        com Base no documentos demostre a sua missão visão e seu site: ${selecidoFicheiro.filename}:
                        ${LerConteudoCurso} 
                       
                       Por favor, informaçoes adicionais escreva com base nesta documentação.  
                        `
                }
            ]
        }
    )
   
    console.log(response.choices[0].message.content)

}

RaciocionioInteligenteAplicandoRAG("eu gosto muito de aprender sobre turismo  e tenciono cursar o ensino superior na area ")