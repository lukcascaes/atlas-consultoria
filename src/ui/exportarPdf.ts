import { jsPDF } from 'jspdf';
import { autoTable } from 'jspdf-autotable';
import type { Cenario, Feedback } from '../core/tipos';
import { formatarMoeda, formatarPayback, formatarPercentual } from './formatadores';
import { imagemDoGrafico } from './grafico';
import { CABECALHO_TABELA, linhasDaTabela } from './tabelaCenarios';

const MARINHO: [number, number, number] = [11, 34, 54];
const CIANO: [number, number, number] = [0, 162, 215];

/** Carrega o logo como data URL; se falhar, o PDF sai sem logo em vez de quebrar. */
async function carregarLogo(): Promise<string | null> {
  try {
    // BASE_URL respeita o "base" do vite.config (o site pode estar numa subpasta no GitHub Pages).
    const resposta = await fetch(`${import.meta.env.BASE_URL}logo.png`);
    if (!resposta.ok) return null;
    const blob = await resposta.blob();
    return await new Promise<string | null>((resolve) => {
      const leitor = new FileReader();
      leitor.onload = () => resolve(typeof leitor.result === 'string' ? leitor.result : null);
      leitor.onerror = () => resolve(null);
      leitor.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

export async function exportarPdf(cenarios: Cenario[], feedback: Feedback): Promise<void> {
  const realista = cenarios.find((c) => c.nome === 'realista');
  if (!realista) return;

  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margem = 15;
  const larguraPagina = doc.internal.pageSize.getWidth();
  const largura = larguraPagina - margem * 2;

  // Cabeçalho branco com logo, como no site, e uma faixa marinho/ciano embaixo
  const logo = await carregarLogo();
  const xTexto = logo ? margem + 22 : margem;
  if (logo) doc.addImage(logo, 'PNG', margem, 6, 19, 19);
  doc.setTextColor(...MARINHO);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('ATLAS CONSULTORIA', xTexto, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(110, 125, 132);
  doc.text(`Simulador de Viabilidade · ${new Date().toLocaleString('pt-BR')}`, xTexto, 20);
  doc.setFillColor(...MARINHO);
  doc.rect(0, 29, larguraPagina * 0.7, 1.5, 'F');
  doc.setFillColor(...CIANO);
  doc.rect(larguraPagina * 0.7, 29, larguraPagina * 0.3, 1.5, 'F');

  let y = 40;
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Dados informados', margem, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 6;
  const { investimento, receita, custos } = realista.entradas;
  doc.text(`Investimento inicial: ${formatarMoeda(investimento)}`, margem, y);
  doc.text(`Receita mensal: ${formatarMoeda(receita)}`, margem, y + 5);
  doc.text(`Custos mensais: ${formatarMoeda(custos)}`, margem, y + 10);

  y += 20;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text(`Parecer: ${feedback.titulo}`, margem, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  const mensagem = doc.splitTextToSize(feedback.mensagem, largura) as string[];
  doc.text(mensagem, margem, y + 6);
  y += 6 + mensagem.length * 5;
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text('Parecer gerado por motor de regras simples (não é inteligência artificial).', margem, y);
  y += 4;
  doc.setTextColor(30, 30, 30);
  doc.setFontSize(10);
  doc.text(
    `Resumo realista: lucro ${formatarMoeda(realista.resultado.lucroMensal)}/mês · ` +
      `payback ${formatarPayback(realista.resultado.paybackMeses)} · ROI ${formatarPercentual(realista.resultado.roiAnual)}`,
    margem,
    y + 4,
  );

  autoTable(doc, {
    startY: y + 10,
    head: [CABECALHO_TABELA],
    body: linhasDaTabela(cenarios),
    margin: { left: margem, right: margem },
    headStyles: { fillColor: MARINHO },
    styles: { fontSize: 9 },
  });

  // finalY é escrito pelo plugin no objeto do documento.
  const fimTabela = (doc as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable?.finalY ?? y + 40;

  const imagem = imagemDoGrafico();
  if (imagem) {
    const alturaImagem = largura * 0.5;
    let yImagem = fimTabela + 10;
    if (yImagem + alturaImagem + 8 > doc.internal.pageSize.getHeight() - margem) {
      doc.addPage();
      yImagem = margem + 4;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Fluxo de caixa acumulado (24 meses)', margem, yImagem);
    doc.addImage(imagem, 'PNG', margem, yImagem + 4, largura, alturaImagem, undefined, 'FAST');
  }

  // Data local (toISOString usaria UTC e poderia mostrar o dia seguinte à noite).
  const hoje = new Date();
  const data = [hoje.getFullYear(), hoje.getMonth() + 1, hoje.getDate()]
    .map((n) => String(n).padStart(2, '0'))
    .join('-');
  doc.save(`simulacao-atlas-${data}.pdf`);
}
