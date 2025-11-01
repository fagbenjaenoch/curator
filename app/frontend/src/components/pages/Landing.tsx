import Dropzone from "@/components/Dropzone";
import Layout from "@/components/Layout";
export default function Landing() {
  return (
    <Layout>
      <section className="mt-[100px] px-8 max-w-7xl mx-auto text-center">
        <h1>
          Find the keywords that lead you to the best resources for your
          document
        </h1>
        <div className="min-h-[300px] mt-32 mb-16">
          <Dropzone />
        </div>
      </section>
    </Layout>
  );
}
