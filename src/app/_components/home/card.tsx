import { cn } from "@lib/utils";
import styles from "@styles/card.module.css";
import Image from "next/image";
import type { ComponentProps, ReactNode } from "react";

export type CardProps = {
  title: string;
  description: string;
  icon: ReactNode;
  imageSrc: ComponentProps<typeof Image>["src"];
  wip?: boolean;
};

function Card({ title, description, icon, imageSrc, wip }: CardProps) {
  return (
    <li
      className={cn(
        styles.card,
        "before:gradient-radial-before after:gradient-radial-after before:z-[3] after:z-[1] group-hover:after:opacity-100",
      )}
    >
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.imageWrapper}>
            <Image
              src={imageSrc}
              alt={`${title} image`}
              width={320}
              height={160}
              className={styles.image}
              placeholder="blur"
            />
          </div>

          <div className={styles.contentWrapper}>
            {icon}
            <div>
              <h3 className="font-semibold">
                {title}
                {wip && (
                  <span className="ml-2 rounded-lg border border-neutral-600 px-[6px] text-xs">
                    WiP
                  </span>
                )}
              </h3>
              <h4 className="mt-2 text-sm font-medium text-gray-400">
                {description}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </li>
  );
}

export default Card;
