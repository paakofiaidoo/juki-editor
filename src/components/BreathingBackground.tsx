import { useEffect, useRef } from "react";

export function BreathingBackground() {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const { clientX, clientY } = e;
            const x = Math.round((clientX / window.innerWidth) * 100);
            const y = Math.round((clientY / window.innerHeight) * 100);

            container.style.setProperty("--mouse-x", `${x}%`);
            container.style.setProperty("--mouse-y", `${y}%`);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 -z-10 transition-colors duration-500"
            style={{
                background: `
          radial-gradient(
            circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
            rgba(29, 78, 216, 0.15) 0%,
            rgba(0, 0, 0, 0) 50%
          ),
          linear-gradient(to bottom right, #0f172a, #020617)
        `,
            }}
        >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>
    );
}
