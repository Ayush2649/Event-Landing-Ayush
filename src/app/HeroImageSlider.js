"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";

const images = [
  "/product-preview.png",
  "/product-preview1.png",
  "/product-preview2.png",
  "/product-preview3.png",
];

export default function HeroImageSlider() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroImage}>
      {images.map((src, i) => (
        <img
          key={src}
          src={src}
          alt="Eventify Dashboard Preview"
          className={`${styles.heroSlide} ${
            i === index ? styles.active : ""
          }`}
        />
      ))}
    </div>
  );
}
