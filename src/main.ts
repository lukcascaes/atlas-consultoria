// Ponto de entrada: conecta os eventos da página ao core. Nenhuma regra de negócio aqui.
import { gerarCenarios } from './core/cenarios';
import { gerarFeedback } from './core/feedback';
import type { Cenario, Entradas, Feedback } from './core/tipos';
import { lerHistorico, limparHistorico, salvarNoHistorico } from './storage/historico';
import { pegar } from './ui/dom';
import { desenharFeedback } from './ui/feedback';
import { ligarLimpezaDeErros, lerFormulario, preencherFormulario } from './ui/formulario';
import { desenharGrafico } from './ui/grafico';
import { desenharHistorico } from './ui/historico';
import { atualizarSensibilidade, ligarSensibilidade } from './ui/sensibilidade';
import { desenharTabela } from './ui/tabelaCenarios';
import './estilos/main.css';

// Estado da simulação atual, usado pelo botão de PDF.
let atual: { cenarios: Cenario[]; feedback: Feedback } | null = null;

function simular(entradas: Entradas, salvar: boolean): void {
  const cenarios = gerarCenarios(entradas);
  const realista = cenarios[0];
  const feedback = gerarFeedback(realista.resultado);
  atual = { cenarios, feedback };

  const secao = pegar('resultados');
  secao.hidden = false;
  desenharFeedback(pegar('feedback'), feedback);
  desenharTabela(pegar<HTMLTableElement>('tabela-cenarios'), cenarios);
  desenharGrafico(pegar<HTMLCanvasElement>('grafico-fluxo'), cenarios);
  atualizarSensibilidade(entradas);
  pegar<HTMLButtonElement>('btn-pdf').disabled = false;

  if (salvar && !salvarNoHistorico(entradas, realista.resultado)) {
    alert('Não foi possível salvar no histórico (armazenamento do navegador indisponível).');
  }
  atualizarHistorico();
}

function atualizarHistorico(): void {
  desenharHistorico(pegar<HTMLUListElement>('lista-historico'), lerHistorico(), (entradas) => {
    preencherFormulario(entradas);
    simular(entradas, false);
    pegar('resultados').scrollIntoView({ behavior: 'smooth' });
  });
}

pegar<HTMLFormElement>('form-simulacao').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const entradas = lerFormulario();
  if (entradas) simular(entradas, true);
});

pegar('btn-pdf').addEventListener('click', async () => {
  if (!atual) return;
  try {
    // Import dinâmico: o jsPDF (pesado) só é baixado quando alguém clica em exportar.
    const { exportarPdf } = await import('./ui/exportarPdf');
    exportarPdf(atual.cenarios, atual.feedback);
  } catch (erro) {
    console.error(erro);
    alert('Não foi possível gerar o PDF. Tente novamente.');
  }
});

pegar('btn-limpar').addEventListener('click', () => {
  if (!confirm('Apagar todas as simulações do histórico?')) return;
  limparHistorico();
  atualizarHistorico();
});

ligarLimpezaDeErros();
ligarSensibilidade();
atualizarHistorico();
