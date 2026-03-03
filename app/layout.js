import './globals.css';

export const metadata = {
  title: 'Birthday Grammar Game',
  description: 'A fun real-time grammar validation game for birthday parties',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
