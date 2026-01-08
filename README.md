💰 ControleFinanceiro

Sistema web de controle financeiro pessoal, desenvolvido para organizar gastos, cartões, parcelas, compromissos fixos e dívidas de terceiros, com foco em clareza financeira e tomada de decisão.

O projeto permite entender quanto você gasta, quanto ainda deve, quanto já pagou e quanto tem a receber, tudo de forma estruturada.

🚀 Funcionalidades
👤 Usuário

* Usuário customizado
* Salário bruto
* Tipo de vínculo (CLT, PJ, Autônomo)

🗂️ Categorias

* Categorias macro (Alimentação, Transporte, Moradia, etc.)
* Subcategorias por usuário (ex: Shopee, Mercado, Restaurante)

💳 Cartões de Crédito

* Cadastro de cartões
* Limite total
* Dia de fechamento
* Dia de vencimento
* Cálculo de limite disponível (via regras de negócio)

🧾 Despesas (Expenses)

* Compras com ou sem cartão
* Tipos de pagamento (Cartão, PIX, Dinheiro, Fiado)
* Compras à vista ou parceladas
* Associação com subcategorias

📆 Parcelas (Installments)

* Geração automática de parcelas
* Controle de parcelas pagas e em aberto
* Base para cálculo mensal e limite do cartão

🔁 Compromissos Fixos

* Gastos recorrentes (aluguel, consórcio, internet, etc.)
* Ativação/desativação sem exclusão
* Controle mensal previsível

🤝 Dívidas de Terceiros

* Registro de compras feitas no seu cartão para outras pessoas
* Controle de valores a receber
* Separação entre gasto real e gasto temporário

🕓 Histórico (Auditoria)

* Registro de ações importantes:
    * Criação
    * Pagamento
    * Atualização
    * Exclusão
* Base para transparência e rastreabilidade

🧠 Arquitetura

* Backend: Django + Django REST Framework
* Banco de Dados: PostgreSQL
* Autenticação: JWT (planejado)
* Administração: Django Admin
* Padrões: Clean Code, separação de responsabilidades

📁 Estrutura do Projeto
ControleFinanceiro/
├── backend/
│   ├── accounts/        # Usuário customizado
│   ├── cards/           # Cartões de crédito
│   ├── finance/         # Regras financeiras (core)
│   ├── dashboard/       # Base para métricas e gráficos
│   ├── config/          # Configurações do Django
│   ├── manage.py
│   └── venv/
├── README.md
└── .gitignore

⚙️ Como rodar o projeto localmente
1️⃣ Clonar o repositório
git clone <url-do-repositorio>
cd ControleFinanceiro

2️⃣ Criar e ativar o ambiente virtual
python -m venv venv
venv\Scripts\activate

3️⃣ Instalar dependências
pip install -r requirements.txt

4️⃣ Configurar o banco (PostgreSQL)

Configure as credenciais no settings.py.

5️⃣ Rodar migrations
cd backend
python manage.py migrate

6️⃣ Criar superusuário
python manage.py createsuperuser

7️⃣ Rodar o servidor
python manage.py runserver


Acesse:

http://127.0.0.1:8000/admin

📌 Status do Projeto

✔ Modelagem completa
✔ Regras de parcelamento implementadas
✔ Controle financeiro funcional
🚧 API REST (em desenvolvimento)
🚧 Frontend Angular (planejado)
🚧 Dashboard e gráficos (planejado)

🎯 Objetivo do Projeto

Este projeto foi desenvolvido com foco em:

* Aprendizado prático de Django
* Modelagem de problemas financeiros reais
* Organização de dados para visualização e análise
* Construção de um projeto de portfólio profissional