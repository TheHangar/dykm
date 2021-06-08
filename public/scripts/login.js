
    let userInfos = {}


function digestMessage(message) {
    const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
    const hashBuffer = crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
    const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
    return hashHex;
}

function checkInputValue(arr) {

    arr.forEach(input => {
        console.log(input.value)
        if (input.value === "") {
            return false
        }
        else {
            if (input.type = "email") {
                userInfos["email"] = input.value
            }
            else if (input.type === "password") {
                 
                
                const digestHex =  digestMessage(input.value);
                setTimeout(() => {
                    
                    console.log(digestHex);
                }, 5000);
            }
        }
    })

    return true
}


window.addEventListener("load", ()=> {
    let inputs = document.querySelectorAll("input");
    

    document.querySelector("#login-btn").addEventListener("click", function() {
        dataCorrect = checkInputValue(inputs)

        if (dataCorrect) {

        }
        else {
            console.log("error, data incomplete")
        }
    })
})