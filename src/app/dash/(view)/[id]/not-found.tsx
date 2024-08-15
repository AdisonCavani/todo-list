import Graphics from "@images/not_found.svg";
import Image from "next/image";

function NotFound() {
  return (
    <section className="hidden w-full grow flex-col items-center justify-center gap-y-10 px-3 pb-24 pt-8 sm:px-6 sm:pb-8 lg:flex">
      <Image src={Graphics} alt="Infographics" width={300} />

      <div className="max-w-64 space-y-2 text-center text-sm">
        <p className="font-semibold">Hmmm... Page not found!</p>
        <p className="text-muted-foreground">
          Sorry, we couldn&apos;t find the page you&apos;re looking for.
        </p>
      </div>
    </section>
  );
}

export default NotFound;
