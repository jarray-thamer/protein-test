import "./globals.css";
import { ConfigProvider } from "antd";
import { Toaster } from "@/components/ui/toaster";
import axios from "axios";
import FloatingCart from "@/components/shared/floatingCart";

export const metadata = {
  title: "Sobitas",
  description: "Sobitas e-commerce store",
};

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
axios.defaults.withCredentials = true;
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#ff4000",
          },
        }}
      >
        <body className={` w-full`}>
          {children}
          <FloatingCart />
          <Toaster />
        </body>
      </ConfigProvider>
    </html>
  );
}
