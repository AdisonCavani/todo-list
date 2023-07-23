import Cards from "@components/home/cards";
import { HomePageData } from "@lib/data";
import { cn } from "@lib/utils";

export const metadata = {
  title: "Home",
};

const gradients = {
  yellowToTeal: "from-yellow-400 to-teal-400",
  purpleToTeal: "from-purple-400 to-teal-400",
};

function Page() {
  return (
    <main>
      {HomePageData.map(({ id, title, summary, gradient, items }) => (
        <section key={id} className="mx-auto my-14 max-w-5xl px-8">
          <div className="mx-auto mb-12 max-w-2xl space-y-6">
            <h2
              id={id}
              className="before:invisible before:-mt-16 before:block before:h-16"
            >
              <a
                href={`#${id}`}
                className={cn(
                  "bg-gradient-to-r bg-clip-text text-3xl font-bold text-transparent sm:text-5xl",
                  gradients[gradient],
                )}
              >
                {title}
              </a>
            </h2>

            <p className="text-lg text-slate-300">{summary}</p>
          </div>

          <Cards id={id} gradient={gradient} items={items} />
        </section>
      ))}
    </main>
  );
}

export default Page;
