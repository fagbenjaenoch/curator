import Navbar from "@/components/Navbar";
import ovalMarker from "@/assets/oval marker.svg";
import Dropzone from "@/components/Dropzone";
import Github from "@/components/ui/Github";
import X from "@/components/ui/X";
import StatusIndicator from "@/components/StatusIndicator";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <section className="mt-[100px] px-4 max-w-7xl mx-auto text-center">
        <h1>
          Need help with your document?
          <br />
          Get curated resources{" "}
          <span className="relative text-amber-300">
            <img
              src={ovalMarker}
              className="absolute transform right-[-1px] top-[-20px] scale-[160%] "
            />
            <span>instantly</span>
          </span>
        </h1>
        <div className="min-h-[300px] max-w-7xl mt-32 mb-16">
          <Dropzone />
        </div>
      </section>
      <footer>
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex justify-between">
            <div className="space-y-2">
              <small className="block">Built with a step out of comfort</small>
              <p className="text-xs text-green-500 bg-green-100 border-2 border-green-500 w-max p-1 px-2 rounded-full inline-flex items-center gap-1">
                <StatusIndicator />
                <span>Available for hire</span>
              </p>
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
    </div>
  );
}
