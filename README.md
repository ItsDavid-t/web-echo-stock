---
<p align="right">Developed with ❤️ by <b>ItsDavid-t</b> 🐢</p>

---

# 🌐 Echo Stock Web - Client Catalog

> **High-performance, SEO-optimized public product catalog engineered with Clean Architecture for seamless retail distribution.**

<p align="left">
  <img src="https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.dot.js&logoColor=white" alt="Next.js" />
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase" />
</p>

---

### 💎 Value Proposition
**Echo Stock Web** is the client-facing storefront of the inventory ecosystem. It delivers an ultra-fast, lightweight, and intuitive browsing experience designed to maximize product visibility and streamline client inquiries for local MiPyMEs.

* **Blazing Fast Performance:** Powered by **Next.js 16** and **React 19** server-side optimizations to guarantee instant catalog rendering even on restricted mobile networks.
* **Modern Adaptive UI:** Built with **Tailwind CSS 4** featuring an elegant responsive grid layout and full dark/light theme toggle synchronization.
* **Public Domain Isolation:** Connected directly to a secure, read-only **Supabase** infrastructure, ensuring clients can instantly query live data while business mutations remain completely sandboxed.
* **Smart Catalog Synchronization:** Consumes live data structures, automatically decoupling inventory flows so items under administrative evaluation or "Reserved" status are strictly isolated from the public view.

---

### 🛠️ Technical Specifications
* **Architecture:** Strictly decoupled **Domain-Driven Design (DDD)** separating core business use cases from infrastructure and presentation layers.
* **State & Domain Control:** Coordinated via pure controllers (`src/interfaces/controllers`) executing declarative application use cases.
* **Data Layer:** Repository Pattern abstraction utilizing Supabase Client SDK wrappers to isolate PostgreSQL queries.
* **Component Design:** Atomic presentation methodology (`ProductCard`, `ProductCatalogGrid`) ensuring maximum reusability and isolated visual state changes.

---

### 📱 App Screenshots

| 🔍 Advanced Catalog Filtering & Discovery |
| :---: |
| <img src="assets/images/WhatsApp%20Image%202026-05-17%20at%2012.34.09%20PM.jpeg" width="340" /><br><sub>*Dynamic multi-taxonomic filtering system processing Categories and Classifications in real time*</sub> |

| 📦 Live Product Feed | 🛒 Client Conversion Flow |
| :---: | :---: |
| <img src="assets/images/WhatsApp%20Image%202026-05-17%20at%2012.34.08%20PM.jpeg" width="270" /><br><sub>*Responsive Product Card layout displaying structured cloud data and publishing timestamps*</sub> | <img src="assets/images/WhatsApp%20Image%202026-05-17%20at%2012.33.55%20PM.jpeg" width="270" /><br><sub>*Integrated conversion workflow with direct call-to-actions for customer-to-admin routing*</sub> |

---

### 🏗️ Project Structure
The codebase follows enterprise-grade decoupled software guidelines to ensure long-term maintainability:

```text
├── app/                  # Next.js App Router core routing, layouts, and page entrypoints
└── src/
    ├── domain/           # Pure enterprise business entities and abstract repository contracts
    ├── usecases/         # Isolated application logic (e.g., loadProductCatalogUseCase)
    ├── interfaces/
    │   └── controllers/  # Presentation bridges driving UI synchronization
    ├── infra/
    │   └── repositories/ # Concrete Supabase API data-source implementations
    ├── ui/
    │   └── components/   # Pure Atomic design presentation components (Tailwind 4)
    └── lib/              # Cloud initialization drivers and third-party wrappers