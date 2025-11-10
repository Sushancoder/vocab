import "./globals.css";
import { Toaster } from 'react-hot-toast';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { roboto } from "./fonts/fonts";

export const metadata = {
  title: "The Vocab",
  description: "A vocabulary builder app",
  verification: {
    google: 'jjIUpPnrRJIXifoZ47fR6-BkIB4IcT1kXyBlMn6hji8',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${roboto.className}`}>
        {children}
        <Analytics />
        <SpeedInsights />
        <Toaster position="bottom-right" />
      </body>
    </html>
  );
}
