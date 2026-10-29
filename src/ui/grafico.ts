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

const CORES: Record<NomeCenario, string> = {
  realista: '#0F4C5C',
  otimista: '#2A9D8F',
  pessimista: '#C8553D',
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
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatarMoeda(ctx.parsed.y ?? 0)}` },
        },
      },
      scales: {
        x: { ticks: { maxTicksLimit: 9 }, grid: { display: false } },
        y: {
          ticks: { callback: (v) => formatarMoeda(Number(v)) },
          grid: { color: (ctx) => (ctx.tick.value === 0 ? '#6b7c80' : '#e3e9ea') },
        },
      },
    },
  });
}

/** Imagem do gráfico para o PDF (null se ainda não foi desenhado). */
export function imagemDoGrafico(): string | null {
  return grafico ? grafico.toBase64Image('image/png', 1) : null;
}
