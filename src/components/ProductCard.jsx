import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VanillaTilt from "vanilla-tilt";

gsap.registerPlugin(ScrollTrigger);

const ProductCard = ({ product, latest }) => {
  const navigate = useNavigate();
  const cardRef = useRef(null);
  const glowRef = useRef(null);

  // 1️⃣ Scroll animation entry
  useEffect(() => {
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 80, scale: 0.9 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, []);

  // 2️⃣ 3D tilt
  useEffect(() => {
    VanillaTilt.init(cardRef.current, {
      max: 20,
      speed: 400,
      glare: true,
      "max-glare": 0.3,
      scale: 1.05,
    });
  }, []);

  // 3️⃣ GSAP Hover Glow + Sparkle
  useEffect(() => {
    const card = cardRef.current;
    const glow = glowRef.current;

    const enter = () => {
      gsap.to(glow, { opacity: 1, scale: 1.2, duration: 0.6, ease: "power2.out" });
      gsap.to(card, { boxShadow: "0px 0px 40px rgba(100,150,255,0.5)", duration: 0.5 });
    };
    const leave = () => {
      gsap.to(glow, { opacity: 0, scale: 1, duration: 0.5 });
      gsap.to(card, { boxShadow: "0px 0px 0px rgba(0,0,0,0)", duration: 0.5 });
    };

    card.addEventListener("mouseenter", enter);
    card.addEventListener("mouseleave", leave);

    return () => {
      card.removeEventListener("mouseenter", enter);
      card.removeEventListener("mouseleave", leave);
    };
  }, []);

  return (
    <div ref={cardRef} className="relative group w-[320px]">
      <div
        ref={glowRef}
        className="absolute inset-0 bg-gradient-to-r from-indigo-500/40 via-purple-400/30 to-blue-400/40 rounded-3xl blur-2xl opacity-0 pointer-events-none transition-all duration-500"
      ></div>

      <div
        className="relative z-10 rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b 
        from-gray-900/70 to-gray-800/70 backdrop-blur-xl shadow-xl p-4 transition-all duration-700 cursor-pointer"
      >
        <Link to={`/product/${product._id}`}>
          <div className="relative h-[300px] bg-gray-950 flex justify-center items-center overflow-hidden rounded-xl">
            <img
              src={product.images[0].url}
              alt="Product"
              className="max-w-full max-h-full object-contain transition-transform duration-700 group-hover:scale-110"
            />
            {latest === "yes" && (
              <Badge className="absolute top-3 left-3 bg-green-500 text-white text-xs shadow-md">
                New
              </Badge>
            )}
            {/* Floating spark particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(5)].map((_, i) => (
                <span
                  key={i}
                  className="absolute w-2 h-2 bg-blue-400/60 rounded-full animate-ping"
                  style={{
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                ></span>
              ))}
            </div>
          </div>
        </Link>

        <div className="p-4 text-center">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-indigo-400 transition-colors">
            {product.title.slice(0, 35)}
          </h3>
          <p className="text-sm mt-1 text-gray-400 truncate">
            {product.about.slice(0, 35)}...
          </p>
          <p className="text-sm mt-1 font-medium text-indigo-400">
            ₹{product.price}
          </p>
          <div className="flex items-center justify-center mt-4">
            <Button
              className="transition-all duration-300 hover:scale-110 hover:shadow-[0_0_20px_rgba(120,160,255,0.5)]"
              onClick={() => navigate(`/product/${product._id}`)}
            >
              View Product
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
