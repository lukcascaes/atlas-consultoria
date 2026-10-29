import { pegar } from './dom';

// Roteamento por hash (#/simulador): funciona sem servidor e sem configurar o Vite,
// porque o navegador nunca envia o que vem depois do "#" para o servidor.

export type Tela = 'inicio' | 'simulador' | 'sensibilidade' | 'historico' | 'metodologia';

interface InfoTela {
  sobretitulo: string;
  titulo: string;
  texto: string;
}

const TELAS: Record<Tela, InfoTela> = {
  inicio: {
    sobretitulo: 'Simulador de Viabilidade',
    titulo: 'Descubra se o seu negócio se paga',
    texto: 'Informe investimento, receita e custos para ver payback, ROI, cenários e o parecer consultivo em segundos.',
  },
  simulador: {
    sobretitulo: 'Simulador',
    titulo: 'Simule a viabilidade',
    texto: 'Preencha os três campos e compare os cenários realista, otimista e pessimista.',
  },
  sensibilidade: {
    sobretitulo: 'Análise de sensibilidade',
    titulo: 'E se os números mudarem?',
    texto: 'Ajuste receita e custos e veja na hora o efeito no lucro, no payback e no ROI.',
  },
  historico: {
    sobretitulo: 'Histórico',
    titulo: 'Suas simulações',
    texto: 'As últimas 10 simulações ficam salvas neste navegador. Recarregue qualquer uma com um clique.',
  },
  metodologia: {
    sobretitulo: 'Metodologia',
    titulo: 'Como calculamos',
    texto: 'Fórmulas, premissas dos cenários e as regras do parecer consultivo.',
  },
};

const TELA_PADRAO: Tela = 'inicio';

/** Type guard: confere se um texto qualquer da URL é uma tela conhecida. */
function ehTela(valor: string): valor is Tela {
  return valor in TELAS;
}

function telaDaUrl(): Tela {
  const nome = location.hash.replace(/^#\/?/, '');
  return ehTela(nome) ? nome : TELA_PADRAO;
}

function mostrar(tela: Tela): void {
  document.querySelectorAll<HTMLElement>('[data-tela]').forEach((el) => {
    el.hidden = el.dataset.tela !== tela;
  });
  document.querySelectorAll<HTMLAnchorElement>('[data-rota]').forEach((link) => {
    if (link.dataset.rota === tela) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });

  const info = TELAS[tela];
  pegar('hero-sobretitulo').textContent = info.sobretitulo;
  pegar('hero-titulo').textContent = info.titulo;
  pegar('hero-texto').textContent = info.texto;
  pegar('hero-acoes').hidden = tela !== 'inicio';
  pegar('hero').classList.toggle('hero--compacto', tela !== 'inicio');
  document.title = `${info.sobretitulo} · Atlas Consultoria`;

  window.scrollTo(0, 0);
}

export function irPara(tela: Tela): void {
  // Se já estamos na tela, o hashchange não dispara; então mostramos direto.
  if (telaDaUrl() === tela && location.hash) mostrar(tela);
  else location.hash = `#/${tela}`;
}

export function iniciarNavegacao(): void {
  window.addEventListener('hashchange', () => mostrar(telaDaUrl()));
  mostrar(telaDaUrl());
}
