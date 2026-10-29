import { LIMITES_FEEDBACK } from './constantes';
import type { Feedback, Resultado } from './tipos';

/**
 * Motor de regras simples (não é IA). As regras são avaliadas em ordem;
 * a primeira que se aplica define o parecer.
 */
export function gerarFeedback(resultado: Resultado): Feedback {
  const { paybackAlta, roiAlta, paybackModerada } = LIMITES_FEEDBACK;
  const { lucroMensal, paybackMeses, roiAnual } = resultado;

  if (lucroMensal <= 0 || paybackMeses === null) {
    return {
      nivel: 'prejuizo',
      titulo: 'Alerta de Prejuízo',
      mensagem: 'Os custos mensais igualam ou superam a receita. O investimento não se paga; revise preços ou custos.',
    };
  }

  if (paybackMeses <= paybackAlta && roiAnual >= roiAlta) {
    return {
      nivel: 'alta',
      titulo: 'Alta Viabilidade',
      mensagem: `O investimento retorna em até ${paybackAlta} meses, com ROI anual de pelo menos ${roiAlta}%.`,
    };
  }

  // Payback fracionado (ex.: 12,5 meses) já conta como "entre 13 e 36": passou do 12º mês.
  if (paybackMeses <= paybackModerada) {
    return {
      nivel: 'moderada',
      titulo: 'Viabilidade Moderada',
      mensagem: `O retorno acontece entre ${paybackAlta + 1} e ${paybackModerada} meses. Viável, mas acompanhe os custos de perto.`,
    };
  }

  return {
    nivel: 'baixa',
    titulo: 'Baixa Viabilidade',
    mensagem: `O payback passa de ${paybackModerada} meses. O capital fica imobilizado por muito tempo; avalie alternativas.`,
  };
}
