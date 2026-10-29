import type { Entradas } from '../core/tipos';
import type { RegistroHistorico } from '../storage/historico';
import { formatarData, formatarMoeda, formatarPayback, formatarPercentual } from './formatadores';

/** Desenha a lista; `aoRecarregar` é chamado com as entradas do item clicado. */
export function desenharHistorico(
  lista: HTMLUListElement,
  registros: RegistroHistorico[],
  aoRecarregar: (entradas: Entradas) => void,
): void {
  lista.replaceChildren();

  if (registros.length === 0) {
    const vazio = document.createElement('li');
    vazio.className = 'historico__vazio';
    vazio.textContent = 'Nenhuma simulação salva ainda.';
    lista.appendChild(vazio);
    return;
  }

  for (const r of registros) {
    const item = document.createElement('li');
    item.className = 'historico__item';

    const info = document.createElement('div');
    const data = document.createElement('span');
    data.className = 'historico__data';
    data.textContent = formatarData(r.data);
    const resumo = document.createElement('span');
    resumo.textContent =
      `Inv. ${formatarMoeda(r.entradas.investimento)} · Lucro ${formatarMoeda(r.resultado.lucroMensal)}/mês · ` +
      `${formatarPayback(r.resultado.paybackMeses)} · ROI ${formatarPercentual(r.resultado.roiAnual)}`;
    info.append(data, resumo);

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.className = 'botao botao--pequeno';
    botao.textContent = 'Recarregar';
    botao.addEventListener('click', () => aoRecarregar(r.entradas));

    item.append(info, botao);
    lista.appendChild(item);
  }
}
