import {
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip,
} from 'chart.js';
import type { Cenario, NomeCenario } from '../core/tipos';
import { formatarMoeda } from './formatadores';

// Registrar só o necessário deixa o bundle menor (tree-shaking do Chart.js).
Chart.register(LineController, LineElement, PointElement, LinearScale, CategoryScale, Legend, Tooltip);

// Cores do logo: marinho (realista), ciano da seta (otimista) e prata dos nós (pessimista, tracejado).
const CORES: Record<NomeCenario, string> = {
  realista: '#0A3550',
  otimista: '#00A2D7',
  pessimista: '#8A989D',
};

let grafico: Chart<'line'> | null = null;

export function desenharGrafico(canvas: HTMLCanvasElement, cenarios: Cenario[]): void {
  const meses = cenarios[0]?.resultado.fluxoAcumulado.map((_, i) => `Mês ${i}`) ?? [];
  const datasets = cenarios.map((c) => ({
    label: c.rotulo,
    data: c.resultado.fluxoAcumulado,
    borderColor: CORES[c.nome],
    backgroundColor: CORES[c.nome],
    borderWidth: c.nome === 'realista' ? 3 : 2,
    // Tracejado diferencia o pessimista mesmo para quem não distingue bem as cores.
    borderDash: c.nome === 'pessimista' ? [6, 4] : [],
    pointRadius: 0,
    pointHoverRadius: 4,
    tension: 0,
  }));

  // Reaproveita o gráfico existente em vez de recriar (evita "Canvas is already in use").
  if (grafico) {
    grafico.data.labels = meses;
    grafico.data.datasets = datasets;
    grafico.update();
    return;
  }

  grafico = new Chart(canvas, {
    type: 'line',
    data: { labels: meses, datasets },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,
      interaction: { mode: 'index', intersect: false },
      plugins: {
        legend: { position: 'bottom', labels: { usePointStyle: true, pointStyle: 'line', color: '#14202B' } },
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatarMoeda(ctx.parsed.y ?? 0)}` },
        },
      },
      scales: {
        x: { ticks: { maxTicksLimit: 9, color: '#5C6B75' }, grid: { display: false } },
        y: {
          ticks: { callback: (v) => formatarMoeda(Number(v)), color: '#5C6B75' },
          // Linha do zero mais forte: é onde o investimento se paga.
          grid: { color: (ctx) => (ctx.tick.value === 0 ? '#8A989D' : '#E6ECEF') },
        },
      },
    },
  });
}

/** Imagem do gráfico para o PDF (null se ainda não foi desenhado). */
export function imagemDoGrafico(): string | null {
  return grafico ? grafico.toBase64Image('image/png', 1) : null;
}
