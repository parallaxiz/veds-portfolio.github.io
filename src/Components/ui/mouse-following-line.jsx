import React, { useEffect, useRef, useState, useCallback } from "react";

export function GridAnimation({
  className = "",
  cols = 60,
  rows = 60,
  spacing = 30,
  strokeLength = 12,
  strokeWidth = 1.2,
  strokeColor = "rgba(61, 189, 189, 0.45)",
  ...props
}) {
  const canvasRef = useRef(null);
  const ballRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const animationFrameRef = useRef(null);
  const currentBallPosition = useRef({ x: 0, y: 0 });
  const targetBallPosition = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const updateDimensions = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setDimensions({ width, height });

      const centerX = width / 2;
      const centerY = height / 2;
      currentBallPosition.current = { x: centerX, y: centerY };
      targetBallPosition.current = { x: centerX, y: centerY };
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, [cols, rows, spacing]);

  const snapToGrid = (pointX, pointY) => {
    const nearestX = Math.round(pointX / spacing) * spacing;
    const nearestY = Math.round(pointY / spacing) * spacing;
    return { x: nearestX, y: nearestY };
  };

  const animateCanvas = useCallback(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Smooth lerp ball position towards target
    currentBallPosition.current.x += (targetBallPosition.current.x - currentBallPosition.current.x) * 0.2;
    currentBallPosition.current.y += (targetBallPosition.current.y - currentBallPosition.current.y) * 0.2;

    if (ballRef.current) {
      ballRef.current.style.transform = `translate3d(${currentBallPosition.current.x}px, ${currentBallPosition.current.y}px, 0px)`;
    }

    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    const ballX = currentBallPosition.current.x;
    const ballY = currentBallPosition.current.y;

    const calcCols = Math.ceil(dimensions.width / spacing);
    const calcRows = Math.ceil(dimensions.height / spacing);

    for (let col = 0; col <= calcCols; col++) {
      for (let row = 0; row <= calcRows; row++) {
        const pointX = col * spacing;
        const pointY = row * spacing;
        const dx = ballX - pointX;
        const dy = ballY - pointY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 12) continue;

        const angle = Math.atan2(dy, dx);

        ctx.beginPath();
        ctx.moveTo(pointX, pointY);
        ctx.lineTo(
          pointX - Math.cos(angle) * strokeLength,
          pointY - Math.sin(angle) * strokeLength
        );
        ctx.strokeStyle = strokeColor;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
      }
    }

    animationFrameRef.current = requestAnimationFrame(animateCanvas);
  }, [dimensions, spacing, strokeLength, strokeWidth, strokeColor]);

  useEffect(() => {
    const handleGlobalMouseMove = (event) => {
      const mouseX = event.clientX;
      const mouseY = event.clientY;
      const { x: snapX, y: snapY } = snapToGrid(mouseX, mouseY);
      targetBallPosition.current = { x: snapX, y: snapY };
    };

    window.addEventListener("mousemove", handleGlobalMouseMove);
    animationFrameRef.current = requestAnimationFrame(animateCanvas);

    return () => {
      window.removeEventListener("mousemove", handleGlobalMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [animateCanvas, spacing]);

  return (
    <div
      className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
      {...props}
    >
      <canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="absolute inset-0 pointer-events-none"
      />
      <div
        ref={ballRef}
        className="absolute top-0 left-0 w-[8px] h-[8px] rounded-full bg-[#56e0d8] shadow-[0_0_12px_#56e0d8] pointer-events-none z-10"
        style={{
          marginLeft: -4,
          marginTop: -4,
          willChange: "transform",
        }}
      />
    </div>
  );
}

export default GridAnimation;
