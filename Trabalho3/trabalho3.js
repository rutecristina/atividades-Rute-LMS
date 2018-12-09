const URL =  "http://rem-rest-api.herokuapp.com/api/"
const URL2 = "http://rest.learncode.academy/api/rute/"
const CHAVE_USUARIO = 'usuario'
const CHAVE_CESTA = 'produtos'

function login() {
    let usuario = pegarDadosUsuario();
    ajaxGET('users', function(data) {
        let user = data.find(u => u.email === usuario.email)
        if (user && user.senha === usuario.senha) {
            window.localStorage.setItem(CHAVE_USUARIO, JSON.stringify(user));
            autenticacao()
            alert('usuario logado com sucesso');
        }
        else {
            alert('dados incorretos')
        }
    })
}
function logado() {
    return !! window.localStorage.getItem(CHAVE_USUARIO)
}

function cadastrar() {
    let usuario = pegarDadosUsuario();
    ajaxGET('user', function(data) {
        let user = data.find(u => u.email === usuario.email)
        if(user) {
            alert("Usuário já cadastrado")
        }
        else {
            requisicaoCadastro(usuario)
        }
    }) 
}

function requisicaoCadastro(usuario) {
    ajaxPOST('users', usuario, function(data) {
        window.localStorage.setItem(CHAVE_USUARIO, JSON.stringify(data));
        autenticacao()
        alert('usuario cadastrado');
    });
}

function pegarDadosUsuario() {
    let email = $('#email').val().toString();
    let senha = $('#senha').val().toString();
    return {email, senha};
}

function ajaxGET(caminho, funcaoGET) {
    $.ajax({
        type: 'GET',
        url: URL2 + caminho,
        success: data => funcaoGET(data)
    });
}

function ajaxPOST(caminho, dados, funcaoPOST) {
    $.ajax({
        type: 'POST',
        url: URL2 + caminho,
        data: dados,
        success: data => funcaoPOST(data)
    });
}
function sair() {
    window.localStorage.removeItem(CHAVE_USUARIO)
    autenticacao()
}

function autenticacao () {
    if(logado()) {
        $("#sairbotao").show()
        $("#dropbutton").hide()
        $('#navbarDropdown').show()
        $('.botaoAdicionar').show()
    }
    else {
        $("#sairbotao").hide()
        $("#dropbutton").show()
        $('#navbarDropdown').hide()
        $('.botaoAdicionar').hide()
    }
}

function salvarProduto(produto) {
    let cesta = criarCesta();
    let index = cesta.findIndex(p => p.id === produto.id);
    if(index !== -1) {
        let qtd = parseInt(cesta[index].qtd) + parseInt(produto.qtd);
        cesta[index].qtd = qtd;
    }
    else {
        cesta.push(produto);
    }
    window.localStorage.setItem(CHAVE_CESTA, JSON.stringify(cesta));
}

function pegarProduto(id) {
    let produtos = window.localStorage.getItem(CHAVE_CESTA);
    if(!produtos) return undefined;
    produtos = JSON.parse(produtos);
    let produto = produtos.find(p => p.id === id);
    return produto;
}

function adicionarProduto1() {
    let produto = {
        id: 'bota1',
        imagem: 'bota1.jpg',
        nome: 'Botinha festa',
        preco: '150.00',
        qtd: $('#quantidade1').val().toString()
    }
    let elemento = `<a class="dropdown-item" href="#">${produto.nome} (${produto.qtd})</a>`;
    salvarProduto(produto);
    $('#cesta').prepend(elemento);
    $("#quantidade1").val("")
}

function adicionarProduto2() {
    let produto = {
        id: 'bota2',
        imagem: 'bota2.jpg',
        nome: 'Botinha casual',
        preco: '100.00',
        qtd: $('#quantidade2').val().toString()
    }
    let elemento = `<a class="dropdown-item" href="#">${produto.nome} (${produto.qtd})</a>`;
    salvarProduto(produto);
    $('#cesta').prepend(elemento);
    $("#quantidade2").val("")
}

function adicionarProduto3() {
    let produto = {
        id: 'bota3',
        imagem: 'bota3.jpg',
        nome: 'Botinha show',
        preco: '200.00',
        qtd: $('#quantidade3').val().toString()
    }
    let elemento = `<a class="dropdown-item" href="#">${produto.nome} (${produto.qtd})</a>`;
    salvarProduto(produto);
    $('#cesta').prepend(elemento);
    $("#quantidade3").val("")
}

function criarCesta() {
    let cesta = window.localStorage.getItem(CHAVE_CESTA);
    if (!cesta) {
        cesta = "[]";
        window.localStorage.setItem(CHAVE_CESTA, cesta)
        $('#finalizar').show();
        $('#limparCesta').show();
    }
    return JSON.parse(cesta);
}

function limparCesta() {
    window.localStorage.removeItem(CHAVE_CESTA);
    $('#finalizar').hide()
    $('#limparCesta').hide()
}

window.addEventListener("load", function() {
    autenticacao();
    if(!criarCesta().length) {
        $('#finalizar').hide()
        $('#limparCesta').hide() 
    }
    $.ajaxSetup({
        withCredentials: true
    })
    $('#logar-button').click(function(event) {
        login();
    });
    $('#cadastrar-button').click(function(event) {
        cadastrar();
    })
    $('#sairbotao').click(sair)
    $('#produto1-button').click(adicionarProduto1);
    $('#produto2-button').click(adicionarProduto2);
    $('#produto3-button').click(adicionarProduto3);
    $('#limparCesta').click(limparCesta);
});
