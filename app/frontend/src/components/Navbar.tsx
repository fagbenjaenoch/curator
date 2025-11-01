import { Button } from "@/components/ui/Button";
import Github from "@/components/ui/Github";

export default function Navbar() {
  return (
    <div className="p-4 px-8 lg:p-8 bg-amber-300 text-black font-extrabold">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="lg:text-lg">Curator.</span>
        <div>
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
