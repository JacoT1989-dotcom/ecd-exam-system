"use client";

import React from "react";
import {
  Construction,
  Wrench,
  Code,
  ArrowLeft,
  Clock,
  Zap,
  Layout,
  BarChart,
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";

const ModernUnderDevelopment = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95 py-16 px-4">
      <div className="max-w-5xl mx-auto space-y-20">
        {/* Hero Section */}
        <div className="text-center space-y-8">
          <div className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
            <Clock className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">We're making progress</span>
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-accent via-purple-500 to-blue-600">
            Under Development
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Our team is crafting a powerful new experience with attention to
            every detail. We're almost there.
          </p>

          <div className="max-w-xl mx-auto pt-8">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Development Progress</span>
              <span className="text-accent font-bold">70%</span>
            </div>
            <Progress value={70} className="h-2" />
            <div className="grid grid-cols-4 text-xs text-muted-foreground mt-2">
              <div className="text-left">Planning</div>
              <div className="text-center">Design</div>
              <div className="text-center">Development</div>
              <div className="text-right">Testing</div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="space-y-10">
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold">What to Expect</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We're working on these key areas to deliver an exceptional product
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-blue-500" />
                </div>
                <CardTitle>New Features</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Advanced analytics, custom dashboards, and powerful reporting
                  tools designed to give you deeper insights.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4">
                  <Layout className="h-6 w-6 text-purple-500" />
                </div>
                <CardTitle>Intuitive Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  A clean, modern design with seamless navigation that puts the
                  most important information at your fingertips.
                </p>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-2">
                <div className="w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center mb-4">
                  <BarChart className="h-6 w-6 text-green-500" />
                </div>
                <CardTitle>Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Lightning-fast response times and optimized workflows to
                  handle even the most demanding tasks efficiently.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Return Section */}
        <div className="text-center space-y-8 pt-10">
          <div className="space-y-4">
            <h2 className="text-2xl font-bold">Stay Updated</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              We're working hard to bring this section online soon. Check back
              regularly for updates on our progress.
            </p>
          </div>

          <div className="inline-flex flex-col items-center space-y-4">
            <p className="text-sm text-muted-foreground">
              Expected completion: Coming Soon
            </p>
            <Link href="/students">
              <Button className="rounded-full px-6" variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Return to Homepage
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernUnderDevelopment;
