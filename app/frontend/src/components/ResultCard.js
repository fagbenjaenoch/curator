import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function ResultCard({ title, thumbUrl, url }) {
    return (_jsx("div", { className: "p-3 border rounded-md border-gray-200 shadow transition-transform ease-in-out duration-300 hover:translate-y-[-3px]", children: _jsxs("a", { href: url, target: "blank", className: "flex gap-4", children: [_jsx("img", { src: thumbUrl, alt: title, className: "object-cover w-[100px]" }), _jsx("span", { className: "text-left", children: title })] }) }));
}
