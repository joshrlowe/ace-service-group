"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AnimatedHomepageProps {
  children: React.ReactNode;
}

export function AnimatedHomepage({ children }: AnimatedHomepageProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // Animation 1: Hero Section Entrance Animation
      const heroSection = containerRef.current?.querySelector(".hero-section");
      const heroText = heroSection?.querySelector(".hero-text");
      const heroSubtext = heroSection?.querySelector(".hero-subtext");
      const heroButtons = heroSection?.querySelector(".hero-buttons");
      const heroLogo = heroSection?.querySelector(".hero-logo");

      if (heroText && heroSubtext && heroButtons) {
        gsap.set([heroText, heroSubtext, heroButtons, heroLogo], {
          opacity: 0,
          y: 60,
        });

        const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
        heroTl
          .to(heroText, {
            opacity: 1,
            y: 0,
            duration: 1,
          })
          .to(
            heroSubtext,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
            },
            "-=0.7",
          )
          .to(
            heroButtons,
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
            },
            "-=0.5",
          );

        if (heroLogo) {
          heroTl.to(
            heroLogo,
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1.2,
              ease: "elastic.out(1, 0.5)",
            },
            "-=0.8",
          );
        }
      }

      // Animation 2: Scroll-Triggered Section Animations (fade in on scroll)
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

      // Animation 3: Staggered Service Cards Animation
      const serviceCards =
        containerRef.current?.querySelectorAll(".service-card");

      if (serviceCards && serviceCards.length > 0) {
        gsap.fromTo(
          serviceCards,
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
              trigger: serviceCards[0]?.parentElement,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          },
        );
      }

      // Animation 4: Parallax Effect on Hero Logo - REMOVED
      // This was causing the 3D cards to move when scrolling
      // const heroLogoContainer = heroSection?.querySelector(".hero-logo");
      // if (heroLogoContainer && heroSection) {
      //   gsap.to(heroLogoContainer, {
      //     y: -150,
      //     ease: "none",
      //     scrollTrigger: {
      //       trigger: heroSection,
      //       start: "top top",
      //       end: "bottom top",
      //       scrub: 1.5,
      //     },
      //   });
      // }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}
