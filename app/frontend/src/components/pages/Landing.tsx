import ovalMarker from "@/assets/oval marker.svg";
import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";
export default function Landing() {
  return (
    <Layout>
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
    </Layout>
  );
}
