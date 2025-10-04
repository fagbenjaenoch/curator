import ovalMarker from "@/assets/oval marker.svg";
import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";
export default function Landing() {
  return (
    <Layout>
      <section className="mt-[100px] px-4 max-w-7xl mx-auto text-center">
        <h1>
          Find curated resources for your document{" "}
          <span className="relative text-amber-300">
            <img
              src={ovalMarker}
              className="absolute transform right-[-1px] top-[0px] scale-[220%] "
            />
            <span>fast</span>
          </span>
        </h1>
        <div className="min-h-[300px] max-w-7xl mt-32 mb-16">
          <Dropzone />
        </div>
      </section>
    </Layout>
  );
}
