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
      return bwipjs.toSVG({
        bcid,
        text,
        scale,
        height,
        includetext
      });
    } catch (e) {
      console.error("Erro ao gerar barcode BWIP-JS:", e);
      return '';
    }
  }, [bcid, text, scale, height, includetext]);

  if (!svgString) return null;

  return (
    <div 
      className={className}
      dangerouslySetInnerHTML={{ __html: svgString }} 
    />
  );
};
