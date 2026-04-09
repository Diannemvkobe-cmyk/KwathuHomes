/*
Purpose
- Catches unexpected errors and shows a friendly fallback screen.
- Prevents the entire app from crashing visibly to the user.

How It Works
- Uses React Error Boundary lifecycle to set hasError on failures.
- Logs error details to the console for debugging.
- Displays a simple message with “Back to Home” action.

Where It Fits
- Wraps the root app in main.jsx to safeguard rendering.
*/
import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 text-center font-sans">
          <div className="max-w-md w-full bg-white rounded-3xl p-12 shadow-2xl border border-slate-100">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tighter">Something went wrong</h1>
            <p className="text-slate-500 font-medium mb-8">
              We encountered an unexpected error. Don't worry, it's not you, it's us.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-emerald-600 transition-all uppercase tracking-widest text-xs shadow-xl active:scale-95"
            >
              Back to Home
            </button>
            <p className="mt-8 text-[10px] text-slate-400 font-mono break-all opacity-50">
              {this.state.error && this.state.error.toString()}
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
