"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LucidePencil } from "lucide-react";
import WritingPadModal from "../_exam-modals/WritingPadModal";

interface WritingPadButtonProps {
  className?: string;
}

const WritingPadButton: React.FC<WritingPadButtonProps> = ({
  className = "",
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <Button
        onClick={openModal}
        variant="outline"
        className={`flex items-center gap-2 ${className}`}
      >
        <LucidePencil className="h-4 w-4" />
        <span>Writing Pad</span>
      </Button>

      <WritingPadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
};

export default WritingPadButton;
