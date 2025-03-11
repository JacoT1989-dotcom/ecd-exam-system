"use client";

import React from "react";
import HandwritingRecognition from "./HandwritingRecognition";

export default function HandwritingRecognitionPage() {
  const handleTextRecognized = (text: string) => {
    console.log("Text recognized:", text);
    // Add your logic to handle the recognized text
  };

  return (
    <div className="flex justify-center px-4">
      <div className="w-full max-w-4xl">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Handwriting to Text Converter
        </h1>
        <p className="mb-6 text-center">
          Write in the box below and click &quot;Recognize Text&quot; to convert
          your handwriting to text.
        </p>

        <HandwritingRecognition
          onTextRecognized={handleTextRecognized}
          width={800}
          height={400}
        />
      </div>
    </div>
  );
}
