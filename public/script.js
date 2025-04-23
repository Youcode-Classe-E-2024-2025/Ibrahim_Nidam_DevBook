const registerForm = document.getElementById('registerForm');

if(registerForm){
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const name = document.getElementById('regName').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;

        const res = await fetch ('/auth/register', {
            method : 'POST',
            headers : {'content-type' : 'application/json'},
            body : JSON.stringify({name, email, password})
        });

        const data = await res.json();
        if(data) {
            window.location.href = 'login.html';
        }

        const regMsg = document.getElementById('regMsg');
        regMsg.innerText = data.message || data.error;
        registerForm.reset();
    })
}

const loginForm = document.getElementById('loginForm');

if(loginForm){
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const res = await fetch('/auth/login', {
            method : 'POST',
            headers : {'content-type' : 'application/json'},
            body : JSON.stringify({email, password})
        });

        const data = await res.json();

        if(data.token){
            localStorage.setItem('token', data.token);
            window.location.href = 'index.html';
        } else {
            const loginMsg = document.getElementById('loginMsg');
            loginMsg.innerText = data.error || 'login failed';
        }
    });
}

