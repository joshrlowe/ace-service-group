"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PageAnimationsProps {
  children: React.ReactNode;
}

export function PageAnimations({ children }: PageAnimationsProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animation 1: Hero Section Entrance Animation
      const heroSection = containerRef.current?.querySelector(".hero-section");
      const heroText = heroSection?.querySelector(".hero-text");
      const heroSubtext = heroSection?.querySelector(".hero-subtext");

      if (heroText) {
        gsap.set([heroText, heroSubtext], {
          opacity: 0,
          y: 60,
        });

        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl.to(heroText, {
          opacity: 1,
          y: 0,
          duration: 1,
        });

        if (heroSubtext) {
          heroTl.to(
            heroSubtext,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
            },
            "-=0.7",
          );
        }
      }

      // Animation 2: Scroll-Triggered Section Animations
      const sections =
        containerRef.current?.querySelectorAll(".animate-section");

      sections?.forEach((section) => {
        const heading = section.querySelector("h2");
        const description = section.querySelector(".section-description");

        if (heading) {
          gsap.fromTo(
            heading,
            {
              opacity: 0,
              y: 50,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }

        if (description) {
          gsap.fromTo(
            description,
            {
              opacity: 0,
              y: 30,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none none",
              },
            },
          );
        }
      });

      // Animation 3: Staggered Card/Item Animations
      const animatedItems =
        containerRef.current?.querySelectorAll(".animate-item");

      if (animatedItems && animatedItems.length > 0) {
        gsap.fromTo(
          animatedItems,
          {
            opacity: 0,
            y: 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            stagger: {
              amount: 0.5,
              from: "start",
            },
            scrollTrigger: {
              trigger: animatedItems[0]?.parentElement,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Animation 4: Grid Item Animations (for project cards, service cards, etc.)
      const gridItems =
        containerRef.current?.querySelectorAll(".animate-grid-item");

      if (gridItems && gridItems.length > 0) {
        gsap.fromTo(
          gridItems,
          {
            opacity: 0,
            y: 80,
            scale: 0.9,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "back.out(1.2)",
            stagger: {
              amount: 0.6,
              from: "start",
            },
            scrollTrigger: {
              trigger: gridItems[0]?.parentElement,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
