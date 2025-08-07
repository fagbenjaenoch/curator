import { Button } from "@/components/ui/button";

export default function Navbar() {
  return (
    <div className="p-8 bg-amber-300 text-black">
      <div className="max-w-7xl mx-auto flex justify-between">
        <span className="text-lg">Curator.</span>
        <div className="flex gap-2">
          <Button className="cursor-pointer">Get started for free</Button>
        </div>
      </div>
    </div>
  );
}
