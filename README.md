# Mis Desarrollos - Portfolio Open Source

Una aplicación web moderna para publicar y mostrar proyectos de código abierto, construida con Next.js, Prisma y diseño inspirado en Mercado Libre.

## 🚀 Características

- **Grid de proyectos**: Vista moderna con tarjetas de proyectos
- **Página de detalle**: Imagen grande, descripción completa y URL del proyecto
- **Sistema de comentarios**: Los usuarios pueden dejar comentarios en cada proyecto
- **Diseño moderno**: Inspirado en Mercado Libre con paleta amarilla
- **Base de datos**: SQLite con Prisma ORM
- **TypeScript**: Tipado completo para mayor seguridad

## 🛠️ Tecnologías

- **Next.js 16**: Framework React con App Router
- **TypeScript**: Tipado estático
- **Prisma**: ORM para base de datos
- **Tailwind CSS**: Estilos modernos y responsivos
- **SQLite**: Base de datos local

## 📦 Instalación

1. Clona el repositorio:
```bash
git clone <tu-repo>
cd misdesarrollos.xyz
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura la base de datos:
```bash
npx prisma migrate dev
npm run db:seed
```

4. Inicia el servidor de desarrollo:
```bash
npm run dev
```

5. Abre [http://localhost:3000](http://localhost:3000) en tu navegador

## 📝 Scripts disponibles

- `npm run dev`: Inicia el servidor de desarrollo
- `npm run build`: Construye la aplicación para producción
- `npm start`: Inicia el servidor de producción
- `npm run db:seed`: Puebla la base de datos con datos de ejemplo

## 🗄️ Estructura de la base de datos

### Project
- `id`: String (CUID)
- `title`: String
- `description`: String
- `imageUrl`: String
- `projectUrl`: String
- `tags`: String (JSON array)
- `createdAt`: DateTime
- `updatedAt`: DateTime

### Comment
- `id`: String (CUID)
- `name`: String
- `email`: String
- `message`: String
- `createdAt`: DateTime
- `projectId`: String (FK)

## 🎨 Diseño

El diseño está inspirado en Mercado Libre con:
- Paleta de colores amarilla (#FFE600)
- Tarjetas con sombras suaves
- Diseño limpio y moderno
- Totalmente responsivo

## 📱 API Endpoints

- `GET /api/projects`: Obtiene todos los proyectos
- `POST /api/projects`: Crea un nuevo proyecto
- `GET /api/projects/[id]`: Obtiene un proyecto específico
- `GET /api/projects/[id]/comments`: Obtiene comentarios de un proyecto
- `POST /api/projects/[id]/comments`: Crea un comentario

## 🔧 Agregar nuevos proyectos

Puedes agregar proyectos directamente en la base de datos o mediante la API:

```javascript
fetch('/api/projects', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    title: 'Mi Proyecto',
    description: 'Descripción del proyecto',
    imageUrl: 'https://example.com/image.jpg',
    projectUrl: 'https://github.com/usuario/proyecto',
    tags: ['React', 'TypeScript']
  })
})
```

## 📄 Licencia

MIT

## 👤 Autor

Marlon Falcón Hernández


## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
