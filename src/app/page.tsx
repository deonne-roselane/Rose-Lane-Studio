import About from "@/components/About";
import Customer from "@/components/Customer";
import Cta from "@/components/Cta";
import Engagements from "@/components/Engagements";
import GridOverlay from "@/components/GridOverlay";
import Header from "@/components/Header";
import Nav from "@/components/Nav";

/** Set to true to show the 12-column alignment grid overlay */
const SHOW_GRID_OVERLAY = false;

export default function Home() {
  return (
    <>
      {SHOW_GRID_OVERLAY && <GridOverlay />}

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
