# 💰 Controle Financeiro

Sistema web Full Stack para gerenciamento financeiro pessoal, desenvolvido para centralizar o controle de despesas, cartões de crédito, parcelamentos, compromissos recorrentes e valores a receber.

O objetivo do projeto é fornecer uma visão clara da situação financeira do usuário através de dashboards, indicadores e regras de negócio que auxiliam no planejamento financeiro e na tomada de decisões.

---

## 🚀 Principais Funcionalidades

### 💳 Gestão de Cartões de Crédito

* Cadastro de múltiplos cartões
* Controle de limite total e disponível
* Configuração de fechamento e vencimento
* Acompanhamento de utilização do limite

### 🧾 Controle de Despesas

* Registro de despesas à vista ou parceladas
* Múltiplas formas de pagamento:

  * Cartão
  * PIX
  * Dinheiro
  * Fiado
* Controle de status de pagamento
* Associação com categorias e subcategorias

### 📆 Gerenciamento de Parcelas

* Geração automática de parcelas
* Controle individual de pagamentos
* Reversão de pagamentos
* Base para análises e dashboards financeiros

### 🔁 Compromissos Financeiros Recorrentes

* Cadastro de despesas fixas mensais
* Ativação e desativação sem perda de histórico
* Previsibilidade de gastos futuros

### 🤝 Controle de Valores a Receber

* Registro de compras realizadas para terceiros
* Separação entre despesas próprias e valores pendentes de recebimento
* Controle de saldo a receber

### 🕓 Auditoria de Operações

Registro automático de eventos importantes:

* Criação
* Atualização
* Pagamento
* Exclusão

Garantindo rastreabilidade e transparência dos dados.

### 📊 Dashboard Financeiro

Indicadores e visualizações para acompanhamento financeiro:

* Gastos por categoria
* Gastos por subcategoria
* Evolução mensal de despesas
* Comparação entre períodos
* Parcelas próximas do vencimento
* Gasto real mensal
* Metas financeiras

---

## 🧠 Desafios Técnicos Resolvidos

Durante o desenvolvimento foram implementadas soluções para:

* Modelagem de relacionamentos financeiros complexos
* Controle de parcelamentos e recorrência
* Auditoria automática de operações
* Separação entre gastos efetivos e valores temporários
* Geração de indicadores financeiros em tempo real
* Integração entre frontend Angular e backend Django REST Framework

---

## 🛠️ Tecnologias Utilizadas

### Backend

* Python
* Django
* Django REST Framework
* Django Filters
* PostgreSQL

### Frontend

* Angular
* TypeScript
* Reactive Forms
* Standalone Components
* ApexCharts

### DevOps

* Docker
* Docker Compose
* Git
* GitHub

---

## 🏗️ Arquitetura

### Backend

Responsável por:

* Regras de negócio
* Persistência dos dados
* APIs REST
* Auditoria de operações
* Processamento financeiro

### Frontend

Responsável por:

* Interface do usuário
* Dashboards interativos
* Consumo das APIs
* Formulários reativos
* Experiência de navegação

---

## 📷 Demonstração

### Dashboard Financeiro

*(Inserir screenshot)*

### Gestão de Despesas

*(Inserir screenshot)*

### Controle de Cartões

*(Inserir screenshot)*

---

## 🐳 Execução com Docker

### Pré-requisitos

* Docker
* Docker Compose
* Node.js
* Angular CLI

### Clonar o projeto

```bash
git clone https://github.com/HadesKerbecs/ControleFinanceiro.git
cd ControleFinanceiro
```

### Subir containers

```bash
docker-compose up --build
```

### Executar migrações

```bash
docker-compose exec backend python manage.py migrate
```

### Criar usuário administrador

```bash
docker-compose exec backend python manage.py createsuperuser
```

### Executar aplicação

```bash
docker-compose up
```

Backend:
http://localhost:8000

Admin:
http://localhost:8000/admin

---

## 🖥️ Frontend

```bash
cd frontend
npm install
ng serve
```

Frontend:

http://localhost:4200

---

## 🎯 Objetivos do Projeto

Este projeto foi desenvolvido para:

* Aplicar conceitos de desenvolvimento Full Stack
* Implementar regras de negócio financeiras reais
* Praticar integração entre Angular e Django
* Explorar visualização de dados através de dashboards
* Construir uma aplicação completa para portfólio profissional

---

## 📌 Status

✅ Backend concluído

✅ Dashboard funcional

✅ Integração Frontend + Backend

✅ Dockerização do ambiente

✅ Regras financeiras implementadas

🚧 Autenticação JWT em evolução

🚧 Melhorias contínuas de UX/UI
