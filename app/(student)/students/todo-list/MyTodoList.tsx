// MyTodoListModal.tsx
"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  LucideList,
  LucideChevronLeft,
  LucideChevronRight,
  LucideTrash2,
} from "lucide-react";
import { getUserHandwritingEntries, deleteHandwritingEntry } from "./actions";
import { toast } from "sonner";

interface HandwritingEntry {
  id: string;
  imageUrl: string;
  recognizedText: string | null;
  createdAt: Date;
}

interface MyTodoListModalProps {
  className?: string;
}

const MyTodoListModal: React.FC<MyTodoListModalProps> = ({
  className = "",
}) => {
  const [entries, setEntries] = useState<HandwritingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const entriesPerPage = 1;

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const result = await getUserHandwritingEntries();
      if (result.success) {
        // Sort entries by date (oldest first) before setting state
        const sortedEntries = [...result.entries].sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        });
        setEntries(sortedEntries);
      } else {
        toast.error(result.error || "Failed to load your todo list");
      }
    } catch (error) {
      console.error("Error fetching entries:", error);
      toast.error("Failed to load your todo list");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEntries();
    }
  }, [isOpen]);

  // No need for separate sorting effect since we sort when fetching

  // Calculate total pages
  const totalPages = Math.ceil(entries.length / entriesPerPage);

  // Get current entries
  const currentEntries = entries.slice(
    (currentPage - 1) * entriesPerPage,
    currentPage * entriesPerPage,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleDeleteEntry = async (entryId: string) => {
    if (
      confirm(
        "Are you sure you want to delete this todo item? This action cannot be undone.",
      )
    ) {
      setIsDeleting(true);
      try {
        const result = await deleteHandwritingEntry(entryId);

        if (result.success) {
          toast.success("Todo item deleted successfully");

          // Remove the entry from state and maintain sorting
          const updatedEntries = entries.filter(
            (entry) => entry.id !== entryId,
          );
          setEntries(updatedEntries);

          // Adjust current page if needed
          if (updatedEntries.length === 0) {
            setCurrentPage(1);
          } else if (
            currentPage > Math.ceil(updatedEntries.length / entriesPerPage)
          ) {
            setCurrentPage(Math.max(1, currentPage - 1));
          }
        } else {
          toast.error(result.error || "Failed to delete todo item");
        }
      } catch (error) {
        console.error("Error deleting entry:", error);
        toast.error("Failed to delete todo item");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className={`${className} ml-2`}>
          <LucideList className="h-4 w-4 mr-2" />
          My Todo List
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>My Todo List</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="py-8 text-center">
            Loading your saved handwriting entries...
          </div>
        ) : entries.length === 0 ? (
          <div className="py-8 text-center">
            <p>You don&apos;t have any saved handwriting entries yet.</p>
          </div>
        ) : (
          <>
            {currentEntries.map((entry) => (
              <Card key={entry.id} className="mb-4">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <div className="text-sm text-gray-500">
                      Created: {new Date(entry.createdAt).toLocaleString()}
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteEntry(entry.id)}
                      disabled={isDeleting}
                      title="Delete this todo item"
                    >
                      {isDeleting ? (
                        "Deleting..."
                      ) : (
                        <LucideTrash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                  <div className="mb-4 relative w-full h-64">
                    <Image
                      src={entry.imageUrl}
                      alt="Handwritten note"
                      className="rounded-md border object-contain"
                      fill
                      sizes="(max-width: 768px) 100vw, 600px"
                      priority
                    />
                  </div>
                  <div className="p-2 border rounded-md bg-gray-50">
                    <h3 className="text-sm font-medium mb-1">
                      Recognized Text:
                    </h3>
                    <p className="whitespace-pre-wrap">
                      {entry.recognizedText || "No text recognized"}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="justify-between border-t pt-4">
                  <div className="text-sm text-gray-500">
                    Entry {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePrevPage}
                      disabled={currentPage === 1}
                    >
                      <LucideChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      <LucideChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MyTodoListModal;
