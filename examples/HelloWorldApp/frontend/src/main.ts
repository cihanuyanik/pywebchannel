import {API} from "./api/CommandAPI.ts";

API.connect().then(() => {
  if (API.isConnected()) {
    console.log("Successfully connected to backend")
  }
}).catch((error) => {
  console.log(error)
})


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



