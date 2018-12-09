
function criarItems() {
    let items = pegarDadosCompras();
    items.forEach(item => {
        let produto = `
        <div class="card">
            <img class="card-img-top" src="./img/${item.imagem}"
                alt="Card image cap">
            <div class="card-body">
                <h5 class="text-info">${item.nome}</h5>
                <dl class="row">
                    <dt class="col-sm-4">Valor total:</dt>
                    <p class="card-text">${parseFloat(item.qtd) * parseFloat(item.preco)}</p>
                </dl>
                <label class="sr-only" for="inlineFormInputName2">Name</label>
                <dl class="row">
                    <dt class="col-sm-4">Quantidade:</dt>
                    <dd class="col-sm-2">${item.qtd}</dd>
                </dl>
            </div>
        </div>
        `;
        $('#items').append(produto);
    });
}

function pegarTotalCompras() {
    let compras = pegarDadosCompras();
    let total = compras.reduce(function(a, b) {
        return parseInt(b.qtd) * parseInt(a.preco) + b;
    })
    return total;
}

function pegarDadosCompras() {
    let compras = window.localStorage.getItem('produtos');
    return JSON.parse(compras);
}

window.addEventListener('load', function(event) {
    criarItems();
});