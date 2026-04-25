"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

type DeviceType = "macbook" | "iphone";

interface Project {
  name: string;
  label: string;
  category: string;
  device: DeviceType;
  screenshot: string;
  url: string;
}

const projects: Project[] = [
  {
    name: "LuxStay Bali",
    label: "Luxury Villa Rental Platform",
    category: "Hospitality",
    device: "macbook",
    screenshot: "/portfolio/luxstay.jpg",
    url: "https://luxstay-demo-seven.vercel.app",
  },
  {
    name: "UrbanThreads",
    label: "Streetwear E-Commerce Store",
    category: "E-Commerce",
    device: "macbook",
    screenshot: "/portfolio/urbanthreads.jpg",
    url: "https://urbanthreads-demo.vercel.app",
  },
  {
    name: "FlowMetrics",
    label: "SaaS Analytics Dashboard",
    category: "SaaS",
    device: "macbook",
    screenshot: "/portfolio/flowmetrics.jpg",
    url: "https://flowmetrics-demo-three.vercel.app",
  },
  {
    name: "MindSpace",
    label: "Wellness & Meditation App",
    category: "Mobile App",
    device: "iphone",
    screenshot: "/portfolio/mindspace.jpg",
    url: "https://mindspace-demo.vercel.app",
  },
  {
    name: "Aureveil",
    label: "Luxury Watch Brand Showcase",
    category: "Luxury",
    device: "macbook",
    screenshot: "/portfolio/aureveil.jpg",
    url: "https://aureveil-demo.vercel.app",
  },
];

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
  center: { x: "0%", opacity: 1, transition: { duration: 0.55, ease: "easeOut" as const } },
  exit: (dir: number) => ({
    x: dir > 0 ? "-100%" : "100%",
    opacity: 0,
    transition: { duration: 0.4, ease: "easeOut" as const },
  }),
};

function MacBookMockup({ screenshot, alt }: { screenshot: string; alt: string }) {
  return (
    <div className="max-w-6xl mx-auto px-6" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div
        style={{
          width: "clamp(260px, 52vw, 540px)",
          backgroundColor: "var(--mockup-chassis)",
          borderRadius: "10px 10px 0 0",
          border: "2px solid var(--mockup-chassis-border)",
          padding: "8px 8px 4px 8px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "5px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "5px",
            height: "5px",
            borderRadius: "50%",
            backgroundColor: "var(--mockup-chassis-detail)",
          }}
        />
        <div
          style={{
            width: "100%",
            paddingBottom: "62.5%",
            position: "relative",
            backgroundColor: "var(--mockup-screen-empty)",
            borderRadius: "4px",
            overflow: "hidden",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshot}
            alt={alt}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "contain",
              display: "block",
            }}
          />
        </div>
      </div>
      <div
        style={{
          width: "clamp(260px, 52vw, 540px)",
          height: "3px",
          backgroundColor: "var(--mockup-chassis-border)",
          borderLeft: "2px solid #333",
          borderRight: "2px solid #333",
        }}
      />
      <div
        style={{
          width: "clamp(280px, 55vw, 570px)",
          height: "12px",
          backgroundColor: "var(--mockup-chassis)",
          borderRadius: "0 0 6px 6px",
          border: "2px solid var(--mockup-chassis-border)",
          borderTop: "none",
          clipPath: "polygon(1.5% 0%, 98.5% 0%, 100% 100%, 0% 100%)",
        }}
      />
    </div>
  );
}

function IPhoneMockup({ screenshot, alt }: { screenshot: string; alt: string }) {
  return (
    <div
      style={{
        width: "clamp(140px, 20vw, 200px)",
        backgroundColor: "var(--mockup-chassis)",
        borderRadius: "36px",
        border: "2px solid var(--mockup-chassis-border)",
        padding: "20px 10px",
        position: "relative",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "56px",
          height: "14px",
          backgroundColor: "var(--mockup-screen-empty)",
          borderRadius: "8px",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          left: "50%",
          transform: "translateX(-50%)",
          width: "36px",
          height: "4px",
          backgroundColor: "var(--mockup-chassis-detail)",
          borderRadius: "2px",
        }}
      />
      <div
        style={{
          width: "100%",
          paddingBottom: "177%",
          position: "relative",
          backgroundColor: "var(--mockup-screen-empty)",
          borderRadius: "26px",
          overflow: "hidden",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshot}
          alt={alt}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "contain",
            display: "block",
          }}
        />
      </div>
    </div>
  );
}

