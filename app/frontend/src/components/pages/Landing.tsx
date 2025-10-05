import ovalMarker from "@/assets/oval marker.svg";
import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";
export default function Landing() {
  return (
    <Layout>
      <section className="mt-[100px] px-4 max-w-7xl mx-auto text-center">
        <h1>
          Find keywords that help you find resources for your document{" "}
          <span className="relative text-amber-300">
            <img
              src={ovalMarker}
              className="absolute transform right-[-10px] top-[-10px] scale-[200%] "
            />
            <span>better</span>
          </span>
        </h1>
        <div className="min-h-[300px] max-w-7xl mt-32 mb-16">
          <Dropzone />
        </div>
      </section>
    </Layout>
  );
}
