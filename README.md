# PharmaStock

> Sistema de Gerenciamento de Armazém e Recursos Empresariais (WMS/ERP) focado no controle rigoroso de estoque farmacêutico, lotes, validades e conformidade regulatória.

---

## 🚀 Sobre o Projeto

O **PharmaStock** é um MVP (Minimum Viable Product) desenvolvido para otimizar a operação de farmácias, distribuidores e centros de distribuição farmacêutica. O sistema resolve desafios críticos do setor através de automação de fluxo, rastreabilidade de ponta a ponta e travas de segurança rigorosas para impedir a circulação de produtos vencidos ou irregulares.

---

## ✨ Requisitos Funcionais do MVP Atendidos

O sistema foi construído contemplando 5 pilares críticos de operação:

1. **RF1 — Cadastro Seguro de Medicamentos:** Registro padronizado com validação de unicidade e campos obrigatórios para garantir a integridade dos dados iniciais.
2. **RF2 — Registro de Movimentações:** Rastreio em tempo real de entradas e saídas de mercadorias no estoque.
3. **RF5 — Controle de Lotes e Validades:** Monitoramento estrito para mitigar perdas financeiras e vencimento de produtos nas prateleiras.
4. **RF12 — Gestão de Medicamentos Controlados:** Atendimento às diretrizes normativas (como exigências da ANVISA) com controle de retenção de receitas.
5. **RF17 — Trava Técnica de Segurança:** Mecanismo restritivo automático que impede a movimentação, dispensação ou saída de lotes com prazo de validade vencido.

---

## 🛠️ Tecnologias Utilizadas

O projeto utiliza uma arquitetura moderna e leve baseada em componentes web e persistência local:

* **Frontend:** Angular (TypeScript)
* **Interface & Estilização:** Bootstrap 5, HTML5, CSS3
* **Gerenciamento de Estado & Persistência:** TypeScript Services + Browser LocalStorage
* **Metodologia:** MVP ágil com foco em entregas iterativas

---

## 🏗️ Arquitetura e Fluxo de Dados

A lógica do sistema é concentrada no **TypeScript**, fazendo a ponte entre as interações do usuário no **HTML** e a persistência leve no **LocalStorage**:

* **Entrada (HTML ➔ TypeScript ➔ LocalStorage):** Os dados coletados pelos formulários são tratados, validados via regras de negócio e salvos em formato JSON no navegador.
* **Exibição (LocalStorage ➔ TypeScript ➔ HTML):** Os dados são recuperados dinamicamente na inicialização dos componentes (`ngOnInit`) e renderizados de forma reativa na interface.

---

## ⚙️ Como Executar o Projeto Localmente

Certifique-se de ter o [Node.js](https://nodejs.org/) e o [Angular CLI](https://angular.io/cli) instalados em sua máquina.

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/pharmastock-wms.git
   cd pharmastock-wms
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   ng serve
   ```

4. **Acesse no navegador:**
   Abra `http://localhost:4200/` para visualizar o sistema em funcionamento.

---

## 📋 Próximos Passos (Roadmap v2.5)
- [ ] Integração com API backend (Node.js/Spring Boot).
- [ ] Relatórios avançados de perdas e giro de estoque.
- [ ] Leitor de código de barras via câmera para entradas rápidas.

---

## 📄 Licença
Distribuído sob a licença MIT. Veja `LICENSE` para mais informações.
