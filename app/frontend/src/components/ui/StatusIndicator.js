import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function StatusIndicator(props) {
    return (_jsxs("div", { ...props, className: "relative inline-flex items-center", children: [_jsx("span", { className: "absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75 animate-ping" }), _jsx("span", { className: "relative inline-flex h-2 w-2 rounded-full bg-green-500" })] }));
}
