# Frontend de pruebas de login

Interfaz estatica para probar el flujo del microservicio:

1. Generar o reiniciar acceso con `codigo + anioRegistro`.
2. Ver el rol identificado por el primer digito del codigo.
3. Ingresar con la contrasena temporal.
4. Cambiar la contrasena.

## Uso

1. Levanta el backend:

```bash
npm run start:dev
```

2. Abre `frontend-pruebas-login/index.html` en el navegador.

La URL por defecto del API es:

```text
http://localhost:3002/api
```
