// seleciona o contador de dias se existir na página
const counter = document.getElementById('days-left');

if (counter) {
  // data do aniversário/meta
  const birthday = new Date('2025-11-19');
  const today = new Date();
  // diferença em ms, depois transforma em dias
  const timeDiff = birthday - today;
  const finalDays = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

  let current = 0;
  const target = finalDays;
  const speed = 30; // velocidade da animação (quanto menor, mais rápido)

  // função que faz a contagem animada até chegar no total
  const animateCounter = () => {
    if (current < target) {
      current++;
      counter.textContent = current; // atualiza na tela
      setTimeout(animateCounter, speed); // chama de novo até chegar no alvo
    } else {
      counter.textContent = target; // garante o valor final certinho
    }
  };

  animateCounter();
}

// parte de envio de mensagem no formulário
const form = document.getElementById('mensagem-form');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault(); // evita que a página recarregue

    const nome = form.nome.value;
    const conteudo = form.mensagem.value;

    // envia a mensagem pro servidor
    await fetch('/mensagens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, conteudo })
    });

    form.reset(); // limpa o formulário
    carregarMensagens(); // recarrega o mural depois de enviar
  });
}

// busca as mensagens no servidor e joga na tela
async function carregarMensagens() {
  const container = document.getElementById('mensagens');
  if (!container) return; // se não tiver mural na página, não faz nada

  const res = await fetch('/mensagens');
  const mensagens = await res.json();

  // monta o HTML das mensagens
  container.innerHTML = mensagens.map(msg => `
    <div class="mensagem">
      <strong>${msg.nome}</strong> disse:<br>
      <em>${msg.conteudo}</em><br>
      <small>${new Date(msg.createdAt).toLocaleString('pt-BR')}</small>
    </div>
  `).join('');
}

// chama a função logo no começo pra já mostrar algo
carregarMensagens();
