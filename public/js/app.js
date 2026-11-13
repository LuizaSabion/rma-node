const TIPOS_DEFEITO = {
    TELA: "Tela / display",
    BATERIA: "Bateria",
    PLACA: "Placa-mãe",
    CONECTOR: "Conector / porta de carga",
    SOFTWARE: "Software / firmware"
};

const NOME_STATUS = {
    ABERTO: "Aberto",
    EM_LABORATORIO: "No laboratório",
    REPARADO: "Reparado",
    SUBSTITUIDO: "Substituído",
    REPROVADO: "Reprovado"
};

function $(id) {
    return document.getElementById(id);
}

async function chamarApi(caminho, opcoes) {
    const resposta = await fetch("/api" + caminho, opcoes);
    const dados = await resposta.json();

    if (!resposta.ok) {
        throw new Error(dados.mensagem || "Erro ao falar com o servidor.");
    }

    return dados;
}

async function buscarFila(filtro) {
    return chamarApi("/sinistros?status=" + filtro, { method: "GET" });
}

async function buscarEstatisticas() {
    return chamarApi("/sinistros/estatisticas", { method: "GET" });
}

async function abrirSinistroNaApi(dados) {
    return chamarApi("/sinistros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });
}

async function enviarParaLaboratorioNaApi(id) {
    return chamarApi("/sinistros/" + id + "/enviar-laboratorio", { method: "POST" });
}

async function emitirLaudoNaApi(id, decisao, laudo) {
    return chamarApi("/sinistros/" + id + "/laudo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ decisao: decisao, laudo: laudo })
    });
}

async function atualizarTela() {
    await renderizarEstatisticas();
    await renderizarFila();
}

async function renderizarEstatisticas() {
    const stats = await buscarEstatisticas();

    const cards = [
        ["Total", stats.total],
        ["Abertos", stats.abertos],
        ["No laboratório", stats.laboratorio],
        ["Reparados", stats.reparados],
        ["Substituídos", stats.substituidos]
    ];

    let html = "";
    for (const card of cards) {
        html += `<div class="stat"><b>${card[1]}</b><small>${card[0]}</small></div>`;
    }
    $("stats").innerHTML = html;
}

async function renderizarFila() {
    const filtroAtual = $("filtro").value;
    const itens = await buscarFila(filtroAtual);

    if (itens.length === 0) {
        $("lista").innerHTML = "<p>Nenhum sinistro nesta fila.</p>";
        return;
    }

    let html = "";

    itens.forEach(function (s) {
        const podeAnalisar = (s.status === "ABERTO" || s.status === "EM_LABORATORIO");

        html += `
        <div class="item">
            <div>
                <span class="tag ${s.severidade}">${s.severidade}</span>
                <span class="tag ${s.status}">${NOME_STATUS[s.status]}</span>
                <b>${s.cliente}</b> - ${s.dispositivo || "sem modelo informado"} - ${TIPOS_DEFEITO[s.tipoDefeito]}
                <p>Nº série: ${s.numeroSerie}</p>
                <p>${s.descricaoDefeito}</p>
                ${s.laudo ? "<p>Laudo: " + s.laudo + "</p>" : ""}
            </div>
            ${podeAnalisar ? `<button class="btn" onclick="abrirPainel('${s.id}')">Analisar</button>` : ""}
        </div>`;
    });

    $("lista").innerHTML = html;
}

async function abrirPainel(id) {
    try {
        const todos = await buscarFila("TODOS");
        let sinistro = todos.find((s) => s.id === id);

        if (sinistro.status === "ABERTO") {
            sinistro = await enviarParaLaboratorioNaApi(id);
        }

        const painelHtml = `
            <h2>Laudo técnico</h2>
            <p>
                <b>${sinistro.cliente}</b> - ${sinistro.dispositivo || "sem modelo informado"} - ${TIPOS_DEFEITO[sinistro.tipoDefeito]}
                <span class="tag ${sinistro.severidade}">${sinistro.severidade}</span>
            </p>
            <p>Nº de série: ${sinistro.numeroSerie}</p>
            <p>${sinistro.descricaoDefeito}</p>

            <label>Descrição do laudo
                <textarea id="laudo" rows="3"></textarea>
            </label>
            <p id="erro" class="msg err"></p>

            <div class="actions">
                <button class="btn ok" onclick="decidir('${sinistro.id}', 'REPARADO')">Reparado</button>
                <button class="btn warn" onclick="decidir('${sinistro.id}', 'SUBSTITUIDO')">Substituir aparelho</button>
                <button class="btn danger" onclick="decidir('${sinistro.id}', 'REPROVADO')">Reprovar garantia</button>
                <button class="btn" onclick="fecharPainel()">Fechar</button>
            </div>
        `;

        $("painel").innerHTML = painelHtml;
        $("modal").classList.remove("hidden");
        await atualizarTela();

    } catch (erro) {
        alert(erro.message);
    }
}

async function decidir(id, decisao) {
    try {
        const laudo = $("laudo").value;
        await emitirLaudoNaApi(id, decisao, laudo);
        fecharPainel();
        await atualizarTela();
    } catch (erro) {
        $("erro").textContent = erro.message;
    }
}

function fecharPainel() {
    $("modal").classList.add("hidden");
    atualizarTela();
}

function preencherSelects() {
    let opcoesDefeito = "";
    for (const chave in TIPOS_DEFEITO) {
        opcoesDefeito += `<option value="${chave}">${TIPOS_DEFEITO[chave]}</option>`;
    }
    $("tipoDefeito").innerHTML = opcoesDefeito;

    let opcoesFiltro = '<option value="TODOS">Todos</option>';
    for (const chave in NOME_STATUS) {
        opcoesFiltro += `<option value="${chave}">${NOME_STATUS[chave]}</option>`;
    }
    $("filtro").innerHTML = opcoesFiltro;
}

$("form-sinistro").addEventListener("submit", async function (evento) {
    evento.preventDefault();

    try {
        await abrirSinistroNaApi({
            cliente: $("cliente").value,
            dispositivo: $("dispositivo").value,
            numeroSerie: $("numeroSerie").value,
            tipoDefeito: $("tipoDefeito").value,
            descricaoDefeito: $("descricaoDefeito").value
        });

        evento.target.reset();
        $("msg").className = "msg good";
        $("msg").textContent = "Sinistro aberto e adicionado à fila!";
        await atualizarTela();

    } catch (erro) {
        $("msg").className = "msg err";
        $("msg").textContent = erro.message;
    }
});

preencherSelects();
$("filtro").addEventListener("change", renderizarFila);

atualizarTela();
