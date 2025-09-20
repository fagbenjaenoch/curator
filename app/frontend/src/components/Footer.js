import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import StatusIndicator from "@/components/ui/StatusIndicator";
import Github from "@/components/ui/Github";
import X from "@/components/ui/X";
export default function Footer() {
    return (_jsx("footer", { children: _jsx("div", { className: "max-w-7xl mx-auto px-8 py-8", children: _jsxs("div", { className: "flex justify-between", children: [_jsxs("div", { className: "space-y-2", children: [_jsx("small", { className: "block", children: "Built with a step out of comfort" }), _jsxs("div", { className: "text-xs text-green-500 bg-green-100 border-1 border-green-500 w-max p-1 px-2 rounded-full inline-flex items-center gap-1", children: [_jsx(StatusIndicator, {}), _jsx("p", { children: "Available for hire" })] })] }), _jsxs("div", { className: "space-x-4 text-xs", children: [_jsx("a", { href: "http://github.com/fagbenjaenoch", className: "hover:text-muted-foreground", children: _jsx(Github, { className: "inline-block hover:text-muted-foreground" }) }), _jsx("a", { href: "http://x.com/fagbenjaenoch", className: "hover:text-muted-foreground", children: _jsx(X, { className: "inline-block" }) })] })] }) }) }));
}
