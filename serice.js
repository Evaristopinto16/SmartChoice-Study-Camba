import {firefox} from "@playwright/test";

(async ()=>{

    let arrayResutl =[]
    const browser = await firefox.launch(
        {
            headless: false
        }
    )

    const context = await browser.newContext();

    const page = await context.newPage();
  page.goto("https://deepai.org/chat");

    let areaTextinput = "#persistentChatbox"
    let buttonEnviar  = "chatSubmitButton"

    await page.waitForSelector(areaTextinput, {timeout: 0});
    console.log("aqui")
    await page.locator(areaTextinput).type("estudei recentemente ciências humanas no médio, não tive boas experiências, mas gostaria de fazer um curso moderno com abertura no mercado, nos tempo livre gosta de consumir conteúdos   ligado a saúde e acho que gosto muito desse tipo de conteúdo")

    await page.evaluate(()=>{
        document.querySelector("#chatSubmitButton").click()
    })

    console.log("aqui")
    await page.waitForTimeout(8000*0.10)

    await page.waitForSelector('[cclass="outputBox"] ', {timeout: 0})
   let response =  await page.evaluate(()=>{
      return  document.querySelector('[class="outputBox"]').innerHTML
    })

    arrayResutl.push({
        id: 1, text: response
    })
console.log(response)
 

return arrayResutl
})()