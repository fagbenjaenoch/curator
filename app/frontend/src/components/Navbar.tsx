import { Button } from "@/components/ui/button";
import Github from "@/components/ui/Github";

export default function Navbar() {
  return (
    <div className="p-8 bg-amber-300 text-black">
      <div className="max-w-7xl mx-auto flex justify-between">
        <span className="text-lg">Curator.</span>
        <div className="flex gap-2">
          <Button className="cursor-pointer" asChild>
            <a href="https://github.com/fagbenjaenoch/curator">
              <Github />
              Contribute
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
