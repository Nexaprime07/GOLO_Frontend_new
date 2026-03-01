import "./globals.css";
import { AuthProvider } from "./context/AuthContext";

export const metadata = {
  title: "Golo",
  description: "Best Deals & Offers Near You",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
