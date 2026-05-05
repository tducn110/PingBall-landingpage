# PingBall - Landing Page

Landing page giới thiệu giải đấu PingBall.

## Công nghệ

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS v4**
- **shadcn/ui** (Radix UI components)
- **pnpm** (package manager)

## Cài đặt

```bash
pnpm install
```

## Chạy dev server

```bash
pnpm dev
```

Mặc định chạy tại `http://localhost:5173`.

## Build production

```bash
pnpm build
```

Output tại thư mục `dist/`.

## Cấu trúc dự án

```
src/
├── app/
│   ├── App.tsx            # Entry point
│   ├── components/        # UI components
│   │   ├── hero/          # Hero section
│   │   ├── ui/            # shadcn/ui components
│   │   ├── Figma/         # Figma image components
│   │   ├── format/        # Tournament format
│   │   ├── form/          # Registration form
│   │   ├── info/          # Tournament info
│   │   └── footer/        # Footer
│   └── constants.ts
├── lib/                   # Utilities, config
├── api/                   # API layer (Supabase)
├── hooks/                 # React hooks
├── types/                 # TypeScript types
└── main.tsx              # App entry
```
