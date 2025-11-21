// src/app/instructor/register/page.js
"use client"
import { Suspense } from 'react';
import { ThemeProvider } from '../../../../lib/ThemeContext';
import Navbar from '../../../../components/Navbar';
import InstructorRegisterForm from '../../../../components/InstructorRegisterForm';

export default function InstructorRegisterPage() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
        <Navbar showAuth={false} />
        <Suspense fallback={
          <div className="flex justify-center items-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        }>
          <InstructorRegisterForm />
        </Suspense>
      </div>
    </ThemeProvider>
  );
}
