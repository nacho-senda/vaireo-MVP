# Vaireo  
*Smart Scouting for AgriTech & FoodTech Startups*

Vaireo es un MVP diseñado para acelerar el análisis, descubrimiento y comprensión de startups dentro del vertical **AgriTech y FoodTech**. Combina un **recomendador basado en datos estructurados** con un **chatbot de consulta en lenguaje natural**, permitiendo explorar startups desde una base de datos viva (Google Sheets) sin necesidad de infraestructura compleja.

---

## 🚀 Características principales

### 🔍 Recomendador de Startups  
- Conectado a Google Sheets como base de datos principal  
- Interfaz dinámica montada en **v0.dev**  
- Autoadaptación a las columnas de la hoja  
- Listas, tarjetas y vistas personalizables  
- Búsqueda y filtrado rápido por campos clave  

### 💬 Chatbot de Consulta  
- Permite preguntas en lenguaje natural sobre las startups  
- Ideal para análisis y descubrimiento rápido  
- Integrable con modelos LLM externos  

### 🧩 Backend sin servidores  
- API generada con Google Apps Script  
- Devuelve datos en formato JSON  
- Sin servidores, sin mantenimiento, sin despliegues complejos  

---

## 🧱 Arquitectura
Google Sheets + Hubspot (bases de datos)
│
▼
Google Apps Script (API REST JSON)
│
▼
v0.dev (UI │ Recomendador │ Chatbot)


---

## 🗂 Estructura del Dataset  
La hoja de Google Sheets utiliza estos campos como encabezados:

- ID  
- Nombre  
- Descripción  
- Región (CCAA)  
- Año  
- Vertical  
- Subvertical  
- Tecnología  
- ODS principal  
- Tipo de impacto  
- Indicador de impacto  
- Escala de impacto  
- Población beneficiada / target  
- Diversidad del equipo  
- Nivel de madurez  
- Inversión total (€)  
- Contacto  
- Web  
- Fuente de información  

La UI se adapta automáticamente a estos nombres.

---


## 🧭 Roadmap

 Filtros avanzados (impacto, madurez, región)

 Matching algorítmico usando embeddings

 Enriquecimiento automático con fuentes externas

 Dashboard analítico sobre el dealflow

 Sistema de favoritos / shortlist

 Exportación a CSV/Excel/PDF


---


## 📩 Contacto

Vaireo — Senda Partners

📧 nacho@senda.partners

🌐 https://senda.partners
