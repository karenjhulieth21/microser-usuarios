# React de pruebas para usuarios

## Instalacion

```bat
cd react-pruebas-usuarios
npm install
```

## Ejecucion

En una terminal levanta el backend:

```bat
cd ..
npm run start:dev
```

En otra terminal levanta la app React:

```bat
cd react-pruebas-usuarios
npm run dev
```

La app quedara disponible en `http://localhost:5173`.

## Que prueba

- Creacion de usuarios por `POST /api/usuarios`
- Consulta de usuarios por `GET /api/usuarios`
- Validacion local del dominio `@correounivalle.edu.co`
