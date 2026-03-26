'use client';

import { useEffect, useRef, useState } from 'react';
import './page.scss';

export default function HomePage() {
  const particleContainer = useRef<HTMLDivElement>(null);
  const [particleContainerDimensions, setParticleContainerDimensions] =
    useState({
      width: 0,
      height: 0,
    });

  useEffect(() => {
    if (!particleContainer.current) return;

    const handleResize = () => {
      if (!particleContainer.current) return;

      const { width, height } =
        particleContainer.current.getBoundingClientRect();
      const style = getComputedStyle(particleContainer.current);
      const paddingX =
        parseFloat(style.paddingLeft) + parseFloat(style.paddingRight);
      const paddingY =
        parseFloat(style.paddingTop) + parseFloat(style.paddingBottom);

      setParticleContainerDimensions({
        width: width - paddingX,
        height: height - paddingY,
      });
    };

    handleResize(); // Initial size

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [particleContainer]);

  const hasDimensions =
    particleContainerDimensions.width > 0 &&
    particleContainerDimensions.height > 0;

  return (
    <main className="container h-svh">
      <div className="row h-full">
        <section className="col-5 flex flex-col justify-center gap-20">
          <div className="grid gap-5">
            <h1 className="text-4xl">
              Hello! <strong>I’m Sebastián,</strong>
            </h1>

            <p className="text-xl">
              I really enjoy creating visually captivating projects that adhere
              to rigorous standards of performance, accessibility, and coding
              best practices.
            </p>
          </div>

          <ul>
            <li>
              <a href="https://www.linkedin.com/in/sebbz/" target="_blank">
                Linkedin
              </a>
            </li>
            <li>
              <a href="https://x.com/sebbz__" target="_blank">
                Twitter
              </a>
            </li>
            <li>
              <a href="mailto:sebastian.1546@gmail.com">Email</a>
            </li>
          </ul>
        </section>

        <section ref={particleContainer} className="col-7 container-particle">
          {/* Particle Feature */}
        </section>
      </div>
    </main>
  );
}
