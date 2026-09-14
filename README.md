# Consultorio — front (demo)

Mock funcional del sistema para mostrarle a los dos dentistas. Todo corre en el
navegador con datos de ejemplo guardados en `localStorage` (no hay backend
todavía).

## Cómo correrlo

```bash
npm install
npm run dev
```

Abrí la URL que te muestre la terminal (normalmente http://localhost:5173).
Para probarlo como si fuera una app de celular, abrí las devtools del
navegador y activá el modo responsive/mobile, o entrá desde el celular a la
IP de tu compu en la misma red (`npm run dev` ya expone `host: true`).

## Qué incluye este demo

- **Login simple**: elegís qué dentista sos (simula que cada uno tiene su
  cuenta).
- **Agenda**: turnos por día, compartida entre ambos. Se puede cargar un
  turno nuevo y, al tocarlo, registrar la atención (notas clínicas, receta,
  cobro, método de pago, obra social) o cancelarlo.
- **Pacientes**: alta de pacientes y ficha con historial clínico completo
  (todas las atenciones anteriores).
- **Finanzas**: métricas del mes, pero solo de la cuenta que tenés abierta —
  no se mezclan entre los dos dentistas.
- **Perfil**: cambiar de cuenta.

## Qué falta (para cuando pasemos al backend real)

- Autenticación real (por ahora es solo un selector de perfil).
- Persistencia compartida entre dispositivos (hoy cada celular tiene sus
  propios datos guardados localmente). Acá es donde entra Supabase/Neon:
  reemplazamos `src/lib/db.js` por llamadas a la API de NestJS sin tocar las
  pantallas, porque ya están pensadas para trabajar con esa forma de datos.
- Definir bien qué se comparte y qué no (dejé turnos y pacientes compartidos,
  y finanzas privada, como charlamos — es fácil de ajustar).
