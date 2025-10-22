import Github from "@/components/ui/Github";
import StatusIndicator from "@/components/ui/StatusIndicator";
import X from "@/components/ui/X";

export default function Footer() {
  return (
    <footer>
      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="flex justify-between">
          <div className="space-y-2">
            <small className="block">Built with a step out of comfort</small>
            <div className="text-xs text-green-500 bg-green-100 border-1 border-green-500 w-max p-1 px-2 rounded-full inline-flex items-center gap-1 lg:font-black">
              <StatusIndicator />
              <p>Open to work</p>
            </div>
          </div>
          <div className="space-x-4 text-xs">
            <a
              href="http://github.com/fagbenjaenoch"
              className="hover:text-muted-foreground"
            >
              <Github className="inline-block hover:text-muted-foreground" />
            </a>
            <a
              href="http://x.com/fagbenjaenoch"
              className="hover:text-muted-foreground"
            >
              <X className="inline-block" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
