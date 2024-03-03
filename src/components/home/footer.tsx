import Link from "@components/router/link";
import { MenuEntries, type MenuEntry } from "@lib/data";
import { isUrlInternal } from "@lib/utils";
import { Fragment } from "react";

const FooterEntries: MenuEntry[] = [
  { name: "Analytics", href: "https://insights.k1ng.dev" },
  ...MenuEntries,
];

function Footer() {
  return (
    <footer className="border-t py-10">
      <p className="px-8 text-sm leading-6 sm:px-0 sm:text-center">
        © {new Date().getUTCFullYear()} Adrian Środoń. All rights reserved.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-y-2 px-8 text-sm font-semibold leading-6 text-muted-foreground sm:flex-row sm:items-center sm:space-x-4 sm:px-0">
        {FooterEntries.map(({ name, href }, index) => (
          <Fragment key={index}>
            {isUrlInternal(href) ? (
              <>
                <Link href={href} prefetch={false}>
                  {name}
                </Link>
                <Divider index={index} />
              </>
            ) : (
              <>
                <a
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:underline"
                >
                  {name}
                </a>
                <Divider index={index} />
              </>
            )}
          </Fragment>
        ))}
      </div>
    </footer>
  );
}

function Divider({ index }: { index: number }) {
  return (
    <>
      {index !== FooterEntries.length - 1 && (
        <hr className="hidden h-4 w-px border-0 bg-muted sm:block" />
      )}
    </>
  );
}

export default Footer;
