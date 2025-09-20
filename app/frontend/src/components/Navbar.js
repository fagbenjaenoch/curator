import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Button } from "@/components/ui/button";
import Github from "@/components/ui/Github";
export default function Navbar() {
    return (_jsx("div", { className: "p-8 bg-amber-300 text-black", children: _jsxs("div", { className: "max-w-7xl mx-auto flex justify-between", children: [_jsx("span", { className: "text-lg", children: "Curator." }), _jsx("div", { className: "flex gap-2", children: _jsx(Button, { className: "cursor-pointer", asChild: true, children: _jsxs("a", { href: "https://github.com/fagbenjaenoch/curator", children: [_jsx(Github, {}), "Contribute"] }) }) })] }) }));
}
