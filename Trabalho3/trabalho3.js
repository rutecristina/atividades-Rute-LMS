const url =  "http://rem-rest-api.herokuapp.com/api"

function login() {
    console.log('fiwjoifw')
    let usuario = pegarDadosUsuario();
    $.ajax({
        type : 'GET',
        url : url + 'users',
        success : function(data) {
            let user = data.data.find(u => u.email === usuario.email)
            if (user && user.senha === usuario.senha) {
                window.localStorage.setItem('usuario', usuario);
                alert('usuario logado com sucesso');
            }
            else {
                alert('dados incorretos')
            }
        }
    })
}

function pegarDadosUsuario() {
    let email = $('#email').val().toString();
    let senha = $('#senha').val().toString();
    return {email, senha};
}

window.addEventListener("load", function() {
    $.ajaxSetup({
        withCredentials: true
    })
    $('#logar-button').on('submit', function(event) {
        event.preventDefault();
        login();
    });
})