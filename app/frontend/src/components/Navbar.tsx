import { Button } from "@/components/ui/Button";
import Github from "@/components/ui/Github";

export default function Navbar() {
  return (
    <div className="p-4 md:p-8 bg-amber-300 text-black font-extrabold">
      <div className="max-w-7xl mx-auto flex justify-between">
        <span className="text-lg">Curator.</span>
        <div className="flex gap-2">
          <Button className="cursor-pointer font-extrabold" asChild>
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
