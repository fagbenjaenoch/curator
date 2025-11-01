import { InfoIcon } from "lucide-react";

export default function Disclaimer() {
  return (
    <div className="border border-amber-500 text-amber-500 bg-amber-100 rounded-md p-4 max-w-[50rem] mx-auto flex gap-4">
      <InfoIcon size={20} className="shrink-0" />
      <p className="text-left">
        Please note: This app is under active development. The results may not
        be accurate but will improve over time as we refine the system. For best
        experience upload a file less than 100KB.
      </p>
    </div>
  );
}
