const API_URL1 = "http://rem-rest-api.herokuapp.com/api/"
const API_URL = "http://rest.learncode.academy/api/rute/"
function criarGrupoElemento(nomeGrupo, id) {

    let grupo = document.createElement("div");
    let img = document.createElement("img");
    let nome = document.createElement("div");

    grupo.setAttribute("class", "grupo");
    img.setAttribute("class", "foto");
    nome.setAttribute("class", "nome");
    grupo.setAttribute("id", "grupo-" + id);
    img.setAttribute("src", "perfil.jpg");

    nome.innerText = nomeGrupo;

    grupo.appendChild(img);
    grupo.appendChild(nome);

    return grupo;
}

function criarMensagemElemento(usuario, texto) {
    let msgDiv = document.createElement("div");
    let tituloDiv = document.createElement("div");
    let titulo = document.createElement("h3");
    let textoDiv = document.createElement("div");

    msgDiv.setAttribute("class", "panel panel-default");
    tituloDiv.setAttribute("class", "panel-heading");
    titulo.setAttribute("class", "panel-title");
    textoDiv.setAttribute("class", "panel-body");

    msgDiv.appendChild(tituloDiv);
    msgDiv.appendChild(textoDiv);
    tituloDiv.appendChild(titulo);

    titulo.innerText = usuario;
    textoDiv.innerText = texto;

    return msgDiv;
}

function configurarGrupos() {
    let listaGrupos = document.getElementsByClassName("grupo");
    [...listaGrupos].forEach(function (gp) {
        configurarNovoGrupo(gp, [...listaGrupos]);
    });
}

function configurarNovoGrupo(grupo, listaGrupos) {
    let id = grupo.getAttribute("id").replace("grupo-");
    let nome = grupo.children[1].innerText;
    grupo.addEventListener("click", function() {
        window.localStorage.setItem("grupoid", id);
        atualizarSelecionados(grupo, [...listaGrupos]);
        atualizarTituloConversa(nome);
        gerarMensagens(id);
    });
}

function gerarGrupos() {

    let promise = fetch(API_URL + "groups");
    let resultadoJSON = promise.then(res => res.json());
    resultadoJSON.then(function(grupos) {
        console.log(grupos)
        mostrarGrupos(grupos);
        configurarGrupos();
    });
}

function gerarMensagens(grupoid) {
    let promise = fetch(API_URL + grupoid);
    let resultadoJSON = promise.then(res => res.json());
    resultadoJSON.then(msgs => {
        mostrarMensagensGrupo(msgs);
    });
}

function mostrarGrupos(grupos) {
    let listaGrupo = document.getElementById("listafriends");

    grupos.forEach(function (el) {
        let gp = criarGrupoElemento(el.groupName, el.groupId);
        listaGrupo.appendChild(gp);
    });
}

function atualizarTituloConversa(nomeGrupo) {
    document.getElementById('titulo-conversa').innerHTML = nomeGrupo;
}

function atualizarSelecionados(grupoDOM, listaGrupos) {
    listaGrupos.forEach(function(grupo) {
        grupo.setAttribute("class", "grupo");
    })
    grupoDOM.classList.add("grupo-selecionado");
}

function mostrarMensagensGrupo(mensagens) {
    let mensagensDiv = document.getElementById("mensagens");
    mensagensDiv.innerHTML = "";
    mensagens.forEach(function (msg) {
        let msgElemento = criarMensagemElemento(msg.userName, msg.message);
        mensagensDiv.appendChild(msgElemento);
    });
}

async function enviarMensagem(event) {
    event.preventDefault();
    let campoMsg = document.getElementById("input-msg");
    let groupid = window.localStorage.getItem("grupoid");
    let userid = window.localStorage.getItem("userid");
    let msgUser = {userName: userid, message: campoMsg.value};
    campoMsg.value = "";
    let resposta = await fetch(API_URL + groupid, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(msgUser)
    });
    let msg = await resposta.json();
    let msgElemento = criarMensagemElemento(userid, msgUser.message);
    
    let mensagensDiv = document.getElementById("mensagens");
    mensagensDiv.appendChild(msgElemento);
}

function userLogado() {
    let id = window.localStorage.getItem("userid");
    return !!id;
}
function logar(event) {
    event.preventDefault();
    let botao = document.getElementById("entrar");
    let loginInput = document.getElementById("login-input");

    window.localStorage.setItem("userid", loginInput.value);
    botao.innerHTML = "Sair";
    loginInput.value = "";
    fecharModal();
}
function deslogar() {
    let botao = document.getElementById("entrar");
    window.localStorage.removeItem("userid");
    botao.innerHTML = "Entrar";
}
function permitir() {
    if(userLogado()) {
        deslogar()
    }
    else {
        return mostrarModal();
    }
}
function mostrarModal() {
    let modalOverlay = document.getElementById("modal-overlay");
    modalOverlay.classList.add("active");
}
function fecharModal() {
    let modalOverlay = document.getElementById("modal-overlay");
    modalOverlay.classList.remove("active");
}
function configurarModal() {
    let modalOverlay = document.getElementById("modal-overlay")
    let close = document.getElementById("close");
    let formul = document.getElementById("formulario");

    formul.addEventListener("submit", logar);

    close.addEventListener("click", function () {
        modalOverlay.classList.remove("active");
    }) 

    window.addEventListener("click", function (event) {
        if (event.target == modalOverlay)
            modalOverlay.classList.remove("active");
    })
}

async function enviarGp(grupo) {
    let resposta = await fetch(API_URL + grupo.groupID, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(grupo)
    });
    let resultado = await resposta.json();
    let grupoElemento = criarGrupoElemento(resultado.groupName, resultado.groupID);
    document.getElementById("listafriends").appendChild(grupoElemento);
    configurarNovoGrupo(grupoElemento, document.getElementsByClassName("grupo"));
}

function criarGp(event) {
    let nomeGp = document.getElementById("gruponome");
    let idGp = document.getElementById("grupoid");
    if(nomeGp.value && idGp.value) {
        event.preventDefault();
        let grupo = {groupName: nomeGp.value, groupID: idGp.value};
        nomeGp.value = "";
        idGp.value = "";
        enviarGp(grupo);
    }
}

window.addEventListener("load", function () {
    gerarGrupos();
    configurarModal();
    
    let botaoLogin = document.getElementById("entrar");
    botaoLogin.addEventListener("click", permitir);
    let botaoCriarGrupo = this.document.getElementById("criargrupo-button");
    botaoCriarGrupo.addEventListener("click", criarGp);
    document.getElementById("campo-msg").addEventListener("submit", enviarMensagem);
});