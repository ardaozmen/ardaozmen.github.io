import Background from "@/components/Background";
import Manifesto from "@/components/Manifesto";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="relative flex h-dvh w-full items-center justify-center overflow-hidden px-6">
      <Background />
      <div className="relative z-10 flex w-full justify-center">
        <Manifesto />
      </div>
      <Footer />
    </main>
  );
}
