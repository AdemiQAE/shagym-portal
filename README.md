# Shagym Portal (Шағым Порталы)

Веб-портал для подачи и отслеживания жалоб граждан Казахстана. Платформа позволяет жителям сообщать о проблемах в их районе, голосовать за важные обращения и следить за процессом их решения в реальном времени.

**Автор:** Студент группы [Ваша группа] — [Ваше Имя]

## Стек технологий

- **Frontend:** Next.js 15+ (App Router), React 19, Tailwind CSS, Framer Motion
- **Backend:** Next.js API Routes, Prisma ORM
- **Database:** PostgreSQL (Neon Serverless)
- **Auth:** NextAuth.js v5 (Beta)
- **i18n:** next-intl (Поддержка русского и казахского языков)
- **Maps:** Leaflet / React-Leaflet
- **Icons:** Lucide React

## Инструкция по установке

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
Создайте файл `.env` в корне проекта и добавьте следующие переменные:
```env
# Database
DATABASE_URL="postgresql://user:password@host:port/dbname?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="your-secret-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Подготовка базы данных
```bash
npx prisma generate
npx prisma db push
```

### 5. Запуск проекта
```bash
npm run dev
```
Проект будет доступен по адресу [http://localhost:3000](http://localhost:3000).

## Основные API эндпоинты

### Авторизация
- `POST /api/auth/register` — Регистрация нового пользователя.

### Жалобы (Complaints)
- `GET /api/complaints` — Получение списка жалоб с фильтрацией и сортировкой.
- `POST /api/complaints` — Создание новой жалобы (требуется авторизация).
- `GET /api/complaints/[id]` — Получение деталей конкретной жалобы.
- `PATCH /api/complaints/[id]` — Обновление статуса жалобы (только для ADMIN).

### Голосование и Комментарии
- `POST /api/votes` — Добавление голоса (Upvote).
- `DELETE /api/votes` — Удаление голоса (Unvote).
- `POST /api/complaints/[id]/comments` — Добавление комментария к жалобе.

## Роли пользователей
- **USER:** Может подавать жалобы, голосовать, оставлять комментарии и просматривать статус своих обращений в личном кабинете.
- **ADMIN:** Имеет доступ к панели `/admin`, может менять статусы жалоб и оставлять официальные ответы.

## Особенности реализации
- **Dark Mode:** Поддержка светлой и темной тем с сохранением выбора пользователя.
- **Optimistic UI:** Голосование происходит мгновенно на клиенте, не дожидаясь ответа сервера.
- **Base64 Images:** Изображения сохраняются напрямую в БД, что упрощает деплой.
- **Timeline:** Прозрачная история изменений статуса для каждой жалобы.
