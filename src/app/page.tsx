import About from "@/components/About";
import Customer from "@/components/Customer";
import Cta from "@/components/Cta";
import Engagements from "@/components/Engagements";
import Header from "@/components/Header";
import Nav from "@/components/Nav";

/** Set to true to show the 12-column alignment grid overlay */
const SHOW_GRID_OVERLAY = false;

export default function Home() {
  return (
    <>
      {SHOW_GRID_OVERLAY && (
        <div
          className="pointer-events-none fixed inset-0 z-[9999] flex justify-center px-4 sm:px-6"
          aria-hidden="true"
        >
          <div className="mx-auto grid h-full w-full max-w-site grid-cols-4 gap-4 sm:grid-cols-8 sm:gap-6 lg:grid-cols-12">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className={[
                  "bg-red-500/10",
                  i >= 4 && i < 8 && "hidden sm:block",
                  i >= 8 && "hidden lg:block",
                ]
                  .filter(Boolean)
                  .join(" ")}
              />
            ))}
          </div>
        </div>
      )}

      <Nav />
      <main className="w-full">
        <Header />
        <About />
        <Customer />
        <Engagements />
        <Cta />
      </main>
    </>
  );
}
