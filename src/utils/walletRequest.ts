import hexer from "./hexer"


export function ethereumRequest(method, params) {
  window.ethereum.request({ 
    method: 'personal_sign', 
    params: [accounts[0], hexer('helw')]
  }).then((res) => {
    console.log(res)
  }).catch((error) => {
    console.log(error)
  }) 
} 
