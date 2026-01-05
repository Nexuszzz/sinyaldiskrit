# Discrete-Time Signal Simulator - README

## 🎯 Overview

A web-based interactive simulator for discrete-time signal processing. Built for students learning signal operations, transformations, and analysis.

## 🚀 Quick Start

```bash
cd d:\projeksinyal\discrete-signal-simulator
npm install
npm run dev
```

Open `http://localhost:5173/` in your browser.

## ✨ Features

- **Signal Input**: Support for δ(n), u(n), r(n), exponentials, arithmetic operations
- **Operations**: Time shift, folding, scaling, custom compositions
- **Visualization**: Interactive Plotly stem plots
- **Analysis**: Value tables, step-by-step explanations
- **Examples**: 9 pre-built example problems
- **Modern UI**: Dark theme, smooth animations, responsive design

## 📖 Usage Examples

### Basic Signals
```
u(n)              # Unit step
d(n-3)            # Delayed impulse
r(n)              # Ramp
0.8^n * u(n)      # Decaying exponential
```

### Operations
```
u(n+2) - u(n-1)   # Window function
```
Then apply:
- **Time Shift** (k=2): Delays signal
- **Folding**: Reflects around n=0
- **Scaling** (μ=2): Compresses signal
- **Composition** (-n-2): Custom transformation

## 🛠️ Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** for styling
- **Plotly.js** for plotting
- Safe expression parser (no eval())

## 📁 Project Structure

```
src/
├── components/     # React UI components
├── lib/           # Core signal processing logic
├── types/         # TypeScript definitions
├── examples/      # Example problems
└── App.tsx        # Main application
```

## ✅ All Features Working

- ✅ Expression parsing & validation
- ✅ Signal operations (shift/fold/scale/compose)
- ✅ Interactive stem plots
- ✅ Step-by-step explanations
- ✅ 9 example problems
- ✅ Even/odd decomposition
- ✅ Energy/power calculations

## 📝 License

Built for educational purposes.
