# 💰 Controle Financeiro

Sistema web de **controle financeiro pessoal**, desenvolvido para organizar despesas, cartões, parcelas, compromissos fixos e dívidas de terceiros, com foco em **clareza financeira**, **previsibilidade** e **tomada de decisão consciente**.

O sistema permite entender:
- Quanto você gasta  
- Quanto ainda deve  
- Quanto já pagou  
- Quanto tem a receber  
- Qual é o seu gasto real mês a mês  

Tudo de forma **estruturada**, **auditável** e **visual**.

---

## 🚀 Funcionalidades

### 👤 Usuário
- Usuário customizado
- Salário bruto
- Tipo de vínculo (CLT, PJ, Autônomo)
- Base para cálculo de metas financeiras

### 🗂️ Categorias e Subcategorias
- Categorias macro (Alimentação, Transporte, Moradia, etc.)
- Subcategorias por usuário  
  _(ex: Mercado, Restaurante, Shopee, Cursos, Pets)_

### 💳 Cartões de Crédito
- Cadastro de cartões
- Limite total
- Dia de fechamento e vencimento
- Cálculo automático de limite disponível

### 🧾 Despesas
- Compras com ou sem cartão
- Tipos de pagamento:
  - Cartão
  - Pix
  - Dinheiro
  - Fiado
- Compras à vista ou parceladas
- Associação com subcategorias
- Controle de status (pago / pendente)

### 📆 Parcelas
- Geração automática de parcelas
- Controle individual de pagamento
- Reversão de pagamento (undo)
- Base para cálculos mensais e gráficos

### 🔁 Compromissos Fixos
- Gastos recorrentes (aluguel, consórcio, internet, etc.)
- **Soft delete** (ativar/desativar sem perder histórico)
- Controle previsível mês a mês

### 🤝 Dívidas de Terceiros
- Registro de compras feitas no seu cartão para outras pessoas
- Controle de valores a receber
- Separação entre gasto real e gasto temporário

### 🕓 Histórico (Auditoria)
- Registro automático de ações:
  - Criação
  - Atualização
  - Pagamento
  - Exclusão
- Transparência e rastreabilidade

---

## 📊 Dashboard Financeiro
- Gastos por categoria (mês atual e total)
- Gastos por subcategoria
- Evolução mensal de gastos
- Comparativo entre meses
- Parcelas que vencem
- Gasto real (parcelas + fixos)
- Indicadores visuais e metas financeiras

---

## 🧠 Arquitetura

### Backend
- Django
- Django REST Framework
- Django Filters
- PostgreSQL
- Soft Delete
- Auditoria de ações

### Frontend
- Angular
- Reactive Forms
- Componentes standalone
- ApexCharts
- UX focado em clareza

---

## 🐳 Execução com Docker (Backend)

> ⚠️ O Docker é usado **apenas no backend e banco de dados**.  
> O frontend Angular **não está no docker-compose**.

### Pré-requisitos
- Docker
- Docker Compose
- Node.js
- Angular CLI

---

### 1️⃣ Clonar o repositório
git clone https://github.com/seu-usuario/controle-financeiro.git
cd controle-financeiro

## 2️⃣ Subir os containers
docker-compose up --build

## 3️⃣ Rodar migrations
docker-compose exec backend python manage.py migrate

## 4️⃣ Criar superusuário
docker-compose exec backend python manage.py createsuperuser

## 5️⃣ Subir novamente (sem rebuild)
docker-compose up

## 6️⃣ Backend em execução
- API: http://localhost:8000
- Admin: http://localhost:8000/admin

🖥️ Execução do Frontend (Angular)
Abra outro terminal:
- cd frontend
- npm install
- ng serve

Acesse:
- http://localhost:4200

📁 Estrutura do Projeto

```text
controle-financeiro/
├── backend/
│   ├── accounts/
│   ├── categories/
│   ├── cards/
│   ├── expenses/
│   ├── fixed_commitments/
│   ├── dashboard/
│   ├── history/
│   ├── config/
│   └── manage.py
├── frontend/
├── docker-compose.yml
├── README.md
└── .gitignore
```

📌 Status do Projeto
✔ Backend completo
✔ Regras financeiras implementadas
✔ Dashboard funcional
✔ Filtros avançados

🚧 Autenticação JWT (em evolução)
🚧 Melhorias contínuas de UX

🎯 Objetivo
Projeto desenvolvido para:

- Aprendizado prático de Django + Angular
- Modelagem de problemas financeiros reais
- Análise e visualização de dados
- Portfólio profissional
