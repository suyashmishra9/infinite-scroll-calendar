# 📅 Infinite Scroll Calendar

A modern, responsive calendar application built with React, TypeScript, and Vite. Features infinite scrolling, journal entry management, and a beautiful mobile-first design.

# LIVE LINK :- https://infinite-scroll-calendar-3ztq.vercel.app/

## ✨ Features

- **Infinite Scroll Calendar**: Smooth infinite scrolling through months and years
- **Journal Entries**: Create, view, edit, and delete journal entries for any date
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Search & Navigation**: Quick month/year picker for easy navigation
- **Sample Data**: Load sample entries to get started quickly
- **Local Storage**: All data is persisted locally in your browser
- **Modern UI**: Clean, intuitive interface with smooth animations

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (version 16 or higher)
- **npm** (comes with Node.js) or **yarn**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/infinite-scroll-calendar.git
   cd infinite-scroll-calendar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   
   Navigate to `http://localhost:5173` to view the application.

## 🛠️ Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the development server |
| `npm run build` | Build the project for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint to check for code issues |

## 📱 How to Use

### Calendar Navigation
- **Scroll**: Use your mouse wheel or touch gestures to scroll through months
- **Search**: Click the search icon in the bottom navigation to jump to a specific month/year
- **Current Month**: The calendar automatically scrolls to the current month on load

### Journal Entries
- **Create Entry**: Click the "+" button or select a date and click "Add"
- **View Entries**: Click on any date with entries to view them
- **Edit Entry**: Click on an existing entry to edit it
- **Delete Entry**: Click the delete button on any entry
- **Sample Data**: Click the archive icon to load sample entries

### Entry Details
Each journal entry can include:
- **Description**: Text content for your entry
- **Rating**: Rate your day from 1-5 stars
- **Categories**: Add tags to categorize your entries
- **Image**: Upload an image to accompany your entry

## 🏗️ Project Structure

```
src/
├── components/          # React components
│   ├── CalendarDayCell.tsx
│   ├── CalendarHeader.tsx
│   ├── CreateEntryModal.tsx
│   ├── InfiniteCalendar.tsx
│   ├── JournalModal.tsx
│   ├── MonthView.tsx
│   └── MonthYearPickerModal.tsx
├── data/               # Sample data
│   └── sampleData.json
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   ├── calendar.ts
│   └── journal.ts
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## 🛠️ Tech Stack

- **React 19** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Styling framework
- **date-fns** - Date manipulation
- **Heroicons** - Icon library
- **React Icons** - Additional icons
- **React Swipeable** - Touch gesture support

## 🔧 Development

### Code Quality
- **ESLint**: Configured with TypeScript and React rules
- **TypeScript**: Strict type checking enabled
- **Prettier**: Code formatting (if configured)

### Browser Support
- Modern browsers with ES6+ support
- Mobile browsers with touch support
- Responsive design for all screen sizes

## 📦 Building for Production

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Preview the build**
   ```bash
   npm run preview
   ```

The built files will be in the `dist/` directory and can be deployed to any static hosting service.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Vite](https://vitejs.dev/)
- Icons by [Heroicons](https://heroicons.com/)
- Date handling by [date-fns](https://date-fns.org/)
- Styling with [Tailwind CSS](https://tailwindcss.com/)
