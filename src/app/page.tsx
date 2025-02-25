import { Search, ShoppingBag } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import Image from "next/image";
import { Card } from "~/components/ui/card";
import "./page.scss";

export default function Home() {
  const data = {
    landingImgs: [
      "/img/409887763_369408025613358_2664442766672702811_n.jpg",
      "/img/426545516_402190502335110_6131758045816123032_n.jpg",
      "/img/435516940_436443415576485_7457421840932232507_n.jpg",
      "/img/426545516_402190502335110_6131758045816123032_n.jpg",
      "/img/435671033_437384438815716_2304331996105511578_n.jpg",
      "/img/454847799_508972181656941_3504975550377581801_n.jpg",
    ],
  };
  return (
    <div id="homePage" className="home-page h-screen overflow-auto">
      <header
        id="homeHeader"
        className="flex justify-between items-center sticky top-0 h-20 px-16 border-b"
      >
        <div className="header-branch">
          <h4 className="font-bold">Hautrank2</h4>
        </div>
        <div className="header-search w-[60%] px-16">
          <div className="flex items-center space-x-4">
            <Input />
            <Search />
          </div>
        </div>
        <div className="header-extra">
          <Button size={"icon"} variant={"ghost"}>
            <ShoppingBag />
          </Button>
        </div>
      </header>
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start my-8">
        <section className="section-landing h-[80vh] flex w-full">
          {data.landingImgs.map((imgUrl, index) => {
            return (
              <div key={imgUrl + index} className="h-100 w-100 relative">
                <Image src={imgUrl} alt={imgUrl} width={400} height={400} />
              </div>
            );
          })}
        </section>
        <section className="section-category"></section>
      </main>
      <footer className="fixed py-2 inset-x-0 bottom-0 row-start-3 flex gap-6 flex-wrap items-center justify-center">
        Hautrank2
      </footer>
    </div>
  );
}
