export const metadata = {
  title: "Thought Partner V2",
  description: "Your personal thought partner space."
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
      </head>
      <body className="bg-black text-white">{children}</body>
    </html>
  );
}
