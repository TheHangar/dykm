import '../style/LoginPage.css'

export default function LoginPage () {



    return (
        <div id="login-screen">
            <h1>Do You Know Me ?</h1>
            <div id="login-form">
                <input class="dykm-input" type="email" placeholder="email address" />
                <input class="dykm-input" type="password" placeholder="Password" />
                <div class="dykm-btn" id="login-btn">Connexion</div>
            </div>
            <p>Do not have account yet ? <a href="#">Create account</a>.</p>
        </div>
    )
}