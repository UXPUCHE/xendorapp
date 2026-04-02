# 🧠 Arquitectura — Xendor Embed

## 📦 Contexto

El sistema de ofertas se renderiza dentro de un iframe embebido en WordPress.

- Frontend: Next.js (embed)
- Contenedor: WordPress
- Comunicación: window.postMessage

---

## ⚠️ Decisión clave: Sticky fuera del iframe

El sticky footer de selección de hotel **NO se renderiza dentro del embed (React)**.

### ❌ Problema

- El iframe no comparte el contexto de scroll con el parent (WordPress)
- `position: fixed` funciona relativo al iframe, no al viewport real
- Esto genera:
  - sticky que no aparece correctamente
  - problemas de altura
  - comportamiento inconsistente

---

## ✅ Solución

El sticky se renderiza en WordPress (fuera del iframe).

React únicamente envía datos mediante `postMessage`.

---

## 🔄 Flujo de datos

### 1. React (iframe)

```ts
window.parent.postMessage({
  type: "HOTEL_SELECTED",
  payload: {
    hotel,
    precio,
    plan,
    destino,
    fecha_inicio,
    fecha_fin
  }
}, "*")