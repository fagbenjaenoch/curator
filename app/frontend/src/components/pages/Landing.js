import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import ovalMarker from "@/assets/oval marker.svg";
import Dropzone from "@/components/Dropzone";
import Layout from "../Layout";
export default function Landing() {
    return (_jsx(Layout, { children: _jsxs("section", { className: "mt-[100px] px-4 max-w-7xl mx-auto text-center", children: [_jsxs("h1", { children: ["Need help with your document?", _jsx("br", {}), "Get curated resources", " ", _jsxs("span", { className: "relative text-amber-300", children: [_jsx("img", { src: ovalMarker, className: "absolute transform right-[-1px] top-[-20px] scale-[160%] " }), _jsx("span", { children: "instantly" })] })] }), _jsx("div", { className: "min-h-[300px] max-w-7xl mt-32 mb-16", children: _jsx(Dropzone, {}) })] }) }));
}
