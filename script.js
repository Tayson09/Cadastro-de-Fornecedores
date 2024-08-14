function carregarFornecedores() {
    const fornecedoresSalvos = localStorage.getItem('fornecedores');
    return fornecedoresSalvos ? JSON.parse(fornecedoresSalvos) : [];
}

function salvarFornecedores() {
    localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
}

let fornecedores = carregarFornecedores();
let fornecedorEmEdicao = null;

function cadastrarFornecedor(event) {
    event.preventDefault();
    
    const nome = document.getElementById('name').value;
    const cnpj = document.getElementById('cnpj').value;
    const representante = document.getElementById('repr').value;
    const endereco = document.getElementById('address').value;
    const telefone = document.getElementById('phone').value;
    const website = document.getElementById('website').value;

    const fornecedor = {
        id: fornecedorEmEdicao ? fornecedorEmEdicao.id : Date.now(),
        nome,
        cnpj,
        representante,
        endereco,
        telefone,
        website
    };

    if (fornecedorEmEdicao) {
        const index = fornecedores.findIndex(f => f.id === fornecedorEmEdicao.id);
        fornecedores[index] = fornecedor;
        fornecedorEmEdicao = null;
    } else {
        fornecedores.push(fornecedor);
    }

    salvarFornecedores();
    document.querySelector('form').reset();
    listarFornecedores();
}

function listarFornecedores() {
    const lista = document.querySelector('.contact-date');
    lista.innerHTML = '';

    fornecedores.forEach(fornecedor => {
        const fornecedorItem = document.createElement('div');
        fornecedorItem.classList.add('fornecedor-item');
        fornecedorItem.innerHTML = `
            <h3>${fornecedor.nome}</h3>
            <p>CNPJ: ${fornecedor.cnpj}</p>
            <p>Representante: ${fornecedor.representante}</p>
            <p>Endereço: ${fornecedor.endereco}</p>
            <p>Telefone: ${fornecedor.telefone}</p>
            <p>Website: ${fornecedor.website}</p>
            <button onclick="editarFornecedor(${fornecedor.id})">Editar</button>
            <button onclick="excluirFornecedor(${fornecedor.id})">Excluir</button>
        `;
        lista.appendChild(fornecedorItem);
    });
}

function editarFornecedor(id) {
    fornecedorEmEdicao = fornecedores.find(f => f.id === id);
    if (fornecedorEmEdicao) {
        document.getElementById('name').value = fornecedorEmEdicao.nome;
        document.getElementById('cnpj').value = fornecedorEmEdicao.cnpj;
        document.getElementById('repr').value = fornecedorEmEdicao.representante;
        document.getElementById('address').value = fornecedorEmEdicao.endereco;
        document.getElementById('phone').value = fornecedorEmEdicao.telefone;
        document.getElementById('website').value = fornecedorEmEdicao.website;
    }
}

function excluirFornecedor(id) {
    if (confirm('Tem certeza que deseja excluir este fornecedor?')) {
        fornecedores = fornecedores.filter(f => f.id !== id);
        salvarFornecedores();
        listarFornecedores();
    }
}

document.addEventListener('DOMContentLoaded', listarFornecedores);
document.querySelector('form').addEventListener('submit', cadastrarFornecedor);
