# Sistema Kanban GMUD - Frontend + Backend

Sistema completo de gerenciamento de GMUDs (Gestão de Mudanças) com frontend React e backend NestJS.

## 🚀 Tecnologias Utilizadas

### Frontend
- **React 19** - Biblioteca principal para interface
- **Vite** - Build tool e servidor de desenvolvimento
- **Styled Components** - Estilização CSS-in-JS
- **Ant Design** - Biblioteca de componentes UI
- **Axios** - Cliente HTTP para comunicação com API
- **@dnd-kit** - Funcionalidade de drag and drop

### Backend
- **NestJS** - Framework Node.js
- **TypeORM** - ORM para TypeScript
- **PostgreSQL** - Banco de dados
- **Class Validator** - Validação de dados

## 📋 Funcionalidades

### Frontend
- ✅ **Quadro Kanban** com 5 colunas
- ✅ **Drag & Drop** entre colunas
- ✅ **Gerenciamento de Aprovadores** com avatares circulares
- ✅ **Filtros por Aprovadores** (interface visual tipo Jira)
- ✅ **Filtros por Time** (apenas na coluna de execução)
- ✅ **Página dedicada** para gerenciar aprovadores
- ✅ **Modais** para criar/editar GMUDs
- ✅ **Persistência** via API REST

### Backend
- ✅ **API REST** completa
- ✅ **CRUD** para aprovadores e cards
- ✅ **Banco PostgreSQL** com relacionamentos
- ✅ **Validação** de dados
- ✅ **CORS** configurado
- ✅ **Documentação** completa

## 🛠️ Como Executar

### Pré-requisitos
- Node.js 20+
- PostgreSQL
- npm ou yarn

### 1. Backend

```bash
cd backend

# Configure o Node.js
nvm use 20

# Instale as dependências
npm install

# Configure o banco de dados
cp .env.example .env
# Edite o arquivo .env com suas configurações do PostgreSQL

# Execute o servidor
npm run start:dev
```

Backend rodará em: http://localhost:3001

### 2. Frontend

```bash
cd kanban-gmud

# Configure o Node.js
nvm use 20

# Instale as dependências
npm install

# Execute o servidor de desenvolvimento
npm run dev
```

Frontend rodará em: http://localhost:5173

## 📊 Banco de Dados

### Tabelas
- `approvers` - Aprovadores
- `cards` - Cards/GMUDs
- `card_approvers` - Relacionamento muitos-para-muitos

### Status dos Cards
- `aberta` - GMUD aberta
- `pendente-aprovacao-1` - Pendente primeira aprovação
- `pendente-aprovacao-2` - Pendente segunda aprovação
- `pendente-execucao` - Pendente execução
- `concluido` - Concluído

## 🔗 API Endpoints

### Aprovadores (`/approvers`)
- `GET /approvers` - Listar todos os aprovadores
- `POST /approvers` - Criar novo aprovador
- `GET /approvers/:id` - Buscar aprovador por ID
- `PATCH /approvers/:id` - Atualizar aprovador
- `DELETE /approvers/:id` - Remover aprovador

### Cards (`/cards`)
- `GET /cards` - Listar todos os cards
- `GET /cards?status=aberta` - Filtrar por status
- `POST /cards` - Criar novo card
- `GET /cards/:id` - Buscar card por ID
- `PATCH /cards/:id` - Atualizar card
- `PATCH /cards/:id/status` - Atualizar status do card
- `DELETE /cards/:id` - Remover card

## 🎨 Interface

### Layout Principal
```
┌─────────────────────────────────────────────────────────┐
│                    Header (fixo)                        │
├─────────────────────────────────────────────────────────┤
│ [Gerenciar Aprovadores] [JS] [MC] [AS] [PD] [RL] [CO]   │
├─────────────────────────────────────────────────────────┤
│ [Aberta] [Pendente 1] [Pendente 2] [Execução] [Concluído] │
│    │         │           │          │         │         │
│    │         │           │          │         │         │
│    │         │           │          │         │         │
└─────────────────────────────────────────────────────────┘
```

### Funcionalidades Especiais
- **Avatares Circulares**: Iniciais dos aprovadores em bolinhas coloridas
- **Filtros Visuais**: Clique nos avatares para filtrar
- **Filtro de Time**: Aparece apenas na coluna "Pendente de Execução"
- **Página de Aprovadores**: `/approvers` para gerenciar aprovadores

## 🔧 Comandos Disponíveis

### Frontend
- `npm run dev` - Servidor de desenvolvimento
- `npm run build` - Build para produção
- `npm run preview` - Preview do build
- `npm run lint` - Executar linter

### Backend
- `npm run start` - Servidor de produção
- `npm run start:dev` - Servidor de desenvolvimento
- `npm run start:debug` - Servidor com debug
- `npm run build` - Build para produção
- `npm run test` - Executar testes

## 📁 Estrutura do Projeto

```
kanban-gmud/                 # Frontend React
├── src/
│   ├── components/         # Componentes React
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Serviços de API
│   └── pages/              # Páginas
└── backend/                # Backend NestJS
    ├── src/
    │   ├── entities/       # Entidades do banco
    │   ├── modules/        # Módulos NestJS
    │   └── services/       # Serviços de negócio
    └── README.md
```

## 🚀 Próximas Funcionalidades

- [ ] Autenticação de usuários
- [ ] Histórico de movimentações
- [ ] Notificações por email
- [ ] Relatórios e métricas
- [ ] Integração com APIs externas
- [ ] Testes automatizados

## 📄 Licença

Este projeto é de uso interno para gestão de GMUDs.