"use client";

import { useState } from "react";
import { StepsSection } from "@/types/content";

function TimelineCard({
  step,
  isFirst,
}: {
  step: StepsSection["steps"][0];
  isFirst: boolean;
}) {
  const [hovered, setHovered] = useState(false);
  const active = isFirst || hovered;

  return (
    <div
      onMouseEnter={() => !isFirst && setHovered(true)}
      onMouseLeave={() => !isFirst && setHovered(false)}
      className="p-5 rounded-lg shadow-sm"
      style={{
        backgroundColor: active ? "var(--color-accent)" : "var(--color-bg)",
        border: "1px solid var(--color-accent)",
        transition: "background-color 0.2s ease, box-shadow 0.2s ease",
        boxShadow: hovered ? "0 4px 20px rgba(0,0,0,0.12)" : undefined,
        cursor: isFirst ? "default" : "pointer",
      }}
    >
      <h3
        className="text-lg font-semibold mb-2"
        style={{
          fontFamily: "var(--font-heading)",
          color: "var(--color-primary)",
        }}
      >
        {step.title}
      </h3>
      <p
        className="text-sm leading-relaxed"
        style={{
          fontFamily: "var(--font-body)",
          color: "var(--color-primary)",
          opacity: active ? 0.7 : 0.6,
          transition: "opacity 0.2s ease",
        }}
      >
        {step.description}
      </p>
    </div>
  );
}

export default function StepsTimeline({ data }: { data: StepsSection }) {
  const scrollToContact = () => {
    if (typeof document !== "undefined") {
      document
        .getElementById("contact")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      className="py-16 md:py-24 px-6"
      style={{ color: "var(--color-text)" }}
    >
      <div className="max-w-4xl mx-auto">
        {(data.headline || data.headlineAccent) && (
          <h2
            className="text-3xl sm:text-4xl font-bold text-center mb-3"
            style={{
              fontFamily: "var(--font-heading)",
              color: "var(--color-primary)",
            }}
          >
            {data.headline && <span>{data.headline} </span>}
            {data.headlineAccent && (
              <span style={{ color: "var(--color-accent)" }}>
                {data.headlineAccent}
              </span>
            )}
          </h2>
        )}
        {(data.headline || data.headlineAccent) && (
          <div
            className="mb-12 w-12 h-[3px] mx-auto"
            style={{ backgroundColor: "var(--color-accent)" }}
          />
        )}

        <div className="relative">
          {/* Vertical center line */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
            style={{ backgroundColor: "var(--color-accent)" }}
          />

          <div className="space-y-10 md:space-y-0">
            {data.steps.map((step, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={i}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-0 ${
                    isLeft ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Card */}
                  <div
                    className={`md:w-[calc(50%-2rem)] ${
                      isLeft ? "md:pr-8 md:text-right" : "md:pl-8"
                    }`}
                  >
                    <TimelineCard step={step} isFirst={i === 0} />
                  </div>

                  {/* Center circle */}
                  <div
                    className="md:absolute md:left-1/2 md:-translate-x-1/2 w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm z-10 flex-shrink-0"
                    style={{
                      backgroundColor: "var(--color-accent)",
                      color: "var(--color-primary)",
                      fontFamily: "var(--font-heading)",
                    }}
                  >
                    {i + 1}
                  </div>

                  {/* Empty spacer for the other side on desktop */}
                  <div className="hidden md:block md:w-[calc(50%-2rem)]" />
                </div>
              );
            })}
          </div>
        </div>

        {data.ctaType === "phone" && data.ctaPhone && (
          <div className="mt-12 text-center">
            <a
              href={`tel:${data.ctaPhone}`}
              className="px-8 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {data.ctaText || "Call me"}
            </a>
          </div>
        )}
        {data.ctaType === "button" && (
          <div className="mt-12 text-center">
            <button
              onClick={scrollToContact}
              className="px-8 py-4 text-lg font-bold rounded-md transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--color-accent)",
                color: "var(--color-primary)",
                fontFamily: "var(--font-body)",
              }}
            >
              {data.ctaText || "Get Started"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
