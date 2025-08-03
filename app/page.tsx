"use client";
import { CopilotKit, useCoAgent, useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { CopilotChat, CopilotSidebar } from "@copilotkit/react-ui";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import "@copilotkit/react-ui/styles.css";
import { useMobileView } from "@/utils/use-mobile-view";
import { useMobileChat } from "@/utils/use-mobile-chat";
import { ChartRenderer } from "@/components/charts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { CalendarDays, BarChart3, Plus, Trash2 } from "lucide-react";

export default function HomePage() {
  const { isMobile } = useMobileView();
  const defaultChatHeight = 50
  const {
    isChatOpen,
    setChatHeight,
    setIsChatOpen,
    isDragging,
    chatHeight,
    handleDragStart
  } = useMobileChat(defaultChatHeight)

  const chatTitle = 'VC Data Assistant'
  const chatDescription = 'Ask me to analyze VC data'
  const initialLabel = 'Hi 👋 What VC insights would you like to explore?'

  return (
    <CopilotKit
      runtimeUrl="/api/copilotkit"
      showDevConsole={false}
    >
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100"
      >
        <VCVisualization />
        {isMobile ? (
          <>
            {/* Chat Toggle Button */}
            <div className="fixed bottom-0 left-0 right-0 z-50">
              <div className="bg-gradient-to-t from-white via-white to-transparent h-6"></div>
              <div
                className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-between cursor-pointer shadow-lg"
                onClick={() => {
                  if (!isChatOpen) {
                    setChatHeight(defaultChatHeight); // Reset to good default when opening
                  }
                  setIsChatOpen(!isChatOpen);
                }}
              >
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium text-gray-900">{chatTitle}</div>
                    <div className="text-sm text-gray-500">{chatDescription}</div>
                  </div>
                </div>
                <div className={`transform transition-transform duration-300 ${isChatOpen ? 'rotate-180' : ''}`}>
                  <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Pull-Up Chat Container */}
            <div
              className={`fixed inset-x-0 bottom-0 z-40 bg-white rounded-t-2xl shadow-[0px_0px_20px_0px_rgba(0,0,0,0.15)] transform transition-all duration-300 ease-in-out flex flex-col ${
                isChatOpen ? 'translate-y-0' : 'translate-y-full'
              } ${isDragging ? 'transition-none' : ''}`}
              style={{
                height: `${chatHeight}vh`,
                paddingBottom: 'env(safe-area-inset-bottom)' // Handle iPhone bottom padding
              }}
            >
              {/* Drag Handle Bar */}
              <div
                className="flex justify-center pt-3 pb-2 flex-shrink-0 cursor-grab active:cursor-grabbing"
                onMouseDown={handleDragStart}
              >
                <div className="w-12 h-1 bg-gray-400 rounded-full hover:bg-gray-500 transition-colors"></div>
              </div>

              {/* Chat Header */}
              <div className="px-4 py-3 border-b border-gray-100 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-gray-900">{chatTitle}</h3>
                  </div>
                  <button
                    onClick={() => setIsChatOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Chat Content - Flexible container for messages and input */}
              <div className="flex-1 flex flex-col min-h-0 overflow-hidden pb-16">
                <CopilotChat
                  className="h-full flex flex-col"
                  labels={{
                    initial: initialLabel,
                  }}
                />
              </div>
            </div>

            {/* Backdrop */}
            {isChatOpen && (
              <div
                className="fixed inset-0 z-30"
                onClick={() => setIsChatOpen(false)}
              />
            )}
          </>
        ) : (
          <CopilotSidebar
            defaultOpen={true}
            labels={{
              title: chatTitle,
              initial: initialLabel,
            }}
            clickOutsideToClose={false}
          />
        )}
      </div>
    </CopilotKit>
  );
}

