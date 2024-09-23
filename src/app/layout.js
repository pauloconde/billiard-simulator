import './globals.css'

export const metadata = {
  title: 'Billiard Simulator',
  description: '3-cushion billiard simulator',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}