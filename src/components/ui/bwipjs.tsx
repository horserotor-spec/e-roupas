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
      let finalSvg = rawSvg;
      const viewBoxMatch = rawSvg.match(/viewBox="0 0 (\d+(?:\.\d+)?) (\d+(?:\.\d+)?)"/);
      if (viewBoxMatch) {
        finalSvg = rawSvg.replace('<svg ', `<svg width="${viewBoxMatch[1]}" height="${viewBoxMatch[2]}" shape-rendering="crispEdges" `);
      } else {
        finalSvg = rawSvg.replace('<svg ', '<svg shape-rendering="crispEdges" ');
      }
      return finalSvg;
    } catch (e) {
      console.error("Erro ao gerar barcode BWIP-JS:", e);
      return '';
    }
  }, [bcid, text, scale, height, includetext]);

  if (!svgString) return null;

  return (
    <div 
      className={`flex justify-center items-center overflow-hidden ${className || ''}`}
      dangerouslySetInnerHTML={{ __html: svgString }} 
    />
  );
};
