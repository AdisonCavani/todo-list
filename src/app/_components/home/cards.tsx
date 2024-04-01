"use client";

import { cn } from "@lib/utils";
import type { MouseEventHandler } from "react";
import Card, { type CardProps } from "./card";

type Props = {
  id: string;
  gradient: keyof typeof gradients;
  items: CardProps[];
};

const gradients = {
  yellowToTeal: "before:gradient-radial-overlay",
  purpleToTeal: "before:gradient-radial-overlay2",
};

function Cards({ id, gradient, items }: Props) {
  const newId = `${id}-cards`;

  const handleOnMouseMove: MouseEventHandler<HTMLUListElement> = (event) => {
    const cards = document.getElementById(newId)
      ?.children as HTMLCollectionOf<HTMLLIElement>;

    for (const card of cards) {
      const rect = card.getBoundingClientRect(),
        x = event.clientX - rect.left,
        y = event.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    }
  };

  return (
    <div className="relative overflow-hidden">
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-50 select-none overflow-visible",
          "before:absolute before:left-1/2 before:top-1/2 before:h-screen before:w-[calc(100vw-50px)] before:-translate-x-1/2 before:-translate-y-1/2 before:opacity-[0.03] before:blur-3xl",
          gradients[gradient],
        )}
      />
      <ul
        id={newId}
        onMouseMove={handleOnMouseMove}
        className="group grid grid-cols-1 gap-2 rounded-xl sm:grid-cols-2 lg:grid-cols-3"
      >
        {items.map((props, index) => (
          <Card key={index} {...props} />
        ))}
      </ul>
    </div>
  );
}

export default Cards;
