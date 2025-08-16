import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router";
import Result from "@/components/pages/Result";
import Landing from "@/components/pages/Landing";

const queryClient = new QueryClient();

export default function Root(): React.ReactNode {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/result" element={<Result />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
