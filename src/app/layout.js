'use client';

import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import WindowWrapper from './components/WindowWrapper';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export default function RootLayout({ children }) {
  return (
    <html lang='en'>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <WindowWrapper>{children}</WindowWrapper>
        <ToastContainer />
      </body>
    </html>
  );
}
