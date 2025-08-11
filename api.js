import fs from 'fs'
import OpenAI from 'openai'
import path from 'path'

 
const  model =  'gpt-oss:latest'
/* const openai = new OpenAI(
    {
        apiKey: " ",
        baseURL: 'https://api.deepseek.com/v1'
    }
)
  
*/
const openai = new OpenAI({
  baseURL: 'http://localhost:11434/v1',  
  apiKey: 'ollama', // required but unused
})

 
 

const SelecionarRelevanteFicheiro =  async (pergunta)=>{
     
    const caminhoFicheiroDoc = await  fs.readdirSync('./docs')
    console.log(caminhoFicheiroDoc)
    const ListasCursosUniversidades = await caminhoFicheiroDoc.map(curso => ({filname: curso}))
    console.log(ListasCursosUniversidades);

    const response = await openai.chat.completions.create(
        {
            
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
                            Selecione o arquivo mais relevante e explique o porquê (se a pergunta não se encaixa selecione file: outros assuntos ou curso .txt )  Responda em formato JSON.   
            ` 
            }
           
           ]
            
        }
    )
    console.log(response.choices[0].message.content)
    return response.choices[0].message.content

}

const RaciocionioInteligenteAplicandoRAG = async (pergunta)=>{

    let selecidoFicheiro = await SelecionarRelevanteFicheiro(pergunta)
    selecidoFicheiro = JSON.parse(selecidoFicheiro)

    console.log(selecidoFicheiro)

    if(!selecidoFicheiro.filename) return
    if(selecidoFicheiro.filename.includes('outros assuntos ou curso .txt')){
        return "Sou Study-Camba.ia um agente de IA interativa que ajuda estudantes recém-formados no ensino médio a escolherem o curso superior ideal com base em suas habilidades, interesses e objetivos profissionais. Através de perguntas personalizadas sobre preferências acadêmicas, áreas de afinidade, estilo de aprendizado e aspirações de carreira, o sistema utiliza algoritmos de recomendação para sugerir cursos superiores alinhados com o perfil do estudante. Que tal? Se precisar de ajustes ou mais detalhes, é só pedir! 😊"
    }

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
                        O primeiro paragrafo escreva algo semilar com: Com base a sua pergunta o curso que mais se encaixa em  ${selecidoFicheiro.filename}
                         question: ${pergunta} com base a pergunta do usuario 
                        aconselha Sobre o curso ${selecidoFicheiro.filename} destacando os  seus Pontos-chaves, principais assuntos a serem estudados  e saida no Mercado de trabalho em  Angolano ou Principalmente na Provincia Do Cuando Cubango,
                        com Base no documentos demostre a sua missão visão e seu site: ${selecidoFicheiro.filename}:
                        ${LerConteudoCurso}  Por favor, informaçoes adicionais escreva com base nesta documentação.  
                        `
                }
            ]
        }
    )
   
    return response.choices[0].message.content

}

export default RaciocionioInteligenteAplicandoRAG
