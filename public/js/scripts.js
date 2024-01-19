var socket = io();

socket.on('messages', function(data) {
    render(data);
});

socket.on('private-message', function(data) {
    data.esPrivado = true;
    render([data]);
});

socket.on('update-users', function(users) {
    var usersListHtml = users.map(function(user) {
        return `<li id="${user}" class="user" onclick="toggleUser('${user}')">${user}</a></li>`;
    }).join("");
    document.getElementById('usersList').innerHTML = usersListHtml;
});

function addMessage(e) {
    e.preventDefault(); // Evita el comportamiento predeterminado del formulario

    var message = {
        autor: document.getElementById("username").value,
        texto: document.getElementById("texto").value,
        destinatario: document.getElementById("destinatario").value
    };
    socket.emit("new-message", message);
    document.getElementById("texto").value = '';
}

document.getElementById("texto").addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addMessage(e);
    }
});

function render(data) {
    var html = data.map(function(elem) {
        if (elem.esPrivado) {
            return(`<div style="color: red;">
                        <strong>MENSAJE PRIVADO DE ${elem.autor}</strong>:
                        <em>${elem.texto}</em>
                    </div>`);
        } else {
            return(`<div>
                        <strong>${elem.autor}</strong>:
                        <em>${elem.texto}</em>
                    </div>`);
        }
    }).join(" ");
    var chat = document.getElementById('chat');
    chat.innerHTML += html;
    chat.scrollTop = chat.scrollHeight;
}

function toggleUser(user) {
    var userElement = document.getElementById(user);
    if (userElement.classList.contains('selected')) {
        userElement.classList.remove('selected');
        document.getElementById('destinatario').value = '';
    } else {
        document.querySelectorAll('.user').forEach(function(el) {
            el.classList.remove('selected');
        });
        userElement.classList.add('selected');
        document.getElementById('destinatario').value = user;
    }
}

function registerUser() {
    var usuario = document.getElementById("username").value;
    if (usuario.trim() === '') {
        alert('Por favor, ingresa un nombre de usuario.');
        return;
    }

    socket.emit("new-user", usuario);

    document.getElementById('login').style.display = 'none';
    document.getElementById('chat-container').style.display = 'block';
}
