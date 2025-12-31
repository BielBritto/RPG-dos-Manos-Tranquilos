
# TEMOR - Terminal de Gerenciamento Ômega

Bem-vindo ao **TEMOR**, o sistema definitivo para gerenciar suas campanhas de RPG. Este aplicativo foi projetado para oferecer uma experiência tática e imersiva para Mestres e Jogadores.

## 🚀 Como Usar Online

O aplicativo é uma **SPA (Single Page Application)** que roda inteiramente no navegador.

1. **Persistência**: Todo o seu progresso (personagens, chat, mapas e campanhas) é salvo automaticamente no `localStorage` do seu navegador. 
   - *Atenção*: Se você limpar o cache do navegador ou usar o modo anônimo, os dados serão perdidos. Recomendamos exportar seus dados manualmente ou não limpar o cache durante a campanha.

2. **Criação de Personagens**:
   - Os jogadores escolhem entre os agentes pré-definidos.
   - O Mestre pode criar novos NPCs e Inimigos através do botão de "+" (Painel do Mestre) no Dashboard.

3. **Gerenciamento de Imagens**:
   - Agora você pode subir fotos diretamente do seu computador ao criar NPCs.
   - Para personagens pré-existentes, os links podem ser editados no arquivo `constants.ts` se estiver rodando localmente, ou via painel do mestre se recriados.

## 🛠️ Recursos Principais

- **Campanhas Múltiplas**: O Mestre pode criar e alternar entre diferentes campanhas, mantendo o histórico de mensagens e status de cada uma.
- **Painel Tático**: Mapas interativos que podem ser alternados pelo Mestre em tempo real.
- **Rolagens Rápidas**: Mestre e Jogadores podem clicar no ícone de dados nos cartões de personagem para rolar um 1D20 instantaneamente no chat.
- **Status Customizáveis**: Ao criar um NPC, o mestre escolhe quais barras de status (Vida, Sanidade, Energia) estarão ativas.

## 📦 Como Rodar Localmente

Se você deseja hospedar ou rodar em sua máquina:

1. Certifique-se de ter o [Node.js](https://nodejs.org/) instalado.
2. Clone ou baixe os arquivos deste projeto.
3. Instale as dependências (se houver um `package.json`) ou use um servidor estático para rodar o `index.html`.
4. O projeto utiliza **React** via ESM, então basta abrir o `index.html` em um servidor local (como o Live Server do VS Code).

## 🎲 Sistema de Regras (Resumo)

- **Testes**: Atributo + Perícia + 1d20.
- **Sucessos**: 
  - Crítico: 20 natural.
  - Falha Crítica: 1 natural.
- **Vantagem/Desvantagem**: Rola 2d20 e pega o melhor/pior.
- **Sanidade**: Teste de 2d6 contra o valor de sanidade do player.

---
*Desenvolvido para operações táticas de alto risco. Mantenha-se lúcido, Agente.*
