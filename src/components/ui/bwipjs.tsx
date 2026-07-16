import { useEffect, useRef } from 'react';
import bwipjs from 'bwip-js';

export interface BWIPJSProps {
  bcid: string;
  text: string;
  scale?: number;
  height?: number;
  includetext?: boolean;
  className?: string;
}

/**
 * Componente de código de barras baseado em CANVAS (não SVG).
 *
 * Por que Canvas e não SVG?
 * Impressoras HP LaserJet (e a maioria das laser/jato de tinta) recebem do
 * navegador um bitmap rasterizado a 96 DPI. SVG com barras finas some nesse
 * processo. Canvas já é um bitmap — o que o bwip-js desenhar é exatamente o
 * que sai no papel.
 *
 * A estratégia de alta resolução:
 * - Renderizamos o canvas internamente em scale ALTO (ex: scale=6)
 * - O CSS encolhe o canvas para caber na etiqueta (width: 100%)
 * - O navegador envia para a impressora o canvas em sua resolução NATIVA (alta)
 * - A impressora recebe um bitmap nítido e imprime barras perfeitamente definidas
 */
export const BWIPJS: React.FC<BWIPJSProps> = ({
  bcid,
  text,
  scale = 4,
  height = 12,
  includetext = false,
  className,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !text) return;
    try {
      bwipjs.toCanvas(canvasRef.current, {
        bcid,
        text,
        scale,
        height,
        includetext,
        backgroundcolor: 'ffffff',
      });
    } catch (e) {
      console.error('BWIPJS Canvas Error:', e);
    }
  }, [bcid, text, scale, height, includetext]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: 'auto',
        imageRendering: 'pixelated',
      }}
    />
  );
};
