import {API} from "./api/CommandAPI.ts";

await API.connect()

if (API.isConnected()) {
  console.log("Successfully connected to backend")
}

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
  <div> 
    <input id="input">
    <button id="button">Say Hi</button>
  </div>
`

const input = document.querySelector<HTMLInputElement>('#input');
const button = document.querySelector<HTMLButtonElement>('#button');
button?.addEventListener('click', async () => {
  console.log(input?.value)
  const response = await API.HelloWorldController.sayHello(input?.value)
  
  if (response.error) {
    console.log(response.error)
    return
  }

  if (response.success) {
    alert(response.success)
    return
  }

  if (response.data) {
    alert(JSON.stringify(response.data))
    return
  }


})