enum VisualizationType {
  BAR_CHART = "Bar Chart",
  LINE_CHART = "Line Chart",
  PIE_CHART = "Pie Chart",
  KPI_CARD = "KPI Card",
  TABLE = "Data Table",
}

enum TimeRange {
  LastMonth = "Last Month",
  LastQuarter = "Last Quarter",
  LastYear = "Last Year",
  YTD = "Year to Date",
  AllTime = "All Time",
}

const timeRangeValues = [
  { label: TimeRange.LastMonth, value: 0 },
  { label: TimeRange.LastQuarter, value: 1 },
  { label: TimeRange.LastYear, value: 2 },
  { label: TimeRange.YTD, value: 3 },
  { label: TimeRange.AllTime, value: 4 },
];

const industryOptions = [
  "SaaS",
  "Fintech",
  "Healthcare",
  "E-commerce",
  "AI/ML",
  "Consumer",
  "Enterprise",
  "Biotech"
];

interface DataPoint {
  label: string;
  value: number;
  category?: string;
}

interface VCVisualization {
  title: string;
  type: VisualizationType;
  time_range: TimeRange;
  industry_filters: string[];
  data_points: DataPoint[];
  insights: string[];
}

interface VCVisualizationAgentState {
  visualization: VCVisualization;
}

const INITIAL_STATE: VCVisualizationAgentState = {
  visualization: {
    title: "VC Investment Analysis",
    type: VisualizationType.BAR_CHART,
    time_range: TimeRange.LastYear,
    industry_filters: [],
    data_points: [
      { label: "SaaS", value: 2847, category: "Funding ($M)" },
      { label: "Fintech", value: 1234, category: "Funding ($M)" },
      { label: "Healthcare", value: 987, category: "Funding ($M)" },
      { label: "E-commerce", value: 765, category: "Funding ($M)" },
    ],
    insights: ["SaaS continues to dominate VC funding with $2.8B invested", "Fintech shows strong growth with 45% YoY increase"],
  },
};

