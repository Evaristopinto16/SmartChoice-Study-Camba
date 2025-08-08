import fs from 'fs'
import OpenAI from 'openai'
import path from 'path'

/* 
const openai = new OpenAI(
    {
        apiKey,
        baseURL: 'https://bothub.chat/api/v2/openai/v1'
    }
)*/

const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',
  apiKey: 'ollama', // required but unused
})
/*
const completion = await openai.chat.completions.create({
  model: 'gemma3:1b',
  messages: [{ role: 'user', content: 'EM QUE ANO ESTAMOS' }],
})*/

//console.log(completion.choices[0].message.content)

const SelecionarRelevanteFicheiro =  async ()=>{
    let pergunta ="terminei o ensino medio em Fisioterapia atualmente tenciona cursa um ensino superior"
    const caminhoFicheiroDoc = await  fs.readdirSync('./docs')
    console.log(caminhoFicheiroDoc)
    const ListasCursosUniversidades = await caminhoFicheiroDoc.map(curso => ({filname: curso}))
    console.log(ListasCursosUniversidades);

    const response = await openai.chat.completions.create(
        {
            model: 'gemma3:1b',
           // model: 'gpt-3.5-turbo',
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

    console.log(response.choices[0].message.content)

}

const RaciocionioInteligenteAplicandoRAG = async ()=>{
   

}

SelecionarRelevanteFicheiro()