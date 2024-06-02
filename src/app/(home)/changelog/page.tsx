import Changelog from "./changelog.mdx";

function Page() {
  return (
    <main className="prose mx-auto my-14 max-w-5xl px-8 dark:prose-invert">
      <h1>Changelog</h1>
      <p>
        New updates and improvements. All notable changes to this project will
        be documented here.
      </p>

      <Changelog />
    </main>
  );
}

export default Page;
