# Inventario App — Prueba Técnica Softnet SA de CV

Aplicación de gestión de inventario construida con React + TypeScript + Vite, 
conectada a Supabase (Auth + Postgres) y desplegada en Vercel.

## 🚀 Demo en vivo

https://inventario-app-eight-tau.vercel.app

## 🛠️ Stack utilizado

- **Frontend**: React + Vite + TypeScript
- **Backend / datos**: Supabase (PostgreSQL + Auth)
- **Ruteo**: react-router-dom
- **Gráficas**: Recharts (bonus)
- **Testing**: Vitest (bonus)
- **Despliegue**: Vercel

## 📋 Cómo correr el proyecto localmente

### 1. Clonar el repositorio

\`\`\`bash
git clone https://github.com/Nico2845/inventario-app.git
cd inventario-app
\`\`\`

### 2. Instalar dependencias

\`\`\`bash
npm install
\`\`\`

### 3. Configurar variables de entorno

Crea un archivo `.env.local` en la raíz del proyecto con:

\`\`\`
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-publishable-key
\`\`\`

(Estas credenciales las puedes pedir al evaluador o generar tu propio proyecto 
de Supabase corriendo el script SQL provisto en la prueba)

### 4. Correr en modo desarrollo

\`\`\`bash
npm run dev
\`\`\`

La app corre en `http://localhost:5173`

### 5. (Opcional) Correr las pruebas unitarias

\`\`\`bash
npm run test
\`\`\`

## 🧩 Decisiones técnicas

- **React + Vite en vez de Next.js**: se eligió por familiaridad previa con el 
  stack y para maximizar el tiempo disponible en funcionalidad sobre 
  aprendizaje de un framework nuevo.
- **TypeScript**: para tipar la estructura de `Product` desde el inicio y 
  prevenir bugs en los cálculos de estado y cobertura, que son el núcleo de 
  la prueba.
- **Filtrado y paginación en el frontend, no en Supabase**: con un volumen de 
  datos tan bajo (12 productos), filtrar y paginar en el cliente es más simple 
  y rápido que agregar lógica de queries dinámicas al backend.
- **Estado (Crítico/Bajo/Saludable/Exceso) calculado en el cliente, nunca 
  guardado en la base de datos**: así como pide el documento, evitando 
  desincronización entre el estado guardado y el stock real.
- **Lógica de negocio centralizada en `src/lib/productStatus.ts`**: funciones 
  puras (`getProductStatus`, `getCoverageDays`, `isExpiringSoon`, etc.) 
  reutilizadas en el listado, detalle y dashboard, evitando duplicar la misma 
  lógica en varios componentes — esto también permitió agregar pruebas 
  unitarias fácilmente.
- **Context API para sesión e idioma** (`AuthContext`, `LanguageContext`) en 
  vez de una librería de estado global: para el tamaño de esta app, Redux o 
  Zustand hubiera sido complejidad innecesaria.
- **RLS deshabilitado en Supabase**: se priorizó tiempo de desarrollo; en un 
  entorno de producción real se activarían políticas de Row Level Security 
  para restringir lectura/escritura solo a usuarios autenticados.

## ✅ Funcionalidades implementadas

- Autenticación con Supabase Auth, rutas protegidas y logout
- Listado de productos con búsqueda, filtros por categoría y estado, y 
  paginación
- Detalle de producto con cobertura en días y alerta de vencimiento
- Crear y editar producto con validaciones (campos obligatorios, valores no 
  negativos)
- Dashboard con 3 KPIs (total de SKUs, valor total de inventario, productos 
  próximos a vencer)
- **Bonus**: eliminar producto, gráfica de valor por categoría, toggle de 
  idioma ES/EN, paginación, pruebas unitarias de la lógica de estado

## 🔮 Qué mejoraría con más tiempo

- Activar RLS en Supabase con políticas específicas por rol/usuario
- Agregar más cobertura de pruebas (componentes, no solo funciones puras)
- Mover el filtrado/paginación al backend si el volumen de datos creciera 
  significativamente
- Agregar manejo de errores más granular (ej. reintentos automáticos en fetch 
  fallido)
- Mejorar accesibilidad (más atributos ARIA, navegación completa por teclado)
- Agregar loading skeletons en vez de texto plano de "Cargando..."