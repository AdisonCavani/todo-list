import Graphics from "@images/select_list.svg";
import Image from "next/image";

function Page() {
  return (
    <section className="hidden w-full grow flex-col items-center justify-center gap-y-10 px-3 pb-24 pt-8 sm:px-6 sm:pb-8 lg:flex">
      <Image src={Graphics} alt="Infographics" width={300} />

      <div className="max-w-64 space-y-2 text-center text-sm">
        <p className="font-semibold">Hmmm... Where are my tasks?</p>
        <p className="text-muted-foreground">
          In order to view your tasks, you need to create or select existing
          list.
          <br />
          Use the sidebar on the left.
        </p>
      </div>
    </section>
  );
}

export default Page;
