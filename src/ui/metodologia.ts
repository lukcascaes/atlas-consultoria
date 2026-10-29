import { AJUSTES_CENARIOS, FAIXA_SENSIBILIDADE, LIMITES_FEEDBACK, MESES_FLUXO } from '../core/constantes';

/** "+20%" / "-10%" */
function pct(valor: number): string {
  return `${valor > 0 ? '+' : ''}${valor}%`;
}

/**
 * Monta a tela de metodologia a partir das constantes do core:
 * se um limite mudar em constantes.ts, a explicação muda junto.
 */
export function desenharMetodologia(alvo: HTMLElement): void {
  const { otimista, pessimista } = AJUSTES_CENARIOS;
  const { paybackAlta, roiAlta, paybackModerada } = LIMITES_FEEDBACK;

  alvo.innerHTML = `
    <div class="metodologia">
      <section class="card" aria-labelledby="titulo-formulas">
        <h2 id="titulo-formulas">Fórmulas</h2>
        <dl class="formulas">
          <div><dt>Lucro mensal</dt><dd><code>receita − custos</code></dd></div>
          <div><dt>Payback (meses)</dt><dd><code>investimento ÷ lucro mensal</code><small>Se o lucro for zero ou negativo, não há payback.</small></dd></div>
          <div><dt>ROI anual (%)</dt><dd><code>(lucro mensal × 12 ÷ investimento) × 100</code></dd></div>
          <div><dt>Fluxo de caixa acumulado</dt><dd><code>−investimento + lucro mensal × mês</code><small>Calculado do mês 0 ao mês ${MESES_FLUXO}.</small></dd></div>
        </dl>
      </section>

      <section class="card" aria-labelledby="titulo-premissas">
        <h2 id="titulo-premissas">Cenários</h2>
        <div class="tabela-wrapper">
          <table class="tabela tabela--simples">
            <thead><tr><th scope="col">Cenário</th><th scope="col">Receita</th><th scope="col">Custos</th></tr></thead>
            <tbody>
              <tr class="linha--realista"><th scope="row">Realista</th><td>valor digitado</td><td>valor digitado</td></tr>
              <tr class="linha--otimista"><th scope="row">Otimista</th><td>${pct(otimista.receitaPct)}</td><td>${pct(otimista.custosPct)}</td></tr>
              <tr class="linha--pessimista"><th scope="row">Pessimista</th><td>${pct(pessimista.receitaPct)}</td><td>${pct(pessimista.custosPct)}</td></tr>
            </tbody>
          </table>
        </div>
        <p class="nota">A análise de sensibilidade aplica variações livres de ${FAIXA_SENSIBILIDADE.min}% a +${FAIXA_SENSIBILIDADE.max}% sobre o cenário realista. O investimento inicial não varia.</p>
      </section>

      <section class="card" aria-labelledby="titulo-regras">
        <h2 id="titulo-regras">Regras do parecer consultivo</h2>
        <p class="nota nota--topo">Motor de regras simples, avaliado de cima para baixo; vale a primeira regra que se aplicar. Não é inteligência artificial.</p>
        <ul class="regras">
          <li class="regra regra--prejuizo"><strong>Alerta de Prejuízo</strong><span>Lucro mensal menor ou igual a zero.</span></li>
          <li class="regra regra--alta"><strong>Alta Viabilidade</strong><span>Payback de até ${paybackAlta} meses e ROI anual de pelo menos ${roiAlta}%.</span></li>
          <li class="regra regra--moderada"><strong>Viabilidade Moderada</strong><span>Payback entre ${paybackAlta + 1} e ${paybackModerada} meses.</span></li>
          <li class="regra regra--baixa"><strong>Baixa Viabilidade</strong><span>Payback acima de ${paybackModerada} meses.</span></li>
        </ul>
      </section>

      <section class="card" aria-labelledby="titulo-limites">
        <h2 id="titulo-limites">Limitações do MVP</h2>
        <ul class="lista">
          <li>Receita e custos são considerados constantes mês a mês; não há sazonalidade, inflação nem impostos.</li>
          <li>O payback é simples (sem desconto do valor do dinheiro no tempo).</li>
          <li>Os dados ficam só neste navegador (localStorage). Banco de dados e servidor estão planejados para a Sprint 3.</li>
        </ul>
      </section>
    </div>`;
}
