import { useState } from 'react'

import '../style/LoginPage.css'

const crypto = require("crypto")
const hash = crypto.createHash('sha256')

export default function LoginPage () {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    function handleChange (event) {
        if (event.target.type === "email") {
            setEmail(event.target.value)
        }
        else if (event.target.type === "password") {
            setPassword(event.target.value)
        }
        setError("")
    }

    function newAccount() {

    }

    function handleClick(e) {
        if ( document.querySelector("#login-btn").disabled !== true ) {

            document.querySelector("#login-btn").disabled = true
            setIsLoading(true)

            const hashPwd = hash.update(password).digest('hex')
            
            window.fetch('/loggin', {
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                method: "POST",
                body: JSON.stringify({ 'email': email, 'password': hashPwd })
            })
            .then(rep => {
                if (rep.status === 200) {
                    //jsp encore
                    //set or receive & store JWT ?
                }
                else if (rep.status >= 500 && rep.status <= 599) {
                    setError('Server error, please try again or later.')                    
                    document.querySelector("#login-btn").disabled = false
                }
                else if (rep.status === 401) {
                    setError('Invalid email or password, please try again.')
                    document.querySelector("#login-btn").disabled = false
                }
                else {
                    setError('Unknow error happend, please try again.')
                    document.querySelector("#login-btn").disabled = false
                }
                document.querySelector("#dykm-input-password").value = ""
                setTimeout(() => {
                    setIsLoading(false)
                }, 1000);
            })
            .catch(err => console.log(err))

        }
        
    }

    return (
        <div id="login-screen">
            <h1>Do You Know Me ?</h1>
            <div id="login-form">
                {error === '' ? null : <p className="errors-infos shake">{error}</p>}
                <div className="login-form-inputs">
                    <input className="dykm-input" type="email" placeholder="email address" onChange={handleChange} />
                    <input id="dykm-input-password" className="dykm-input" type="password" placeholder="Password" onChange={handleChange} />
                </div>
                <button className="dykm-btn" id="login-btn" onClick={handleClick} >Connexion</button>
                {isLoading ? <div className="loader"></div> : null}
            </div>
            <p>Do not have account yet ? <span onClick={newAccount}>Create account</span>.</p>
        </div>
    )
}