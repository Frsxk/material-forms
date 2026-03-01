# Material Forms

A form builder inspired by Google Forms, built with Material Design 3. Create forms, share them publicly, and view response analytics with per-question visualizations.

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS 4
- **Backend:** [material-backend](https://github.com/Frsxk/material-backend) - Elysia (Bun) + Prisma
- **Design:** Material Design 3 tokens, light/dark theme

## Features

- Drag-and-drop question reordering
- 8 question types (multiple choice, checkbox, dropdown, scale, rating, short/long text, date)
- Live theme customization (colors, fonts)
- Auto-saving with error toast notifications
- CSV export of responses
- Per-question-type chart visualizations (donut, bar, histogram, star breakdown)
- Rate limit handling on form submissions
- JWT authentication

## Getting Started

### Prerequisites

- Node.js 18+
- The [material-backend](https://github.com/Frsxk/material-backend) running on `localhost:5000`

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Frsxk/material-forms.git
cd material-forms
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.
