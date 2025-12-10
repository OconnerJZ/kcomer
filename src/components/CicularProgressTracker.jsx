import React, { useState, useRef, useEffect } from "react";
import {
  AssignmentTurnedIn,
  DeliveryDining,
  FactCheck,
  HourglassEmpty,
  Restaurant,
  Verified,
} from "@mui/icons-material";
import { Box, Typography, Button } from "@mui/material";

const CircularProgressTracker = (status) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [animatedProgress, setAnimatedProgress] = useState(1);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const steps = [
    {
      id: 1,
      key: "pending",
      label: "Pendiente",
      icon: HourglassEmpty,
      hexColor: "#06b6d4",
    },
    {
      id: 2,
      key: "accepted",
      label: "Aceptada",
      icon: FactCheck,
      hexColor: "#3b82f6",
    },
    {
      id: 3,
      key: "preparing",
      label: "Preparando",
      icon: Restaurant,
      hexColor: "#a855f7",
    },
    {
      id: 4,
      key: "ready",
      label: "Lista",
      icon: AssignmentTurnedIn,
      hexColor: "#ec4899",
    },
    {
      id: 5,
      key: "in_delivery",
      label: "En Camino",
      icon: DeliveryDining,
      hexColor: "#f97316",
    },
    {
      id: 6,
      key: "completed",
      label: "Entregado",
      icon: Verified,
      hexColor: "#22c55e",
    },
  ];

  useEffect(() => {
    const step = steps.find((s) => s.key === status.status);
    if (step) {
      setCurrentStep(step.id);
    }
  }, [status]);

  // Animar progreso
  useEffect(() => {
    const duration = 800;
    const startTime = Date.now();
    const startProgress = animatedProgress;
    const endProgress = currentStep;
    const difference = endProgress - startProgress;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const newProgress = startProgress + difference * easeProgress;
      setAnimatedProgress(newProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setAnimatedProgress(endProgress);
      }
    };

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    animate();

    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentStep]);

  // Dibujar canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = 85;
    const lineWidth = 12;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Fondo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = "#e5e7eb";
    ctx.lineWidth = lineWidth;
    ctx.stroke();

    const totalSteps = steps.length;
    const limitedProgres = totalSteps - 0.1;
    const progressPercentage =
      ((animatedProgress - 1) / (totalSteps - 1)) * 100;
    const endAngle = (progressPercentage / 100) * 2 * Math.PI - Math.PI / 2;

    if (
      Math.floor(animatedProgress) === totalSteps &&
      animatedProgress > limitedProgres
    ) {
      // Degradado verde al 100%
      const gradient = ctx.createLinearGradient(
        centerX - radius,
        centerY,
        centerX + radius,
        centerY
      );
      gradient.addColorStop(0, "#22c55e");
      gradient.addColorStop(0.5, "#16a34a");
      gradient.addColorStop(1, "#15803d");

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, -Math.PI / 2, endAngle);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = "round";
      ctx.stroke();
    } else {
      // Segmentos con degradado por pasos
      const segmentsPerStep = 50;
      const totalSegments = Math.floor(animatedProgress * segmentsPerStep);
      const anglePerSegment =
        (animatedProgress * 2 * Math.PI) / totalSteps / totalSegments;

      for (let i = 0; i < totalSegments; i++) {
        const startAngle = i * anglePerSegment - Math.PI / 2;
        const segEndAngle = (i + 1) * anglePerSegment - Math.PI / 2;
        const stepIndex = Math.floor(i / segmentsPerStep);
        const nextStepIndex = Math.min(stepIndex + 1, totalSteps - 1);
        const localProgress = (i % segmentsPerStep) / segmentsPerStep;

        const color = interpolateColor(
          steps[stepIndex].hexColor,
          steps[nextStepIndex].hexColor,
          localProgress
        );

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, startAngle, segEndAngle);
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.lineCap = i === totalSegments - 1 ? "round" : "butt";
        ctx.stroke();
      }
    }
  }, [animatedProgress, steps]);

  const interpolateColor = (color1, color2, factor) => {
    const c1 = Number.parseInt(color1.slice(1), 16);
    const c2 = Number.parseInt(color2.slice(1), 16);
    const r1 = (c1 >> 16) & 0xff;
    const g1 = (c1 >> 8) & 0xff;
    const b1 = c1 & 0xff;
    const r2 = (c2 >> 16) & 0xff;
    const g2 = (c2 >> 8) & 0xff;
    const b2 = c2 & 0xff;
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
  };

  return (
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Box sx={{ position: "relative", width: 130, height: 130 }}>
          <canvas
            ref={canvasRef}
            width={200}
            height={200}
            style={{ width: "100%", height: "100%" }}
          />
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {(() => {
              const CurrentIcon = steps[currentStep - 1].icon;
              const currentColor = steps[currentStep - 1].hexColor;
              return (
                <>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `linear-gradient(135deg, ${currentColor}, ${currentColor}99)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      boxShadow: 3,
                      mb: 1,
                      transition: "all 0.3s",
                    }}
                  >
                    <CurrentIcon sx={{ color: "white", fontSize: 23 }} />
                  </Box>
                  <Typography
                    variant="caption"
                    fontWeight="bold"
                    align="center"
                  >
                    {steps[currentStep - 1].label}
                  </Typography>
                </>
              );
            })()}
          </Box>
        </Box>
      </Box>
  );
};

export default CircularProgressTracker;
