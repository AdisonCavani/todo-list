import Link from "@components/router/link";
import { isUrlInternal } from "@lib/helpers";
import type { MenuEntry } from "@lib/types";
import type { LangDictionary } from "dictionaries";
import { Fragment } from "react";

type Props = {
  locale: LangDictionary;
};

function Footer({ locale }: Props) {
  const menuEntries: MenuEntry[] = [
    { name: locale.home.header.privacy, href: "/privacy" },
    { name: locale.home.header.tos, href: "/terms-of-service" },
  ];

  const entries: MenuEntry[] = [
    { name: locale.home.footer.analytics, href: "https://analytics.k1ng.dev" },
    { name: locale.home.footer.health, href: "/health" },
    ...menuEntries,
  ];

  return (
    <footer className="border-t py-10">
      <p className="px-8 text-sm leading-6 sm:px-0 sm:text-center">
        © {new Date().getUTCFullYear()} Adrian Środoń.{" "}
        {locale.home.footer.copyright}.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-y-2 px-8 text-sm font-semibold leading-6 text-muted-foreground sm:flex-row sm:items-center sm:space-x-4 sm:px-0">
        {entries.map(({ name, href }, index) => (
          <Fragment key={index}>
            {isUrlInternal(href) ? (
              <>
                <Link href={href} prefetch={false}>
                  {name}
                </Link>
                <Divider length={entries.length} index={index} />
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
                <Divider length={entries.length} index={index} />
              </>
            )}
          </Fragment>
        ))}
      </div>
    </footer>
  );
}

function Divider({ length, index }: { length: number; index: number }) {
  return (
    <>
      {index !== length - 1 && (
        <hr className="hidden h-4 w-px border-0 bg-muted sm:block" />
      )}
    </>
  );
}

export default Footer;
