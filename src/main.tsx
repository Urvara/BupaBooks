import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import App from "./App";
//import "
const qc = new QueryClient({
  defaultOptions: { queries: { staleTime: 300000, gcTime: 600000, retry: 2 } },
});
ReactDOM.createRoot(document.getElementById("root")!).render(
  <QueryClientProvider client={qc}>
    <App />
  </QueryClientProvider>,
);
