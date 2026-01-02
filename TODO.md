poder agregar atajos como moverse con las flechas entre dias

agregar control k

en movil cuando me desplazo a la izquierda o derecha cambiar entre las fechas


## 🧾 Historia de usuario: Exportación optimizada en TXT (Journal / Agenda)

**Como** usuario de la aplicación de agenda/journal
**quiero** que mis datos se exporten en un formato TXT optimizado y legible
**para** ahorrar espacio, facilitar backups, edición manual, uso con git y sincronización offline.

---

### 🎯 Contexto

Actualmente la aplicación exporta la información diaria en formato JSON, lo cual es correcto para APIs, pero ineficiente para almacenamiento local, lectura humana y control de versiones.
Se busca introducir un **formato TXT estructurado**, compacto y reversible, manteniendo todas las funcionalidades actuales (notas, mood, check-ins, tags, etc.).

---

### ✅ Criterios de aceptación

* La app debe poder exportar los datos del journal en **formato TXT**
* El formato debe:

  * Ser **legible por humanos**
  * Ser **mucho más compacto que JSON**
  * Mantener **toda la información actual**
  * Ser **parseable de forma determinista** (TXT ⇄ JSON)
* El export TXT debe incluir:

  * Metadata global (versión, fecha de exportación)
  * Entradas agrupadas por día
  * Nota principal del día
  * Mood, energía y tags
  * Check-ins de estado con hora y nota opcional

---

### 🧱 Formato TXT propuesto

```txt
@v=1.0
@export=2026-01-01T22:29Z

# 2026-01-01
mood: excelente
energy: -
tags: -

> No tengo ganas de dormir

~ 17:24 peor
~ 17:24 igual
~ 17:24 mejor
~ 17:27 igual | no paso nada interesante
```

---

### 🧠 Reglas de formato

* `@` → metadata global
* `#` → día
* `>` → nota principal del día
* `~` → check-in de estado
* `|` → separador para nota opcional
* `-` → valor nulo o vacío

---

### 🔧 Consideraciones técnicas

* El formato TXT será usado para:

  * Almacenamiento local
  * Exportación
  * Backup
* JSON se mantiene solo para:

  * Sync
  * API
  * Comunicación entre servicios
* Posible organización futura:

  ```
  journal/
   └─ 2026/
      └─ 01/
         └─ 01.txt
  ```

---

### 📦 Valor agregado

* Menor uso de espacio
* Mejor experiencia offline
* Mejor compatibilidad con git
* Alineado con una agenda tipo física
* Base sólida para futuras features (diff por día, sync incremental)

---

Si quieres, en el siguiente paso puedo:

* dividir esta historia en **subtasks**
* agregar **definición de terminado (DoD)**
* o adaptarla a un formato más corto tipo *Atomic Task* para tu `todo.md` minimalista
