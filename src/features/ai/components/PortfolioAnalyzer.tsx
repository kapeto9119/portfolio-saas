"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ChartBar, Sparkles } from "lucide-react";
import { useAI } from "../hooks/useAI";

interface PortfolioAnalysis {
  strengths: string[];
  improvements: string[];
  marketFit: {
    score: number;
    explanation: string;
  };
  recommendations: Array<{
    title: string;
    description: string;
    priority: "high" | "medium" | "low";
  }>;
}

interface PortfolioAnalyzerProps {
  projects: Array<{
    title: string;
    description: string;
    technologies: string[];
  }>;
  skills: string[];
  experience?: string;
}

export function PortfolioAnalyzer({
  projects,
  skills,
  experience,
}: PortfolioAnalyzerProps) {
  const [activeTab, setActiveTab] = useState<"strengths" | "improvements" | "recommendations">("strengths");

  const {
    execute: analyzePortfolio,
    isLoading,
    data,
  } = useAI<{ analysis: PortfolioAnalysis }>({
    endpoint: "analyze-portfolio",
    successMessage: "Portfolio analysis complete!",
    errorMessage: "Failed to analyze portfolio. Please try again.",
  });

  const handleAnalyze = () => {
    analyzePortfolio({
      projects,
      skills,
      experience,
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Portfolio Analysis</h3>
          <p className="text-sm text-muted-foreground">
            Get AI-powered insights about your portfolio
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAnalyze}
          disabled={isLoading}
        >
          <Sparkles className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Analyze Portfolio
        </Button>
      </div>

      {data?.analysis && (
        <div className="space-y-6">
          <div className="flex items-center space-x-2 pb-4">
            <ChartBar className="h-5 w-5" />
            <div className="text-sm">
              Market Fit Score:{" "}
              <span className="font-medium">{data.analysis.marketFit.score}/100</span>
            </div>
          </div>

          <div className="flex space-x-2 border-b">
            {(["strengths", "improvements", "recommendations"] as const).map((tab) => (
              <Button
                key={tab}
                variant={activeTab === tab ? "default" : "ghost"}
                size="sm"
                onClick={() => setActiveTab(tab)}
                className="capitalize"
              >
                {tab}
              </Button>
            ))}
          </div>

          <div className="pt-2">
            {activeTab === "strengths" && (
              <ul className="space-y-2">
                {data.analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "improvements" && (
              <ul className="space-y-2">
                {data.analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-yellow-500">!</span>
                    <span>{improvement}</span>
                  </li>
                ))}
              </ul>
            )}

            {activeTab === "recommendations" && (
              <div className="space-y-4">
                {data.analysis.recommendations.map((rec, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium">{rec.title}</h4>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {rec.description}
                        </p>
                      </div>
                      <Badge className={getPriorityColor(rec.priority)}>
                        {rec.priority}
                      </Badge>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-muted p-4">
            <p className="text-sm">
              <span className="font-medium">Market Fit Analysis:</span>{" "}
              {data.analysis.marketFit.explanation}
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 