"use client";

import React, { useRef, useState, useEffect } from "react";
import {
  LucideEdit,
  LucideTrash2,
  LucideChevronLeft,
  LucideChevronRight,
  LucideDownload,
  LucidePlus,
} from "lucide-react";

interface Point {
  x: number;
  y: number;
  pressure?: number;
}

interface Page {
  id: string;
  points: Point[];
  imageData?: string; // base64 representation of the canvas
}

interface WritingPadProps {
  width?: number;
  height?: number;
  className?: string;
  placeholder?: string;
}

const WritingPad: React.FC<WritingPadProps> = ({
  width = 600,
  height = 400,
  className = "",
  placeholder = "Write here...",
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  // State for pages and current page index
  const [pages, setPages] = useState<Page[]>([
    { id: `page-${Date.now()}`, points: [] },
  ]);
  const [currentPageIndex, setCurrentPageIndex] = useState(0);

  // Get current page data
  const currentPage = pages[currentPageIndex];

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

    // Add resize event listener to handle window resizing
    window.addEventListener("resize", setupCanvas);

    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, []);

  // Redraw canvas when current page changes
  useEffect(() => {
    if (!canvasRef.current || !canvasContext) return;

    // Clear the canvas
    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    // If the page has imageData, use it to restore the canvas
    if (currentPage.imageData) {
      const img = new Image();
      img.onload = () => {
        if (canvasContext) {
          canvasContext.drawImage(img, 0, 0);
        }
      };
      img.src = currentPage.imageData;
      return;
    }

    // Otherwise, redraw from points
    if (currentPage.points.length > 0) {
      // Redraw the strokes
      canvasContext.beginPath();
      for (let i = 0; i < currentPage.points.length; i++) {
        const point = currentPage.points[i];

        if (i === 0 || (i > 0 && point.pressure === -1)) {
          // A pressure of -1 indicates a new stroke should begin
          canvasContext.stroke(); // Finish the previous stroke
          canvasContext.beginPath();
          canvasContext.moveTo(point.x, point.y);
        } else {
          canvasContext.lineTo(point.x, point.y);
          canvasContext.stroke();
        }
      }
    }
  }, [
    currentPageIndex,
    pages,
    canvasContext,
    currentPage.imageData,
    currentPage.points,
  ]);

  const clearCurrentPage = () => {
    if (!canvasRef.current || !canvasContext) return;

    canvasContext.fillStyle = "#ffffff";
    canvasContext.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height,
    );

    // Update pages state by clearing the current page
    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        points: [],
        imageData: undefined,
      };
      return newPages;
    });
  };

  const savePage = () => {
    if (!canvasRef.current) return;

    // Save the current page's canvas as an image
    const imageData = canvasRef.current.toDataURL("image/png");

    setPages((prevPages) => {
      const newPages = [...prevPages];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        imageData,
      };
      return newPages;
    });
  };

  const addNewPage = () => {
    // Save current page first
    savePage();

    // Add a new page and switch to it
    const newPageIndex = pages.length;
    setPages((prevPages) => [
      ...prevPages,
      { id: `page-${Date.now()}`, points: [] },
    ]);
    setCurrentPageIndex(newPageIndex);
  };

  const goToPreviousPage = () => {
    if (currentPageIndex > 0) {
      savePage(); // Save current page before switching
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPageIndex < pages.length - 1) {
      savePage(); // Save current page before switching
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const downloadAllPages = () => {
    // Save current page first
    savePage();

    // Create a temporary link element
    const link = document.createElement("a");
    link.download = `notes-${Date.now()}.png`;

    // Use the current page's image data
    if (currentPage.imageData) {
      link.href = currentPage.imageData;
      link.click();
    }
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

    // Add a special marker with pressure = -1 to indicate a new stroke
    const newPoint = { x: offsetX, y: offsetY, pressure: -1 };

    // Update the current page's points
    setPages((prevPages) => {
      const newPages = [...prevPages];
      const currentPagePoints = [
        ...newPages[currentPageIndex].points,
        newPoint,
      ];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        points: currentPagePoints,
      };
      return newPages;
    });
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

    // Regular drawing point
    const newPoint = { x: offsetX, y: offsetY, pressure: e.pressure || 1 };

    // Update the current page's points
    setPages((prevPages) => {
      const newPages = [...prevPages];
      const currentPagePoints = [
        ...newPages[currentPageIndex].points,
        newPoint,
      ];
      newPages[currentPageIndex] = {
        ...newPages[currentPageIndex],
        points: currentPagePoints,
      };
      return newPages;
    });
  };

  const stopDrawing = () => {
    if (!canvasContext) return;

    canvasContext.closePath();
    setIsDrawing(false);
  };

  return (
    <div
      ref={containerRef}
      className={`${className} mx-auto`}
      style={{ width: "100%" }}
    >
      <div className="w-full bg-white rounded-lg shadow-lg">
        {/* Header with title and controls */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-[#3e6788]">Writing Pad</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={clearCurrentPage}
              className="flex items-center gap-1 px-3 py-1.5 bg-[#3e6788] text-white rounded-md hover:bg-[#2c4a63] transition-colors text-sm"
              title="Clear current page"
            >
              <LucideTrash2 className="h-4 w-4" />
              <span>Clear Page</span>
            </button>
          </div>
        </div>

        {/* Canvas container with paper styling */}
        <div className="p-4">
          <div
            className="relative border border-gray-200 rounded-md overflow-hidden bg-white shadow-inner"
            style={{ height: `${height}px` }}
          >
            {/* Lined paper background */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                backgroundImage: `linear-gradient(#e5e7eb 1px, transparent 1px)`,
                backgroundSize: "100% 24px",
                backgroundPosition: "0 0",
                opacity: 0.6,
              }}
            />

            <canvas
              ref={canvasRef}
              onPointerDown={startDrawing}
              onPointerMove={draw}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              className="touch-none bg-transparent cursor-crosshair absolute top-0 left-0 w-full h-full z-10"
              style={{ touchAction: "none" }} // Prevents scrolling on touch devices
            />

            {/* Placeholder text */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-20 z-0">
              {currentPage.points.length === 0 && !currentPage.imageData && (
                <div className="flex items-center gap-2 text-gray-400">
                  <LucideEdit className="h-5 w-5" />
                  <span>{placeholder}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pagination controls */}
        <div className="flex items-center justify-between p-4 border-t">
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPageIndex === 0}
              className={`p-2 rounded-full ${
                currentPageIndex === 0
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#3e6788] hover:bg-gray-100"
              }`}
            >
              <LucideChevronLeft className="h-5 w-5" />
            </button>

            <span className="text-sm font-medium">
              Page {currentPageIndex + 1} of {pages.length}
            </span>

            <button
              onClick={goToNextPage}
              disabled={currentPageIndex === pages.length - 1}
              className={`p-2 rounded-full ${
                currentPageIndex === pages.length - 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-[#3e6788] hover:bg-gray-100"
              }`}
            >
              <LucideChevronRight className="h-5 w-5" />
            </button>
          </div>

          <button
            onClick={addNewPage}
            className="flex items-center gap-1 px-3 py-1.5 bg-[#3e6788] text-white rounded-md hover:bg-[#2c4a63] transition-colors text-sm"
          >
            <LucidePlus className="h-4 w-4" />
            <span>New Page</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default WritingPad;
