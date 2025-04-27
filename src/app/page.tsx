import Banner from "~/components/home/Banner";
import { FAKE_CATEGORIES } from "~/data/category";
import Image from "next/image";
import { cn } from "~/lib/utils";
import Header from "~/components/layouts/Header";

export default async function Home() {
  const data = {
    landingImgs: [
      "/img/banner/banner-classy.jpg",
      "/img/banner/banner-mordern.jpg",
      "/img/banner/9787933.jpg",
      "/img/freepik__upload__1283.jpeg",
    ],
    categories: FAKE_CATEGORIES,
  };

  const { categories } = data;
  const sectionClass = "section-category w-full container px-8";

  return (
    <div id="homePage" className="home-page overflow-auto pt-16">
      <Header />
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start mt-4">
        <section
          id="banner"
          className={cn(
            sectionClass,
            "section-banner h-[80vh] flex w-full p-x-20 !max-w-full"
          )}
        >
          <Banner urls={data.landingImgs} />
        </section>

        <section
          id="category"
          className={cn(sectionClass, "section-category w-full")}
        >
          <h3 className="border-b mb-14 pb-2 border-foreground/20">Category</h3>
          <div className="grid grid-cols-4 gap-4 justify-center w-full">
            {categories
              .filter((e) => !e.parentId)
              .map((cgr) => {
                return (
                  <div
                    key={cgr._id}
                    className={cn(
                      "col-span-1 category-card rounded-lg p-4 w-full text-center rounded",
                      "border border-transparent hover:border-foreground/40 hover:border hover:cursor-pointer"
                    )}
                  >
                    <Image
                      src="/img/category/t_shirt.jpeg"
                      alt="/img/category/t_shirt.jpeg"
                      objectFit="cover"
                      width={160}
                      height={160}
                      className="m-auto"
                    />
                    <h5>{cgr.title}</h5>
                    <p>25 sản phẩm</p>
                  </div>
                );
              })}
          </div>
        </section>

        <section
          id="footer"
          className={cn(
            sectionClass,
            "w-full border-t text-center pb-4! py-4 !max-w-full text-background bg-foreground"
          )}
        >
          <h5>Liên hệ: hautrantrung.02@gmail.com</h5>
        </section>
      </main>
    </div>
  );
}
