import Navbar from "@/components/Navbar";

export default function Landing() {
  return (
    <div>
      <Navbar />
      <section className="m-auto mt-[200px] px-4 max-w-7xl mx-auto text-center">
        <h1>
          <span className="block">Need help with your document?</span>
          <span className="transform scale-70 text-center">
            Get curated resources instantly
          </span>
        </h1>
        <div></div>
      </section>
    </div>
  );
}
