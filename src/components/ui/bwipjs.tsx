import React, { useMemo } from 'react';
import bwipjs from 'bwip-js';

export interface BWIPJSProps {
  bcid: string;
  text: string;
  scale?: number;
  height?: number;
  includetext?: boolean;
  className?: string;
}

export const BWIPJS: React.FC<BWIPJSProps> = ({ 
  bcid, 
  text, 
  scale = 3, 
  height = 12, 
  includetext = false, 
  className 
}) => {
  const svgString = useMemo(() => {
    try {
      const rawSvg = bwipjs.toSVG({
        bcid,
        text,
        scale,
        height,
        includetext
      });
      return rawSvg.replace('<svg ', '<svg width="100%" height="100%" preserveAspectRatio="xMidYMid meet" shape-rendering="crispEdges" ');
    } catch (e) {
      console.error("Erro ao gerar barcode BWIP-JS:", e);
      return '';
    }
  }, [bcid, text, scale, height, includetext]);

  if (!svgString) return null;

  return (
    <div 
      className={`flex justify-center items-center overflow-hidden [&>svg]:w-full [&>svg]:h-full [&>svg]:max-w-full [&>svg]:max-h-full ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: svgString }} 
    />
  );
};
