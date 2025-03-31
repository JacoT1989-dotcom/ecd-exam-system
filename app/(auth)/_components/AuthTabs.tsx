"use client";

import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "../login/LoginForm";
import RegisterForm from "../register/RegisterForm";

// Add proper TypeScript interface for props
interface AuthModalProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, setIsOpen }) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="sm:max-w-[600px] max-h-[90vh] p-0 overflow-hidden border border-gray-200 shadow-xl rounded-lg"
        aria-describedby="auth-modal-description"
        aria-labelledby="auth-modal-title"
      >
        <div id="auth-modal-description" className="sr-only">
          Authentication dialog for login and registration
        </div>
        <div id="auth-modal-title" className="sr-only">
          Authentication
        </div>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="w-full grid grid-cols-2 p-0 bg-gray-100 rounded-t-lg">
            <TabsTrigger
              value="login"
              className="py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#4a6e8a] data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a6e8a]"
            >
              Login
            </TabsTrigger>
            <TabsTrigger
              value="register"
              className="py-3 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#4a6e8a] data-[state=active]:shadow-none rounded-none data-[state=active]:border-b-2 data-[state=active]:border-[#4a6e8a]"
            >
              Register
            </TabsTrigger>
          </TabsList>
          <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
            <TabsContent value="login" className="m-0 p-6 focus:outline-none">
              <div className="bg-white">
                <LoginForm inModal={true} />
              </div>
            </TabsContent>
            <TabsContent
              value="register"
              className="m-0 p-6 focus:outline-none"
            >
              <div className="bg-white">
                <RegisterForm inModal={true} setIsOpen={setIsOpen} />
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;