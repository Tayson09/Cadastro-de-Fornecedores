document.addEventListener('DOMContentLoaded', () => {
    let fornecedores = JSON.parse(localStorage.getItem('fornecedores')) || [];

    const form = document.getElementById('form-cadastro');
    const listaDiv = document.getElementById('fornecedores-lista');

    // Carregar lista de fornecedores ao iniciar
    atualizarListaFornecedores();

    form.addEventListener('submit', function (event) {
        event.preventDefault();

        const nome = document.getElementById('name').value.trim();
        const cnpj = document.getElementById('cnpj').value.trim();
        const telefone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();
        const website = document.getElementById('website').value.trim();

        // Validações
        if (!nome) {
            exibirMensagem('Por favor, insira o nome do fornecedor.', 'erro');
            return;
        }

        if (!validarCNPJ(cnpj)) {
            exibirMensagem('CNPJ inválido. Insira um CNPJ válido com 14 dígitos.', 'erro');
            return;
        }

        if (!validarTelefone(telefone)) {
            exibirMensagem('Telefone inválido. Insira um telefone com 10 ou 11 dígitos.', 'erro');
            return;
        }

        if (email && !validarEmail(email)) {
            exibirMensagem('E-mail inválido. Insira um e-mail válido.', 'erro');
            return;
        }

        // Verificar se o CNPJ já existe
        const fornecedorExistenteIndex = fornecedores.findIndex(fornecedor => fornecedor.cnpj === cnpj);

        if (fornecedorExistenteIndex !== -1) {
            exibirMensagem('Fornecedor com este CNPJ já existe!', 'erro');
            return;
        }

        // Adicionar fornecedor
        fornecedores.push({ nome, cnpj, telefone, email, website });
        salvarFornecedores();
        exibirMensagem('Fornecedor cadastrado com sucesso!', 'sucesso');
        form.reset();
        atualizarListaFornecedores();
    });

    // Funções de validação
    function validarCNPJ(cnpj) {
        const cnpjFormatado = cnpj.replace(/[^\d]+/g, '');
        return cnpjFormatado.length === 14;
    }

    function validarTelefone(telefone) {
        const telefoneFormatado = telefone.replace(/[^\d]+/g, '');
        return telefoneFormatado.length >= 10 && telefoneFormatado.length <= 11;
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Função para exibir mensagens
    function exibirMensagem(mensagem, tipo = 'sucesso') {
        const mensagemDiv = document.createElement('div');
        mensagemDiv.className = `mensagem ${tipo}`;
        mensagemDiv.textContent = mensagem;
        document.body.appendChild(mensagemDiv);

        setTimeout(() => {
            mensagemDiv.remove();
        }, 3000);
    }

    // Função para salvar fornecedores no localStorage
    function salvarFornecedores() {
        localStorage.setItem('fornecedores', JSON.stringify(fornecedores));
    }

    // Função para atualizar a lista de fornecedores na tela
    function atualizarListaFornecedores() {
        listaDiv.innerHTML = '';

        fornecedores.forEach((fornecedor, index) => {
            const fornecedorItem = document.createElement('div');
            fornecedorItem.className = 'fornecedor-item';
            fornecedorItem.innerHTML = `
                <h3>${fornecedor.nome}</h3>
                <p><strong>CNPJ:</strong> ${fornecedor.cnpj}</p>
                <p><strong>Telefone:</strong> ${fornecedor.telefone}</p>
                ${fornecedor.email ? `<p><strong>E-mail:</strong> ${fornecedor.email}</p>` : ''}
                ${fornecedor.website ? `<p><strong>Site:</strong> <a href="${fornecedor.website}" target="_blank">${fornecedor.website}</a></p>` : ''}
                <button class="btn-editar" data-index="${index}">Editar</button>
                <button class="btn-excluir" data-index="${index}">Excluir</button>
            `;
            listaDiv.appendChild(fornecedorItem);
        });

        adicionarEventosBotoes();
    }

    // Função para adicionar eventos aos botões de editar e excluir
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

    // Função para editar um fornecedor
    function editarFornecedor(event) {
        const index = event.target.getAttribute('data-index');
        const fornecedor = fornecedores[index];

        // Preencher o formulário com os dados do fornecedor
        document.getElementById('name').value = fornecedor.nome;
        document.getElementById('cnpj').value = fornecedor.cnpj;
        document.getElementById('phone').value = fornecedor.telefone;
        document.getElementById('email').value = fornecedor.email;
        document.getElementById('website').value = fornecedor.website;

        // Remover o fornecedor da lista para edição
        fornecedores.splice(index, 1);
        salvarFornecedores();
        atualizarListaFornecedores();

        exibirMensagem('Edite os campos e envie novamente.', 'sucesso');
    }

    // Função para excluir um fornecedor
    function excluirFornecedor(event) {
        const index = event.target.getAttribute('data-index');
        fornecedores.splice(index, 1);
        salvarFornecedores();
        exibirMensagem('Fornecedor excluído com sucesso!', 'sucesso');
        atualizarListaFornecedores();
    }
});
