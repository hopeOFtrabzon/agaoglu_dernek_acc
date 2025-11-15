import React from "react";
import ReactDOM from "react-dom/client";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import App from "./App";
import "./index.css";
import { AuthProvider } from "./providers/AuthProvider";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});

const theme = extendTheme({
  fonts: {
    heading: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
    body: "Inter, system-ui, -apple-system, BlinkMacSystemFont, sans-serif"
  },
  colors: {
    brand: {
      50: "#edf2ff",
      500: "#3b82f6",
      700: "#1d4ed8"
    }
  }
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
);
