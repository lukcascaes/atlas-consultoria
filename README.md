# Simulador de Viabilidade Atlas

MVP acadêmico da **Atlas Consultoria**: simula a viabilidade de um negócio a partir do investimento inicial, da receita mensal e dos custos mensais. Mostra três cenários, uma análise de sensibilidade, um parecer por motor de regras, o histórico local e a exportação em PDF.

Roda 100% no navegador, sem backend. O histórico fica no `localStorage`.

## Como rodar

Requer Node.js 18 ou superior.

```bash
npm install
npm run dev
```

Abra a URL exibida no terminal (padrão: http://localhost:5173).

Build de produção: `npm run build` (gera a pasta `dist/`).

## Como rodar os testes

```bash
npm test
```

Para deixar os testes rodando a cada alteração, use `npm run test:watch`.

## Estrutura de pastas

```
src/
├── core/            # Regras de negócio: funções puras, sem DOM, com testes
│   ├── tipos.ts         # Tipos de entradas e resultados
│   ├── constantes.ts    # % dos cenários, limites do feedback e demais parâmetros
│   ├── calcular.ts      # Lucro, payback, ROI e fluxo de caixa acumulado
│   ├── cenarios.ts      # Realista, otimista e pessimista
│   ├── sensibilidade.ts # Variação de receita/custos versus o realista
│   ├── feedback.ts      # Motor de regras do parecer (não é IA)
│   ├── validacao.ts     # Validação e conversão dos campos
│   └── *.test.ts        # Testes (Vitest)
├── storage/
│   └── historico.ts     # Leitura e escrita do localStorage com try/catch
├── ui/              # Interface: só chama o core e desenha na tela
│   ├── formulario.ts, grafico.ts, tabelaCenarios.ts, sensibilidade.ts,
│   ├── feedback.ts, historico.ts, exportarPdf.ts
│   ├── formatadores.ts  # Moeda, %, payback (nunca exibe NaN/Infinity)
│   └── dom.ts           # Utilitários de DOM
├── estilos/main.css
└── main.ts          # Ponto de entrada: liga os eventos ao core
public/logo.png      # Logo da Atlas Consultoria (também usado no PDF e como favicon)
```

## Ajustes rápidos

Os percentuais dos cenários e os limites do feedback ficam em `src/core/constantes.ts`.

## Stack

TypeScript, Vite, Chart.js, jsPDF com jspdf-autotable e Vitest.
