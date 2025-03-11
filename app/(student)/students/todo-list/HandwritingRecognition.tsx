"use client";

import React, { useRef, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  LucideEdit,
  LucideTrash2,
  LucideCheck,
  LucideSave,
} from "lucide-react";
import { saveHandwriting } from "./actions";

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

interface HandwritingRecognitionProps {
  onTextRecognized?: (text: string) => void;
  onSubmitSuccess?: (data: { imageUrl: string; entryId: string }) => void;
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

const HandwritingRecognition: React.FC<HandwritingRecognitionProps> = ({
  onTextRecognized,
  onSubmitSuccess,
  width = 600,
  height = 300,
  className = "",
  placeholder = "Write here...",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [recognizedText, setRecognizedText] = useState("");
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);
  const [points, setPoints] = useState<Point[]>([]);
  const [handwritingApiReady, setHandwritingApiReady] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    function setupCanvas() {
      if (!canvasRef.current) return;

      const canvas = canvasRef.current;
      const container = canvas.parentElement;

      if (!container) return;

      // Set canvas dimensions to exactly match its container
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = "#000000";

      // Set canvas background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      setCanvasContext(ctx);
    }

    setupCanvas();
    setHandwritingApiReady(true);

    // Add resize event listener to handle window resizing
    window.addEventListener("resize", setupCanvas);

    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  const clearCanvas = () => {
    if (!canvasRef.current || !canvasContext) return;

    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );
    setPoints([]);
    setRecognizedText("");
  };

  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!canvasContext || !canvasRef.current) return;

    // Prevent scrolling on touch devices
    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    canvasContext.beginPath();
    canvasContext.moveTo(offsetX, offsetY);

    setIsDrawing(true);
    setPoints((prev) => [
      ...prev,
      { x: offsetX, y: offsetY, pressure: e.pressure || 1 },
    ]);
  };

  const draw = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !canvasContext || !canvasRef.current) return;

    // Prevent scrolling on touch devices
    e.preventDefault();

    const rect = canvasRef.current.getBoundingClientRect();
    const offsetX = e.clientX - rect.left;
    const offsetY = e.clientY - rect.top;

    canvasContext.lineTo(offsetX, offsetY);
    canvasContext.stroke();

    setPoints((prev) => [
      ...prev,
      { x: offsetX, y: offsetY, pressure: e.pressure || 1 },
    ]);
  };

  const stopDrawing = () => {
    if (!canvasContext) return;

    canvasContext.closePath();
    setIsDrawing(false);
  };

  const recognizeText = async () => {
    if (!canvasRef.current) {
      toast.error("Handwriting recognition is not initialized");
      return;
    }

    if (points.length === 0) {
      toast.error("Please write something first");
      return;
    }

    try {
      toast.info("Processing handwriting...");

      // For demonstration purposes, we'll just wait a moment and return a sample text
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // This is where we'd get the actual recognized text from the API
      // For now we'll just use placeholder text
      const text = "This is simulated recognized text";

      setRecognizedText(text);

      if (onTextRecognized) {
        onTextRecognized(text);
      }

      toast.success("Text recognition complete");
    } catch (error) {
      console.error("Text recognition failed:", error);
      toast.error("Text recognition failed");
    }
  };

  const copyTextToClipboard = () => {
    if (!recognizedText) {
      toast.error("No text to copy");
      return;
    }

    navigator.clipboard
      .writeText(recognizedText)
      .then(() => toast.success("Text copied to clipboard"))
      .catch((err) => {
        console.error("Failed to copy text:", err);
        toast.error("Failed to copy text");
      });
  };

  const submitHandwriting = async () => {
    if (!canvasRef.current) {
      toast.error("Canvas is not initialized");
      return;
    }

    if (points.length === 0) {
      toast.error("Please write something first");
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvasRef.current?.toBlob((blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to convert canvas to image"));
          }
        }, "image/png");
      });

      // Create form data to send to server action
      const formData = new FormData();
      formData.append("canvasImage", blob, "handwriting.png");
      formData.append("points", JSON.stringify(points));

      if (recognizedText) {
        formData.append("recognizedText", recognizedText);
      }

      // Call the server action to save the handwriting
      const result = await saveHandwriting(formData);

      if (result.error) {
        throw new Error(result.error);
      }

      toast.success("Handwriting saved successfully");

      // Trigger callback if provided
      if (onSubmitSuccess && result.success) {
        onSubmitSuccess({
          imageUrl: result.imageUrl,
          entryId: result.entryId,
        });
      }

      // Optionally clear the canvas after successful submission
      // clearCanvas();
    } catch (error) {
      console.error("Failed to submit handwriting:", error);
      toast.error("Failed to save handwriting");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`${className} mx-auto`}
      style={{ maxWidth: `${width}px` }}
    >
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Handwriting Recognition</span>
            <Button
              variant="outline"
              size="icon"
              onClick={clearCanvas}
              title="Clear"
            >
              <LucideTrash2 className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div
            className="relative border rounded-md overflow-hidden"
            style={{ height: `${height}px` }}
          >
            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              className="touch-none bg-white cursor-crosshair absolute top-0 left-0 w-full h-full"
              style={{ touchAction: "none" }} // Prevents scrolling on touch devices
            />
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20">
              {points.length === 0 && (
                <div className="flex items-center gap-2 text-gray-400">
                  <LucideEdit className="h-5 w-5" />
                  <span>{placeholder}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Recognized Text</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={copyTextToClipboard}
                disabled={!recognizedText}
                title="Copy to clipboard"
              >
                <LucideCheck className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              value={recognizedText}
              onChange={(e) => setRecognizedText(e.target.value)}
              placeholder="Recognized text will appear here..."
              className="min-h-[100px] resize-none"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={recognizeText}
            className="w-full"
            disabled={points.length === 0}
          >
            Recognize Text
          </Button>
          <Button
            onClick={submitHandwriting}
            className="w-full"
            disabled={points.length === 0 || isSubmitting}
            variant="default"
          >
            {isSubmitting ? "Saving..." : "Save Handwriting"}
            {!isSubmitting && <LucideSave className="ml-2 h-4 w-4" />}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default HandwritingRecognition;