function VCVisualization() {
  const { state: agentState, setState: setAgentState } = useCoAgent<VCVisualizationAgentState>({
    name: "vc_assistant",
    initialState: INITIAL_STATE,
  });

  // Temporarily removed - will be added after state setup

  const [visualization, setVisualization] = useState(INITIAL_STATE.visualization);
  const { appendMessage, isLoading } = useCopilotChat();
  const [editingInsightIndex, setEditingInsightIndex] = useState<number | null>(null);
  const newInsightRef = useRef<HTMLTextAreaElement>(null);

  const updateVisualization = (partialVisualization: Partial<VCVisualization>) => {
    setAgentState({
      ...agentState,
      visualization: {
        ...visualization,
        ...partialVisualization,
      },
    });
    setVisualization({
      ...visualization,
      ...partialVisualization,
    });
  };

  const newVisualizationState = { ...visualization };
  const newChangedKeys = [];
  const changedKeysRef = useRef<string[]>([]);

  for (const key in visualization) {
    if (
      agentState &&
      agentState.visualization &&
      (agentState.visualization as any)[key] !== undefined &&
      (agentState.visualization as any)[key] !== null
    ) {
      let agentValue = (agentState.visualization as any)[key];
      const visualizationValue = (visualization as any)[key];

      // Check if agentValue is a string and replace \n with actual newlines
      if (typeof agentValue === "string") {
        agentValue = agentValue.replace(/\\n/g, "\n");
      }

      if (JSON.stringify(agentValue) !== JSON.stringify(visualizationValue)) {
        (newVisualizationState as any)[key] = agentValue;
        newChangedKeys.push(key);
      }
    }
  }

  if (newChangedKeys.length > 0) {
    changedKeysRef.current = newChangedKeys;
  } else if (!isLoading) {
    changedKeysRef.current = [];
  }

  useEffect(() => {
    setVisualization(newVisualizationState);
  }, [JSON.stringify(newVisualizationState)]);

  // CopilotKit Action for VC Visualizations
  useCopilotAction({
    name: "generateVisualization",
    description: `Generate VC data visualization based on user's request. Context: ${JSON.stringify(agentState)}. If you created/modified visualization, describe what you did in one sentence.`,
    parameters: [
      {
        name: "visualization",
        type: "object",
        attributes: [
          {
            name: "title",
            type: "string",
            description: "The title of the visualization"
          },
          {
            name: "type",
            type: "string",
            description: "The type of visualization",
            enum: Object.values(VisualizationType)
          },
          {
            name: "time_range",
            type: "string",
            description: "The time range for analysis",
            enum: Object.values(TimeRange)
          },
          {
            name: "industry_filters",
            type: "string[]",
            enum: industryOptions
          },
          {
            name: "data_points",
            type: "object[]",
            attributes: [
              {
                name: "label",
                type: "string",
                description: "The label for this data point"
              },
              {
                name: "value",
                type: "number",
                description: "The numeric value"
              },
              {
                name: "category",
                type: "string",
                description: "Optional category"
              }
            ]
          },
          {
            name: "insights",
            type: "string[]",
            description: "Key insights from the data"
          }
        ]
      }
    ],
    render: ({args}) => {
      useEffect(() => {
        console.log(args, "args.visualization")
        updateVisualization(args?.visualization || {})
      }, [args.visualization])
      return <></>
    }
  })

  // AG UI Action for rendering template-based components
  useCopilotAction({
    name: "renderVCComponent",
    description: "Render VC data components using AG UI templates for rich visual responses",
    parameters: [
      {
        name: "component",
        type: "string",
        description: "The component template to render",
        enum: ["VisualizationTemplate", "KPITemplate", "TableTemplate", "FormTemplate", "DashboardTemplate"]
      },
      {
        name: "data",
        type: "object",
        description: "The data to pass to the component template"
      }
    ],
    render: ({args}) => {
      if (!args?.component || !args?.data) return null;
      
      const ComponentResolver = dynamic(() => import('@/components/ComponentResolver'), { ssr: false });
      
      return <ComponentResolver componentData={{ component: args.component, data: args.data }} />;
    }
  })

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateVisualization({
      title: event.target.value,
    });
  };

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateVisualization({
      type: event.target.value as VisualizationType,
    });
  };

  const handleIndustryFilterChange = (industry: string, checked: boolean) => {
    if (checked) {
      updateVisualization({
        industry_filters: [...visualization.industry_filters, industry],
      });
    } else {
      updateVisualization({
        industry_filters: visualization.industry_filters.filter((i) => i !== industry),
      });
    }
  };

  const handleTimeRangeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    updateVisualization({
      time_range: timeRangeValues[Number(event.target.value)].label,
    });
  };

  const addDataPoint = () => {
    updateVisualization({
      data_points: [...visualization.data_points, { label: "", value: 0, category: "" }],
    });
  };

  const updateDataPoint = (index: number, field: keyof DataPoint, value: string | number) => {
    const updatedDataPoints = [...visualization.data_points];
    updatedDataPoints[index] = {
      ...updatedDataPoints[index],
      [field]: field === 'value' ? Number(value) : value,
    };
    updateVisualization({ data_points: updatedDataPoints });
  };

  const removeDataPoint = (index: number) => {
    const updatedDataPoints = [...visualization.data_points];
    updatedDataPoints.splice(index, 1);
    updateVisualization({ data_points: updatedDataPoints });
  };

  const addInsight = () => {
    const newIndex = visualization.insights.length;
    updateVisualization({
      insights: [...visualization.insights, ""],
    });
    // Set the new insight as the editing one
    setEditingInsightIndex(newIndex);

    // Focus the new insight after render
    setTimeout(() => {
      const textareas = document.querySelectorAll(".insights-container textarea");
      const newTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement;
      if (newTextarea) {
        newTextarea.focus();
      }
    }, 50);
  };

  const updateInsight = (index: number, value: string) => {
    const updatedInsights = [...visualization.insights];
    updatedInsights[index] = value;
    updateVisualization({ insights: updatedInsights });
  };

  const removeInsight = (index: number) => {
    const updatedInsights = [...visualization.insights];
    updatedInsights.splice(index, 1);
    updateVisualization({ insights: updatedInsights });
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      {/* Header Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-blue-600" />
            <input
              type="text"
              value={visualization.title || ""}
              onChange={handleTitleChange}
              className="bg-transparent border-none outline-none text-2xl font-semibold text-gray-900"
            />
          </CardTitle>
          <CardDescription>
            Analyze venture capital investment data with AI-powered insights
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-gray-500" />
              <Select
                value={timeRangeValues.find((t) => t.label === visualization.time_range)?.value.toString() || "2"}
                onValueChange={(value) => {
                  const selectedTimeRange = timeRangeValues[Number(value)];
                  updateVisualization({ time_range: selectedTimeRange.label });
                }}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeValues.map((time) => (
                    <SelectItem key={time.value} value={time.value.toString()}>
                      {time.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-gray-500" />
              <Select
                value={visualization.type}
                onValueChange={(value) => updateVisualization({ type: value as VisualizationType })}
              >
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(VisualizationType).map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Industry Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Industry Filters</CardTitle>
          <CardDescription>
            Select industries to focus your analysis
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {industryOptions.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={option}
                  checked={visualization.industry_filters.includes(option)}
                  onCheckedChange={(checked) => {
                    handleIndustryFilterChange(option, checked as boolean);
                  }}
                />
                <label
                  htmlFor={option}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {option}
                </label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Data Points */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Data Points</CardTitle>
              <CardDescription>
                Manage your investment data points
              </CardDescription>
            </div>
            <Button onClick={addDataPoint} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Data Point
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visualization.data_points.map((dataPoint, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company/Industry</label>
                  <input
                    type="text"
                    value={dataPoint.label || ""}
                    onChange={(e) => updateDataPoint(index, "label", e.target.value)}
                    placeholder="e.g., OpenAI"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Funding ($M)</label>
                  <input
                    type="number"
                    value={dataPoint.value || 0}
                    onChange={(e) => updateDataPoint(index, "value", e.target.value)}
                    placeholder="1000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="space-y-2 flex items-end">
                  <div className="flex-1">
                    <label className="text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      value={dataPoint.category || ""}
                      onChange={(e) => updateDataPoint(index, "category", e.target.value)}
                      placeholder="e.g., AI/ML"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeDataPoint(index)}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Visualization</CardTitle>
          <CardDescription>
            Interactive chart showing your investment data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96 w-full">
            <ChartRenderer 
              type={visualization.type} 
              data_points={visualization.data_points} 
            />
          </div>
        </CardContent>
      </Card>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Key Insights</CardTitle>
              <CardDescription>
                Important findings from your analysis
              </CardDescription>
            </div>
            <Button onClick={addInsight} variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Insight
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visualization.insights.map((insight, index) => (
              <div key={index} className="flex gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold">
                  {index + 1}
                </div>
                <div className="flex-1 relative">
                  <textarea
                    value={insight || ""}
                    onChange={(e) => updateInsight(index, e.target.value)}
                    placeholder="Enter key insight..."
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={2}
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeInsight(index)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={isLoading}
          onClick={() => {
            if (!isLoading) {
              appendMessage(
                new TextMessage({
                  content: "Generate visualization",
                  role: Role.User,
                }),
              );
            }
          }}
        >
          {isLoading ? "Please Wait..." : "Generate Visualization"}
        </Button>
      </div>
    </div>
  );
}

function Ping() {
  return (
    <span className="ping-animation">
      <span className="ping-circle"></span>
      <span className="ping-dot"></span>
    </span>
  );
}