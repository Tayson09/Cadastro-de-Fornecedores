document.addEventListener('DOMContentLoaded', () => {
    let fornecedores = [];

    document.getElementById('form-cadastro').addEventListener('submit', function(event) {
        event.preventDefault();

        const nome = document.getElementById('name').value.trim();
        const cnpj = document.getElementById('cnpj').value.trim();
        const telefone = document.getElementById('phone').value.trim();

        if (!nome || !validarCNPJ(cnpj) || !validarTelefone(telefone)) {
            exibirMensagem('Por favor, preencha todos os campos corretamente.', 'erro');
            return;
        }

        const fornecedorExistenteIndex = fornecedores.findIndex(fornecedor => fornecedor.cnpj === cnpj);

        if (fornecedorExistenteIndex !== -1) {
            exibirMensagem('Fornecedor com este CNPJ já existe!', 'erro');
            return;
        }

        fornecedores.push({
            nome,
            cnpj,
            telefone
        });

        exibirMensagem('Fornecedor cadastrado com sucesso!', 'sucesso');
        this.reset();
        atualizarListaFornecedores();
    });

    function validarCNPJ(cnpj) {
        const cnpjFormatado = cnpj.replace(/[^\d]+/g, '');
        return cnpjFormatado.length === 14;
    }

    function validarTelefone(telefone) {
        const telefoneFormatado = telefone.replace(/[^\d]+/g, '');
        return telefoneFormatado.length >= 10 && telefoneFormatado.length <= 11;
    }

    function exibirMensagem(mensagem, tipo = 'sucesso') {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.textContent = mensagem;
        document.body.appendChild(mensagemDiv);

        setTimeout(() => {
            mensagemDiv.remove();
        }, 3000);
    }

    function atualizarListaFornecedores() {
        const listaDiv = document.getElementById('fornecedores-lista');
        listaDiv.innerHTML = '';

        fornecedores.forEach((fornecedor, index) => {
            const fornecedorItem = document.createElement('div');
            fornecedorItem.className = 'fornecedor-item';
            fornecedorItem.innerHTML = `
                <h3>${fornecedor.nome}</h3>
                <p><strong>CNPJ:</strong> ${fornecedor.cnpj}</p>
                <p><strong>Telefone:</strong> ${fornecedor.telefone}</p>
                <button class="btn-editar" data-index="${index}">Editar</button>
                <button class="btn-excluir" data-index="${index}">Excluir</button>
            `;
            listaDiv.appendChild(fornecedorItem);
        });

        adicionarEventosBotoes();
    }

    function adicionarEventosBotoes() {
        const botoesEditar = document.querySelectorAll('.btn-editar');
        const botoesExcluir = document.querySelectorAll('.btn-excluir');

        botoesEditar.forEach(botao => {
            botao.addEventListener('click', editarFornecedor);
        });

        botoesExcluir.forEach(botao => {
            botao.addEventListener('click', excluirFornecedor);
        });
    }

    function editarFornecedor(event) {
        const index = event.target.getAttribute('data-index');
        const fornecedor = fornecedores[index];

        document.getElementById('name').value = fornecedor.nome;
        document.getElementById('cnpj').value = fornecedor.cnpj;
        document.getElementById('phone').value = fornecedor.telefone;

        // Remover fornecedor antigo para substituí-lo pelo novo
        fornecedores.splice(index, 1);

        exibirMensagem('Edite os campos e envie novamente.', 'sucesso');
    }

    function excluirFornecedor(event) {
        const index = event.target.getAttribute('data-index');
        fornecedores.splice(index, 1);
        exibirMensagem('Fornecedor excluído com sucesso!', 'sucesso');
        atualizarListaFornecedores();
    }
});
