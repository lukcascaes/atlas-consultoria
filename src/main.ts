// Ponto de entrada: conecta os eventos da página ao core. Nenhuma regra de negócio aqui.
import { gerarCenarios } from './core/cenarios';
import { gerarFeedback } from './core/feedback';
import type { Cenario, Entradas, Feedback } from './core/tipos';
import { lerHistorico, limparHistorico, salvarNoHistorico } from './storage/historico';
import { pegar } from './ui/dom';
import { desenharFeedback } from './ui/feedback';
import { formatarMoeda } from './ui/formatadores';
import { ligarLimpezaDeErros, lerFormulario, preencherFormulario } from './ui/formulario';
import { desenharGrafico } from './ui/grafico';
import { desenharHistorico } from './ui/historico';
import { desenharMetodologia } from './ui/metodologia';
import { iniciarNavegacao, irPara } from './ui/navegacao';
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

  pegar('resultados').hidden = false;
  desenharFeedback(pegar('feedback'), feedback);
  desenharTabela(pegar<HTMLTableElement>('tabela-cenarios'), cenarios);
  desenharGrafico(pegar<HTMLCanvasElement>('grafico-fluxo'), cenarios);
  pegar<HTMLButtonElement>('btn-pdf').disabled = false;

  // A tela de sensibilidade sai do estado vazio assim que existe uma simulação.
  pegar('sensibilidade-vazio').hidden = true;
  pegar('sensibilidade-conteudo').hidden = false;
  pegar('sensibilidade-base').textContent =
    `Base (cenário realista): investimento ${formatarMoeda(entradas.investimento)}, ` +
    `receita ${formatarMoeda(entradas.receita)} e custos ${formatarMoeda(entradas.custos)} por mês.`;
  atualizarSensibilidade(entradas);

  if (salvar && !salvarNoHistorico(entradas, realista.resultado)) {
    alert('Não foi possível salvar no histórico (armazenamento do navegador indisponível).');
  }
  atualizarHistorico();
}

function atualizarHistorico(): void {
  desenharHistorico(pegar<HTMLUListElement>('lista-historico'), lerHistorico(), (entradas) => {
    preencherFormulario(entradas);
    simular(entradas, false);
    irPara('simulador');
  });
}

pegar<HTMLFormElement>('form-simulacao').addEventListener('submit', (evento) => {
  evento.preventDefault();
  const entradas = lerFormulario();
  if (!entradas) return;
  simular(entradas, true);
  pegar('resultados').scrollIntoView({ behavior: 'smooth', block: 'start' });
});

pegar('btn-pdf').addEventListener('click', async () => {
  if (!atual) return;
  try {
    // Import dinâmico: o jsPDF (pesado) só é baixado quando alguém clica em exportar.
    const { exportarPdf } = await import('./ui/exportarPdf');
    await exportarPdf(atual.cenarios, atual.feedback);
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
desenharMetodologia(pegar('metodologia'));
atualizarHistorico();
iniciarNavegacao();
