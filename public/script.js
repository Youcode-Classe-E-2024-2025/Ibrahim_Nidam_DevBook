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

const token = localStorage.getItem('token');
const decoded = jwt_decode(token);
const userId = decoded.userId;

async function loadBooks() {
    const res = await fetch('/books', {
        headers : {authorization : `Bearer ${token}`}
    });

    const books = await res.json();

    const listDiv = document.getElementById('bookList');

    if (Array.isArray(books)) {
        listDiv.innerHTML = books.map(book => {
            let action = '';
            if (book.is_loaned && book.loaned_by_user) {
                action = ` <em>(Loaned)</em> <button onclick="returnBook(${book.id})">Return</button>`;
            } else if (!book.is_loaned) {
                action = `<button onclick="loanBook(${book.id})">Loan</button>`;
            } else {
                action = '<em>(Loaned)</em>';
            }
                return `
                <div>
                    <strong>${book.title}</strong> by ${book.author} ${action}
                </div>
                `;
            }).join('');
    } else {
        listDiv.innerHTML = '<p>Error loading books</p>';
    }
}

const addForm = document.getElementById('addBookForm');

if(addForm){
    addForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const category_id = document.getElementById('categorySelect').value;

        const res = await fetch('/books/add', {
            method : 'POST',
            headers : {
                    'content-type': 'application/json',
                    authorization : `Bearer ${token}`
            },
            body: JSON.stringify({title, author, category_id})
        });

        const data = await res.json();

        document.getElementById('msg').innerText = data.error || data.message;
        loadBooks();
    });
}

async function loanBook(bookId){
    const res = await fetch (`/books/loan/${bookId}`, {
        method : 'PUT',
        headers : {authorization : `Bearer ${token}`}
    });

    const data = await res.json();
    document.getElementById('msg').innerText = data.message || data.error;
    loadBooks();
}

async function logout(){
    localStorage.removeItem('token');
    window.location.href = 'login.html';
}

if(window.location.pathname.endsWith('index.html')){
    if(!token){
        window.location.href = 'login.html';
    }
}

async function loanedBooks() {
    const res = await fetch('/books/getloans', {
        headers : {authorization : `Bearer ${token}`}
    });

    const books = await res.json();

    alert("Your Loaned Books : \n" + books.map(book => `${book.title} by ${book.author}`).join('\n'));
}

async function returnBook(bookId) {
    const res = await fetch (`/books/return/${bookId}`, {
        method : 'PUT',
        headers : {authorization : `Bearer ${token}`}
    });

    const data = await res.json();
    document.getElementById('msg').innerText = data.message || data.error;
    loadBooks();
}

