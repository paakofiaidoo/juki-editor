import React, { useEffect, useRef } from 'react';
import { motion, useAnimation, useMotionValue, useSpring, useTransform } from 'framer-motion';

export const InteractiveBackground = () => {
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const springConfig = { damping: 25, stiffness: 700 };
    const springX = useSpring(mouseX, springConfig);
    const springY = useSpring(mouseY, springConfig);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            mouseX.set(e.clientX);
            mouseY.set(e.clientY);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [mouseX, mouseY]);

    // Create a grid of dots
    const rows = 20;
    const cols = 20;
    const dots = [];

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            dots.push({ id: `${i}-${j}`, x: j, y: i });
        }
    }

    return (
        <div className="absolute inset-0 -z-10 overflow-hidden bg-background">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px]" />

            {/* Interactive Gradient Blob */}
            <motion.div
                style={{
                    x: springX,
                    y: springY,
                    translateX: '-50%',
                    translateY: '-50%',
                }}
                className="absolute h-[500px] w-[500px] rounded-full bg-primary/20 blur-[120px]"
            />

            {/* Floating Particles */}
            {dots.map((dot) => (
                <Particle key={dot.id} />
            ))}
        </div>
    );
};

const Particle = () => {
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    const duration = Math.random() * 20 + 10;

    return (
        <motion.div
            className="absolute h-1 w-1 rounded-full bg-primary/30"
            initial={{ x: `${randomX}vw`, y: `${randomY}vh`, opacity: 0 }}
            animate={{
                x: [`${randomX}vw`, `${randomX + (Math.random() * 10 - 5)}vw`],
                y: [`${randomY}vh`, `${randomY + (Math.random() * 10 - 5)}vh`],
                opacity: [0, 0.5, 0],
            }}
            transition={{
                duration: duration,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "linear",
            }}
        />
    );
};
