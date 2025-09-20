import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
export default function Layout({ children }) {
    return (_jsxs(_Fragment, { children: [_jsx(Navbar, {}), children, _jsx(Footer, {})] }));
}