export default function Portfolio() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const [hovered, setHovered] = useState(false);

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir);
    setCurrent((index + projects.length) % projects.length);
  }, []);

  const next = useCallback(() => goTo(current + 1, 1), [current, goTo]);
  const prev = useCallback(() => goTo(current - 1, -1), [current, goTo]);

  useEffect(() => {
    if (hovered) return;
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next, hovered]);

  const project = projects[current];

  return (
    <section
      id="portfolio"
      style={{
        backgroundColor: "var(--bg-alt)",
        paddingBlock: "8rem",
        paddingInline: "2rem",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{ textAlign: "center", marginBottom: "4rem" }}
        >
          <p
            style={{
              fontSize: "0.72rem",
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              color: "var(--accent)",
              marginBottom: "0.75rem",
            }}
          >
            Recent Work
          </p>
          <h2
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "var(--text)",
              letterSpacing: "-0.02em",
              marginBottom: "0.75rem",
            }}
          >
            Real Builds. Real Results.
          </h2>
        </motion.div>

        {/* Slideshow */}
        <div
          style={{ position: "relative", display: "flex", justifyContent: "center" }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div
            style={{
              position: "relative",
              width: "min(85vw, 680px)",
              overflow: "hidden",
              minHeight: "480px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <AnimatePresence mode="popLayout" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "1.5rem",
                  paddingBottom: "1rem",
                }}
              >
                {project.device === "macbook" ? (
                  <MacBookMockup screenshot={project.screenshot} alt={project.name} />
                ) : (
                  <IPhoneMockup screenshot={project.screenshot} alt={project.name} />
                )}

                <div style={{ textAlign: "center" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "9999px",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      letterSpacing: "0.12em",
                      textTransform: "uppercase",
                      backgroundColor: "rgba(0,212,255,0.1)",
                      border: "1px solid rgba(0,212,255,0.3)",
                      color: "var(--accent)",
                      marginBottom: "0.6rem",
                    }}
                  >
                    {project.category}
                  </span>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 800,
                      color: "var(--text)",
                      lineHeight: 1.2,
                      marginBottom: "0.3rem",
                    }}
                  >
                    {project.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.88rem",
                      color: "var(--text-muted)",
                      marginBottom: "0.9rem",
                    }}
                  >
                    {project.label}
                  </div>
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "10px 20px",
                      border: "1px solid var(--accent)",
                      borderRadius: "6px",
                      color: "var(--accent)",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                      textDecoration: "none",
                      backgroundColor: "rgba(0,212,255,0.06)",
                      transition: "background 0.2s ease",
                    }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                        "rgba(0,212,255,0.15)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.backgroundColor =
                        "rgba(0,212,255,0.06)")
                    }
                  >
                    View →
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Arrows */}
          {(["prev", "next"] as const).map((dir) => (
            <button
              key={dir}
              onClick={dir === "prev" ? prev : next}
              aria-label={dir === "prev" ? "Previous" : "Next"}
              style={{
                position: "absolute",
                [dir === "prev" ? "left" : "right"]: 0,
                top: "40%",
                transform: "translateY(-50%)",
                width: "44px",
                height: "44px",
                borderRadius: "50%",
                border: "1px solid var(--arrow-border)",
                backgroundColor: "var(--arrow-bg)",
                backdropFilter: "blur(12px)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "var(--text)",
                zIndex: 10,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--accent)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(0,212,255,0.1)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--arrow-border)";
                (e.currentTarget as HTMLButtonElement).style.backgroundColor = "var(--arrow-bg)";
              }}
            >
              {dir === "prev" ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
            </button>
          ))}
        </div>

        {/* Dots */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "0.5rem",
            marginTop: "2rem",
          }}
        >
          {projects.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i, i > current ? 1 : -1)}
              aria-label={`Go to project ${i + 1}`}
              style={{
                width: i === current ? "24px" : "8px",
                height: "8px",
                borderRadius: "9999px",
                border: "none",
                cursor: "pointer",
                backgroundColor: i === current ? "var(--accent)" : "var(--text-faint)",
                transition: "all 0.3s ease",
                padding: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
