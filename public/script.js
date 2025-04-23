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
    });
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
                action = `<span class="text-yellow-600 font-semibold">(Loaned)</span> 
                          <button onclick="returnBook(${book.id})" class="ml-2 text-sm text-red-600 hover:underline">Return</button>`;
            } else if (!book.is_loaned) {
                action = `<button onclick="loanBook(${book.id})" class="text-sm text-blue-600 hover:underline">Loan</button>`;
            } else {
                action = '<span class="text-gray-500 italic">(Loaned)</span>';
            }

            return `
                <div class="py-4">
                    <div class="flex justify-between items-center">
                        <div>
                            <h4 class="text-lg font-medium text-gray-800">${book.title}</h4>
                            <p class="text-sm text-gray-500">by ${book.author}</p>
                        </div>
                        <div class="text-right">${action}</div>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        listDiv.innerHTML = '<p class="text-red-600">Error loading books</p>';
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

        const msg = document.getElementById('msg');
        msg.className = "text-sm text-green-700 bg-green-100 px-4 py-2 rounded-md";
        msg.innerText = data.error || data.message;
        loadBooks();
    });
}

async function loanBook(bookId){
    const res = await fetch (`/books/loan/${bookId}`, {
        method : 'PUT',
        headers : {authorization : `Bearer ${token}`}
    });

    const data = await res.json();
    const msg = document.getElementById('msg');
    msg.className = "text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded-md";
    msg.innerText = data.message || data.error;
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

    const msgBox = document.getElementById('msg');
    msgBox.className = "text-sm text-blue-700 bg-blue-100 px-4 py-2 rounded-md";
    msgBox.innerHTML = `
        <strong>Your Loaned Books:</strong><br>
        ${books.map(book => `<div>📚 <span class="font-medium">${book.title}</span> by ${book.author}</div>`).join('')}
    `;
}

async function returnBook(bookId) {
    const res = await fetch (`/books/return/${bookId}`, {
        method : 'PUT',
        headers : {authorization : `Bearer ${token}`}
    });

    const data = await res.json();
    const msg = document.getElementById('msg');
    msg.className = "text-sm text-green-700 bg-green-100 px-4 py-2 rounded-md";
    msg.innerText = data.message || data.error;
    loadBooks();
}

async function loadCategories() {
    const res = await fetch('/categories', {
        headers : {authorization : `Bearer ${token}`}
    });
    const categories = await res.json();
    const select = document.getElementById('categorySelect');
    select.innerHTML = categories.map(cat =>
        `<option value="${cat.id}">${cat.name}</option>`
    ).join('');
}

document.addEventListener('DOMContentLoaded', () => {
    loadBooks();
    loadCategories(); 
});