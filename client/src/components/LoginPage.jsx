import { useState } from 'react'

import '../style/LoginPage.css'

export default function LoginPage () {

    const crypto = require("crypto")
    const hash = crypto.createHash('sha256')

    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [newAccout, setNewAccout] = useState(true)
    const [userInfo, setUserInfo] = useState({})

    function hashGenerator(word) {
        const hashPwd = hash.update(word).digest('hex')
        return hashPwd
    }

    function addInscriptionDate() {
        //set inscription date
        let date = new Date()
        let month = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "DEC"]
        month = month[date.getMonth()]
        let day = date.getDate()
        let year = date.getFullYear()
        let inscription = `${month}-${day}-${year}`

        return inscription
    }

    function handleChange (event) {
        let data = { ...userInfo }
        data[event.target.dataset.info] = event.target.value
        setUserInfo(data)
        setError("")
    }

    function addUser() {
        
        let infoValid = true
        setIsLoading(true)

        for (let data in userInfo) {
            if (userInfo[data] === "") {
                setError('You should complete all inputs.')
                setIsLoading(false)
                infoValid = false
                return 
            }
            //else if mail format invalid, raise error too
            else if (data === "email") {
                let emailRegex  = /^[a-z\d.]+[-_]?[a-z]+@[a-z\d-]+.[a-z]+$/

                if (emailRegex.test(userInfo[data])) {
                    continue
                }
                else {
                    setError("Email address invalid.")
                    setIsLoading(false)
                    infoValid = false
                    return
                }
            }
        }

        if (infoValid === false) {
            return
        }
        else {
            let pwd1 = userInfo.password
            let pwd2 = userInfo.passwordVerify
            
            if (pwd1 === pwd2) {
                let inscription = addInscriptionDate()
    
                delete userInfo.passwordVerify
                userInfo.password = hashGenerator(userInfo.password)
                userInfo["created_at"] = inscription
    
                window.fetch("/adduser", {
                    headers: {
                        "Accept": "application/json",
                        "Content-Type": "application/json"
                    },
                    method: 'POST',
                    body: JSON.stringify(userInfo)
                })
            }
            else {
                setError('It seems that you did not enter the same password.')
                setIsLoading(false)
                return 
            }
    
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        }

    }

    function loginUser(e) {

        setIsLoading(true)
        
        userInfo.password = hashGenerator(userInfo.password)
        
        window.fetch('/login', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(userInfo)
        })
        .then(rep => {
            if (rep.status === 200) {
                //jsp encore
                //set or receive & store JWT ?
                //send to profile page
            }
            else if (rep.status >= 500 && rep.status <= 599) {
                setError('Server error, please try again or later.')                    
            }
            else if (rep.status === 401) {
                setError('Invalid email or password, please try again.')
            }
            else {
                setError('Unknow error happend, please try again.')
            }
            document.querySelector("#dykm-input-password").value = ""
            setTimeout(() => {
                setIsLoading(false)
            }, 1000);
        })
        .catch(err => console.log(err))

    }

    if (newAccout) {
        return (
            <div id="login-screen">
            <h1>Do You Know Me ?</h1>
            <div id="login-form">
                <h2>Create your account</h2>
                <div className="login-form-inputs">
                    {error === '' ? null : <p className="errors-infos shake">{error}</p>}
                    <input id="dykm-user-firstname" className="dykm-input" data-info="firstname" type="text" placeholder="Your firstname" onChange={handleChange} />
                    <input id="dykm-user-lastname" className="dykm-input" data-info="lastname" type="text" placeholder="Your lastname" onChange={handleChange} />
                    <input id="dykm-user-email" className="dykm-input" data-info="email" type="email" placeholder="Email address" onChange={handleChange} />
                    <input id="dykm-user-password" className="dykm-input" data-info="password" type="password" placeholder="Your password" onChange={handleChange} />
                    <input id="dykm-user-password-verify" className="dykm-input" data-info="passwordVerify" type="password" placeholder="Verify you password" onChange={handleChange} />
                </div>
                {isLoading ? <div className="loader"></div> : <button className="dykm-btn" id="login-btn" onClick={addUser} >Create</button>}
            </div>
            <p>Allready have an account ? <span className="dykm-link" onClick={()=> { setNewAccout(false) }}>Loggin</span>.</p>
        </div>
        )
    }

    else {
        return (
            <div id="login-screen">
                <h1>Do You Know Me ?</h1>
                <div id="login-form">
                    <h2>Login to DYKM</h2>
                    {error === '' ? null : <p className="errors-infos shake">{error}</p>}
                    <div className="login-form-inputs">
                        <input className="dykm-input" type="email" data-info="email" placeholder="email address" onChange={handleChange} />
                        <input id="dykm-input-password" className="dykm-input" type="password" data-info="password" placeholder="Password" onChange={handleChange} />
                    </div>
                    {isLoading ? <div className="loader"></div> : <button className="dykm-btn" id="login-btn" onClick={loginUser} >Login</button>}
                </div>
                <p>Do not have account yet ? <span className="dykm-link" onClick={()=> { setNewAccout(true) }}>Create account</span>.</p>
            </div>
        )
    } 
}