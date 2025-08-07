import Navbar from "@/components/Navbar";
import ovalMarker from "@/assets/oval marker.svg";
import Dropzone from "@/components/Dropzone";

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
        <div className=" max-w-7x">
          <Dropzone />
        </div>
      </section>
      <footer>
        <div className="max-w-7xl mx-auto  py-16">
          <div className="flex justify-between">
            <small>Built with a step out of comfort</small>
            <small>Github X</small>
          </div>
          <small className="inline-block w-full text-center mt-4 text-muted-foreground">
            Enoch Fagbenja
          </small>
        </div>
      </footer>
    </div>
  );
}
