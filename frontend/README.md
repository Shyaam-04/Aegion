# Aegion Frontend Architecture

Here is a clear breakdown of what each file in the `frontend/` folder does, organized by their role in the architecture.

## ⚙️ Core Configuration (Root level)

* **`package.json`**: Lists all the dependencies (React, Tailwind, Vite, Lucide icons) and scripts (like `npm run dev`) needed to run the frontend.
* **`vite.config.js`**: Configuration for Vite, the build tool we are using instead of Create React App because it is significantly faster.
* **`tailwind.config.js`**: Contains our custom design system tokens (specific colors like `risk-high` and custom animations like `pulse-ring`). 
* **`postcss.config.js`**: Processes the Tailwind CSS.
* **`index.html`**: The single HTML page that loads the React application and sets basic SEO/metadata.

## 🚀 Application Entry (`src/`)

* **`main.jsx`**: The React entry point that takes the `App` component and mounts it into the HTML document.
* **`App.jsx`**: The "brain" of the UI. It holds the central state (form data, results, loading status) and pieces together the layout, form, stats panel, and overlays.
* **`index.css`**: Our master stylesheet. It imports Tailwind and defines all our CSS custom properties (variables) for the dark/light themes, as well as complex CSS like the glassmorphic card effect and the ECG loading line.

## 🔌 Data Layer (`src/api/` & `src/hooks/`)

* **`api/aegionApi.js`**: The central place for all communication with your FastAPI backend. It exports clean functions (`checkDrugs`, `getStats`, `getHistory`, `checkHealth`) so components don't have to write fetch requests directly.
* **`hooks/useStats.js`**: A custom React hook that fetches the system stats on load and then automatically polls the `/stats` endpoint every 30 seconds to keep the dashboard live.

## 🎨 Global Context & Data (`src/context/` & `src/constants/`)

* **`context/ThemeContext.jsx`**: Manages the Dark/Light mode state. It reads your preference from the browser's `localStorage` and applies the correct CSS class to the document so your choice is remembered across reloads.
* **`constants/medicines.js`**: Contains an array of common clinical drugs and a smart fuzzy-search function (`searchMedicines`). This allows the autocomplete to work instantly without spamming the backend on every keystroke.

## 🧩 Components (`src/components/`)

The UI is divided into logical, modular pieces so the code is easy to maintain and scale.

### 1. Layout (`layout/`)
* **`Layout.jsx`**: A simple wrapper that applies the background grid pattern to the whole app.
* **`Navbar.jsx`**: The top bar. It shows the Aegion logo, the live operational stats strip, the pulsing online/offline status dot, and the theme toggle.

### 2. Data Entry (`form/`)
* **`PrescriptionForm.jsx`**: The left panel containing all the inputs for Doctor ID, patient age/weight, and the analysis button.
* **`MedicineTagInput.jsx`**: The most complex input. It handles typing to search for a drug, showing the autocomplete dropdown, keyboard navigation (up/down/enter), and displaying selected drugs as chips with "×" buttons.
* **`TagInput.jsx`**: A simpler, reusable version of the tag input used for typing freeform lists (like Known Allergies or Conditions) where you type and press Enter.

### 3. Dashboard Sections (`stats/` & `history/`)
* **`stats/StatsPanel.jsx`**: The top-right section that renders the grid of metrics and the colorful CSS-based risk distribution bars (High/Medium/Low).
* **`stats/MetricCard.jsx`**: A reusable, clean little tile used inside the StatsPanel to show a single number (e.g., "Total Checks: 120").
* **`history/HistoryTable.jsx`**: The bottom-right section. It takes the array of past checks and renders them into a clean, easy-to-read list with relative times ("2m ago").

### 4. Overlays (`results/` & `ui/`)
* **`results/ResultsOverlay.jsx`**: The massive full-screen modal that slides up when an analysis finishes. It orchestrates the hero section (Safe/Unsafe) and loops through the interaction/allergy cards.
* **`results/InteractionCard.jsx`**: Displays a single drug-drug interaction, showing the two drugs, severity, mechanism, clinical recommendation, and confidence bar.
* **`results/AllergyCard.jsx`**: Similar to the interaction card, but specifically styled for allergy alerts with a red warning aesthetic.
* **`results/RiskBadge.jsx`**: A tiny, reusable UI pill (High/Medium/Low Risk) with a colored dot used everywhere across the app.
* **`ui/LoadingOverlay.jsx`**: The full-screen blocker that shows when the backend is thinking. It features the animated ECG heartbeat line and cycles through clinical messages (e.g., "Running LLM inference...") so the user knows the app hasn't frozen.
