import { analisarSensibilidade } from '../core/sensibilidade';
import type { Entradas } from '../core/tipos';
import { pegar } from './dom';
import { formatarDiferenca, formatarMoeda, formatarPayback, formatarPercentual } from './formatadores';

/** Classe CSS da diferença: verde se melhorou, vermelho se piorou. */
function classe(diferenca: number | null, maiorEhMelhor: boolean): string {
  if (diferenca === null || Math.abs(diferenca) < 1e-9) return 'neutro';
  return diferenca > 0 === maiorEhMelhor ? 'melhor' : 'pior';
}

/** Payback menor é melhor; perder o payback é sempre pior e ganhar é sempre melhor. */
function classePayback(base: number | null, ajustado: number | null, diferenca: number | null): string {
  if (diferenca !== null) return classe(diferenca, false);
  if (base !== null && ajustado === null) return 'pior';
  if (base === null && ajustado !== null) return 'melhor';
  return 'neutro';
}

function formatarDiferencaPayback(base: number | null, ajustado: number | null, diferenca: number | null): string {
  if (diferenca !== null) return formatarDiferenca(diferenca, (v) => formatarPayback(v));
  if (base === null && ajustado === null) return '—';
  return ajustado === null ? 'perdeu o payback' : 'passou a ter payback';
}

function desenhar(entradas: Entradas): void {
  const varReceita = Number(pegar<HTMLInputElement>('var-receita').value);
  const varCustos = Number(pegar<HTMLInputElement>('var-custos').value);
  pegar('valor-var-receita').textContent = `${varReceita > 0 ? '+' : ''}${varReceita}%`;
  pegar('valor-var-custos').textContent = `${varCustos > 0 ? '+' : ''}${varCustos}%`;

  const { base, ajustado, diferenca } = analisarSensibilidade(entradas, {
    receitaPct: varReceita,
    custosPct: varCustos,
  });

  const linhas: Array<[string, string, string, string]> = [
    [
      'Lucro mensal',
      formatarMoeda(ajustado.lucroMensal),
      formatarDiferenca(diferenca.lucroMensal, formatarMoeda),
      classe(diferenca.lucroMensal, true),
    ],
    [
      'Payback',
      formatarPayback(ajustado.paybackMeses),
      formatarDiferencaPayback(base.paybackMeses, ajustado.paybackMeses, diferenca.paybackMeses),
      classePayback(base.paybackMeses, ajustado.paybackMeses, diferenca.paybackMeses),
    ],
    [
      'ROI anual',
      formatarPercentual(ajustado.roiAnual),
      formatarDiferenca(diferenca.roiAnual, (v) => `${formatarPercentual(v).replace('%', '')} p.p.`),
      classe(diferenca.roiAnual, true),
    ],
  ];

  pegar('sensibilidade-resultado').innerHTML = `
    <div class="metricas">
      ${linhas
        .map(
          ([rotulo, valor, dif, cls]) => `
        <div class="metrica">
          <span class="metrica__rotulo">${rotulo}</span>
          <span class="metrica__valor">${valor}</span>
          <span class="metrica__dif metrica__dif--${cls}">${dif} vs. realista</span>
        </div>`,
        )
        .join('')}
    </div>`;
}

let entradasAtuais: Entradas | null = null;

/** Liga os sliders uma única vez; cada nova simulação só troca as entradas de referência. */
export function ligarSensibilidade(): void {
  for (const id of ['var-receita', 'var-custos']) {
    pegar<HTMLInputElement>(id).addEventListener('input', () => {
      if (entradasAtuais) desenhar(entradasAtuais);
    });
  }
}

/** Atualiza a base da análise e volta os sliders para 0%. */
export function atualizarSensibilidade(entradas: Entradas): void {
  entradasAtuais = entradas;
  pegar<HTMLInputElement>('var-receita').value = '0';
  pegar<HTMLInputElement>('var-custos').value = '0';
  desenhar(entradas);
}
