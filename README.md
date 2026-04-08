# Shagym Portal / Шағым Порталы

Веб-портал для подачи и отслеживания жалоб граждан Казахстана.
Платформа позволяет жителям сообщать о проблемах в их районе, голосовать за важные обращения и следить за процессом их решения в реальном времени.

**Автор:** Адеми — студент, AdemiQAE

---

## Стек технологий

| Слой | Технологии |
|---|---|
| **Frontend** | Next.js 16 (App Router), React 19, CSS Custom Properties, Framer Motion |
| **Backend** | Next.js API Routes, Prisma ORM 7 |
| **Database** | PostgreSQL (Neon Serverless) |
| **Auth** | NextAuth.js v5 (beta) — Credentials provider, JWT strategy |
| **i18n** | next-intl 4 (русский + казахский) |
| **Maps** | Leaflet / React-Leaflet |
| **Icons** | Собственный SVG-компонент (`components/ui/Icon.tsx`) |
| **Тестирование** | Vitest, Testing Library |

---

## Структура проекта

```
shagym-portal/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Корневой layout (ThemeProvider, i18n, Header)
│   ├── page.tsx                # Главная — лента обращений с фильтрами
│   ├── not-found.tsx           # Страница 404
│   ├── error.tsx               # Глобальная обработка ошибок
│   ├── submit/page.tsx         # Форма подачи нового обращения
│   ├── cabinet/page.tsx        # Личный кабинет пользователя
│   ├── complaints/[id]/page.tsx# Детальная страница обращения (таймлайн, комментарии)
│   ├── admin/
│   │   ├── page.tsx            # Панель администратора (таблица, фильтры)
│   │   └── complaint/[id]/page.tsx # Управление статусом обращения
│   ├── auth/
│   │   ├── login/page.tsx      # Страница входа
│   │   └── register/page.tsx   # Страница регистрации
│   └── api/
│       ├── auth/register/      # POST — регистрация
│       ├── complaints/         # GET / POST — список и создание
│       ├── complaints/[id]/    # GET / PATCH — детали и смена статуса
│       ├── complaints/[id]/comments/ # POST — комментарии
│       └── votes/              # POST / DELETE — голосование
├── components/
│   ├── admin/
│   │   └── AdminComplaintForm.tsx  # Форма смены статуса (только допустимые переходы)
│   ├── complaint/
│   │   ├── ComplaintCard.tsx       # Карточка обращения в ленте
│   │   ├── ComplaintMap.tsx        # Leaflet-карта местоположения
│   │   ├── ComplaintMapWrapper.tsx # Обёртка для SSR-safe динамического импорта
│   │   ├── CommentForm.tsx         # Форма комментария
│   │   ├── StatusBadge.tsx         # Цветной badge статуса
│   │   └── VoteButton.tsx          # Кнопка голосования (optimistic UI)
│   ├── layout/
│   │   ├── Header.tsx              # Шапка (desktop + mobile menu)
│   │   ├── LanguageSwitcher.tsx    # Переключатель KZ / RU
│   │   └── ThemeSwitcher.tsx       # Переключатель светлой / тёмной темы
│   ├── providers/
│   │   └── ThemeProvider.tsx       # Контекст темы
│   └── ui/
│       ├── Icon.tsx                # SVG-иконки
│       ├── ImageUploader.tsx       # Загрузка изображений (Base64)
│       ├── Logo.tsx                # Логотип
│       ├── MapPicker.tsx           # Выбор точки на карте
│       └── Toast.tsx               # Уведомления
├── lib/
│   ├── auth.ts                 # Конфигурация NextAuth (JWT, callbacks)
│   ├── db.ts                   # Prisma Client singleton
│   ├── utils.ts                # Утилиты: cookie, formatDate, timeAgo
│   ├── status-transitions.ts   # Карта допустимых переходов между статусами
│   └── i18n/request.ts         # Серверная загрузка переводов
├── messages/
│   ├── ru.json                 # Русские переводы
│   └── kz.json                 # Казахские переводы
├── prisma/
│   └── schema.prisma           # Модели: User, Complaint, Vote, Comment, StatusLog
├── middleware.ts                # Защита /admin/* — только role === ADMIN
├── types/
│   └── next-auth.d.ts          # Расширение типов NextAuth (role, id)
└── package.json
```

---

## Инструкция по запуску

### 1. Клонирование репозитория

```bash
git clone https://github.com/AdemiQAE/shagym-portal.git
cd shagym-portal
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Настройка переменных окружения

Создайте файл `.env` в корне проекта:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Подготовка базы данных

```bash
npx prisma generate
npx prisma db push
```

### 5. Запуск в режиме разработки

```bash
npm run dev
```

Проект будет доступен по адресу **[http://localhost:3000](http://localhost:3000)**.

### 6. Сборка для продакшена

```bash
npm run build
npm start
```

---

## Основные API эндпоинты

| Метод | Путь | Описание | Доступ |
|---|---|---|---|
| `POST` | `/api/auth/register` | Регистрация пользователя | Публичный |
| `GET` | `/api/complaints` | Список обращений (фильтрация, сортировка) | Публичный |
| `POST` | `/api/complaints` | Создание обращения | Авторизованный |
| `GET` | `/api/complaints/[id]` | Детали обращения | Публичный |
| `PATCH` | `/api/complaints/[id]` | Смена статуса + запись в StatusLog | ADMIN |
| `POST` | `/api/complaints/[id]/comments` | Добавление комментария | Авторизованный |
| `POST` | `/api/votes` | Голос «за» (upvote) | Авторизованный |
| `DELETE` | `/api/votes` | Отмена голоса | Авторизованный |

---

## Роли пользователей

- **USER** — подаёт обращения, голосует, комментирует, видит свои обращения в личном кабинете.
- **ADMIN** — имеет доступ к панели `/admin`, меняет статусы обращений по строгой карте переходов, оставляет официальные ответы с фотоотчётами.

### Карта переходов статусов

```
PENDING → ACCEPTED / IN_PROGRESS / CANCELLED
ACCEPTED → IN_PROGRESS / CANCELLED
IN_PROGRESS → RESOLVED / CANCELLED
RESOLVED → (терминальный)
CANCELLED → (терминальный)
```

---

## Особенности реализации

- **Dark Mode** — поддержка светлой и тёмной тем с сохранением выбора в cookie.
- **Optimistic UI** — голосование обновляет UI мгновенно, откат при ошибке сервера.
- **Base64 Images** — изображения сохраняются в БД, упрощая деплой без внешнего хранилища.
- **Timeline** — прозрачная история изменений статуса для каждого обращения.
- **Middleware** — централизованная защита админ-маршрутов через `middleware.ts`.
- **Server-side validation** — проверка допустимых переходов статусов на уровне API.
- **i18n** — полная поддержка казахского и русского языков через `next-intl`.
