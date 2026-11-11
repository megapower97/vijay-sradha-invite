import { useRef, useEffect, useState } from 'react';
import confetti from 'canvas-confetti';

interface ScratchCardProps {
  onReveal?: () => void;
}

export const ScratchCard: React.FC<ScratchCardProps> = ({ onReveal }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    // Match exact mobile or desktop width dynamically
    const width = container.offsetWidth;
    const height = container.offsetHeight;
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Luxury gold foil gradient
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#C5A059');
    gradient.addColorStop(0.3, '#F3E5AB');
    gradient.addColorStop(0.5, '#D4AF37');
    gradient.addColorStop(0.8, '#FFFDD0');
    gradient.addColorStop(1, '#AA7C11');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Inner foil border
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(8, 8, width - 16, height - 16);

    // Responsive foil instruction text
    ctx.fillStyle = '#3B2816';
    ctx.font = `600 ${width < 320 ? '13px' : '15px'} Montserrat, sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', width / 2, height / 2 - 6);
    ctx.font = '400 11px Montserrat, sans-serif';
    ctx.fillText('Rub gently with your finger', width / 2, height / 2 + 16);
  }, []);

  const scratch = (x: number, y: number) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 28, 0, Math.PI * 2);
    ctx.fill();

    // Check scratched percentage
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearPixels = 0;
    for (let i = 3; i < imageData.data.length; i += 16) {
      if (imageData.data[i] === 0) clearPixels++;
    }

    const totalSampled = (canvas.width * canvas.height) / 4;
    if (clearPixels / totalSampled > 0.38 && !isRevealed) {
      setIsRevealed(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.65 },
        colors: ['#D4AF37', '#9E7B3B', '#FCE883', '#FFF5E1'],
      });
      if (onReveal) onReveal();
    }
  };

  const handlePointerMove = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>
  ) => {
    if (!isDrawing && e.type !== 'touchmove') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    scratch(clientX - rect.left, clientY - rect.top);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-[340px] h-[140px] sm:h-[150px] mx-auto rounded-2xl overflow-hidden shadow-md border border-[#C5A059]/50 bg-[#FDFBF7] select-none touch-none"
    >
      {/* Underlying Revealed Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-[#FFFDF9] to-[#F7EFE4]">
        <p className="text-[10px] sm:text-xs uppercase tracking-[0.25em] text-[#8B6F4E] font-sans-clean">
          Sumuhurtham
        </p>
        <p className="text-2xl sm:text-3xl font-serif-wedding font-bold text-[#9E7B3B] mt-0.5">
          December 3, 2026
        </p>
        <p className="text-[11px] sm:text-xs font-sans-clean text-[#4A3B32] mt-1 font-medium">
          4:42 AM <span className="italic font-normal">(Early hrs of Friday, Dec 4)</span>
        </p>
      </div>

      {/* Scratchable Foil Canvas */}
      <canvas
        ref={canvasRef}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => setIsDrawing(false)}
        onMouseLeave={() => setIsDrawing(false)}
        onMouseMove={handlePointerMove}
        onTouchStart={() => setIsDrawing(true)}
        onTouchEnd={() => setIsDrawing(false)}
        onTouchMove={handlePointerMove}
        className={`absolute inset-0 w-full h-full cursor-pointer transition-opacity duration-700 touch-none ${
          isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
    </div>
  );
};