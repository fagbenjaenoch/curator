import { BrowserRouter } from "react-router";
import App from "@/App";

export default function Root(): React.ReactNode {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}
