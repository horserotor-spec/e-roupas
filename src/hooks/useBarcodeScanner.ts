import { useState, useEffect, useRef } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/library';

export function useBarcodeScanner(onScan: (code: string) => void, enabled: boolean) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const zxingReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  useEffect(() => {
    if (!enabled) {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      return;
    }

    let active = true;
    let stream: MediaStream | null = null;
    let barcodeDetector: any = null;
    let frameId: number;

    const startCamera = async () => {
      try {
        setError(null);
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1920 },
            height: { ideal: 1080 },
            // @ts-ignore (propriedade não padrão, mas suportada por muitos browsers mobile)
            focusMode: 'continuous'
          }
        });

        if (!active) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }

        const video = videoRef.current;
        if (!video) return;
        
        video.srcObject = stream;
        video.setAttribute('playsinline', 'true');
        await video.play();

        // Tenta usar a API nativa
        if ('BarcodeDetector' in window) {
          try {
            // @ts-ignore
            barcodeDetector = new window.BarcodeDetector({
              formats: ['qr_code', 'code_128', 'code_39', 'ean_13', 'data_matrix', 'pdf417']
            });
            
            // Testa se a API realmente funciona (alguns browsers tem a classe mas falham ao instanciar)
            const supported = await (window as any).BarcodeDetector.getSupportedFormats();
            if (supported.length === 0) {
              barcodeDetector = null;
            }
          } catch (e) {
            console.warn("BarcodeDetector indisponível ou erro:", e);
            barcodeDetector = null;
          }
        }

        if (barcodeDetector) {
          const scanLoop = async () => {
            if (!active) return;
            try {
              if (video.readyState === video.HAVE_ENOUGH_DATA) {
                const barcodes = await barcodeDetector.detect(video);
                if (barcodes.length > 0) {
                  onScan(barcodes[0].rawValue);
                }
              }
            } catch (err) {
              // Ignore frame errors
            }
            // Limitar a ~10fps para não fritar o celular
            setTimeout(() => {
              frameId = requestAnimationFrame(scanLoop);
            }, 100);
          };
          scanLoop();
        } else {
          // Fallback para ZXing
          if (!zxingReaderRef.current) {
            zxingReaderRef.current = new BrowserMultiFormatReader();
          }
          // ZXing já captura os frames do elemento video que possui o stream
          zxingReaderRef.current.decodeFromVideoElement(video, (result, err) => {
            if (result && active) {
              onScan(result.getText());
            }
          });
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao acessar a câmera. Verifique as permissões.');
      }
    };

    if (videoRef.current) {
        startCamera();
    } else {
        // Wait for ref
        setTimeout(startCamera, 100);
    }

    return () => {
      active = false;
      if (frameId) cancelAnimationFrame(frameId);
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
      if (zxingReaderRef.current) {
          zxingReaderRef.current.reset();
      }
      if (stream) {
        stream.getTracks().forEach(t => t.stop());
      }
    };
  }, [enabled, onScan]);

  return { videoRef, error };
}
