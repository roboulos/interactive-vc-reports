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
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CalendarDays, BarChart3, Plus, Trash2, MoreHorizontal, ArrowUpDown, Filter } from "lucide-react";

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
    <div className="container mx-auto py-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            <Input
              value={visualization.title || ""}
              onChange={handleTitleChange}
              className="text-3xl font-bold border-none bg-transparent p-0 h-auto shadow-none focus-visible:ring-0"
              placeholder="VC Investment Analysis"
            />
          </h1>
          <p className="text-muted-foreground">
            Analyze venture capital investment data with AI-powered insights
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Select
            value={timeRangeValues.find((t) => t.label === visualization.time_range)?.value.toString() || "2"}
            onValueChange={(value) => {
              const selectedTimeRange = timeRangeValues[Number(value)];
              updateVisualization({ time_range: selectedTimeRange.label });
            }}
          >
            <SelectTrigger className="w-40">
              <CalendarDays className="mr-2 h-4 w-4" />
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
          <Select
            value={visualization.type}
            onValueChange={(value) => updateVisualization({ type: value as VisualizationType })}
          >
            <SelectTrigger className="w-40">
              <BarChart3 className="mr-2 h-4 w-4" />
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

      {/* Filters */}
      <div className="flex items-center py-4 space-x-4">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Industry Filters:</span>
        </div>
        <div className="flex flex-wrap gap-2">
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
      </div>

      {/* Data Table */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Investment Data</h2>
          <Button onClick={addDataPoint} size="sm">
            <Plus className="mr-2 h-4 w-4" />
            Add Investment
          </Button>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">
                  <Button variant="ghost" className="h-auto p-0 font-medium">
                    Company/Industry
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead className="text-right">
                  <Button variant="ghost" className="h-auto p-0 font-medium">
                    Funding ($M)
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  </Button>
                </TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="w-[80px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {visualization.data_points.length ? (
                visualization.data_points.map((dataPoint, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={dataPoint.label || ""}
                        onChange={(e) => updateDataPoint(index, "label", e.target.value)}
                        placeholder="e.g., OpenAI"
                        className="border-none bg-transparent p-0 h-auto shadow-none focus-visible:ring-0"
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Input
                        type="number"
                        value={dataPoint.value || 0}
                        onChange={(e) => updateDataPoint(index, "value", e.target.value)}
                        placeholder="1000"
                        className="border-none bg-transparent p-0 h-auto shadow-none focus-visible:ring-0 text-right"
                      />
                    </TableCell>
                    <TableCell>
                      {dataPoint.category ? (
                        <Badge variant="secondary">{dataPoint.category}</Badge>
                      ) : (
                        <Input
                          value={dataPoint.category || ""}
                          onChange={(e) => updateDataPoint(index, "category", e.target.value)}
                          placeholder="e.g., AI/ML"
                          className="border-none bg-transparent p-0 h-auto shadow-none focus-visible:ring-0"
                        />
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => navigator.clipboard.writeText(dataPoint.label)}
                          >
                            Copy company name
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => removeDataPoint(index)}
                            className="text-red-600"
                          >
                            Delete entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="h-24 text-center">
                    No investment data added yet.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Chart Visualization */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Analysis</CardTitle>
          <CardDescription>
            Interactive visualization of your venture capital data
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
                AI-powered analysis and market intelligence
              </CardDescription>
            </div>
            <Button onClick={addInsight} variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Insight
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {visualization.insights.length > 0 ? (
              visualization.insights.map((insight, index) => (
                <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border bg-card">
                  <Badge variant="outline" className="mt-0.5">
                    {index + 1}
                  </Badge>
                  <div className="flex-1 space-y-2">
                    <textarea
                      value={insight || ""}
                      onChange={(e) => updateInsight(index, e.target.value)}
                      placeholder="Enter key insight about the investment data..."
                      className="w-full min-h-[60px] resize-none border-none bg-transparent p-0 text-sm focus:outline-none"
                    />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => navigator.clipboard.writeText(insight)}
                      >
                        Copy insight
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => removeInsight(index)}
                        className="text-red-600"
                      >
                        Delete insight
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No insights added yet. Click "Add Insight" to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="text-sm text-muted-foreground">
          {visualization.data_points.length} investment{visualization.data_points.length !== 1 ? 's' : ''} • {visualization.insights.length} insight{visualization.insights.length !== 1 ? 's' : ''}
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button
            size="sm"
            disabled={isLoading}
            onClick={() => {
              if (!isLoading) {
                appendMessage(
                  new TextMessage({
                    content: "Generate new insights and improve this analysis",
                    role: Role.User,
                  }),
                );
              }
            }}
          >
            {isLoading ? "Analyzing..." : "✨ Enhance with AI"}
          </Button>
        </div>
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