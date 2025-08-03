"use client";
import { CopilotKit, useCoAgent, useCopilotAction, useCopilotChat } from "@copilotkit/react-core";
import { CopilotChat, CopilotSidebar } from "@copilotkit/react-ui";
import React, { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import "@copilotkit/react-ui/styles.css";
import "./vc-dashboard.css";
import "./charts.css";
import "./templates.css";
import { useMobileView } from "@/utils/use-mobile-view";
import { useMobileChat } from "@/utils/use-mobile-chat";
import { ChartRenderer } from "@/components/charts";

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
      <div
        className="min-h-screen w-full flex items-center justify-center"
        style={
          {
            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
            backgroundAttachment: "fixed",
          } as React.CSSProperties
        }
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
    <form className="vc-dashboard">
      {/* Visualization Title */}
      <div className="vc-header">
        <input
          type="text"
          value={visualization.title || ""}
          onChange={handleTitleChange}
          className="vc-title-input"
        />

        <div className="vc-meta">
          <div className="meta-item">
            <span className="meta-icon">📅</span>
            <select
              className="meta-select"
              value={timeRangeValues.find((t) => t.label === visualization.time_range)?.value || 2}
              onChange={handleTimeRangeChange}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0px center",
                backgroundSize: "12px",
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              {timeRangeValues.map((time) => (
                <option key={time.value} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>

          <div className="meta-item">
            <span className="meta-icon">📊</span>
            <select
              className="meta-select"
              value={visualization.type}
              onChange={handleTypeChange}
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23555' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0px center",
                backgroundSize: "12px",
                appearance: "none",
                WebkitAppearance: "none",
              }}
            >
              {Object.values(VisualizationType).map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Industry Filters */}
      <div className="section-container relative">
        {changedKeysRef.current.includes("industry_filters") && <Ping />}
        <h2 className="section-title">Industry Filters</h2>
        <div className="industry-filters">
          {industryOptions.map((option) => (
            <label key={option} className="industry-option">
              <input
                type="checkbox"
                checked={visualization.industry_filters.includes(option)}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleIndustryFilterChange(option, e.target.checked)
                }
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Data Points */}
      <div className="section-container relative">
        {changedKeysRef.current.includes("data_points") && <Ping />}
        <div className="section-header">
          <h2 className="section-title">Data Points</h2>
          <button type="button" className="add-button" onClick={addDataPoint}>
            + Add Data Point
          </button>
        </div>
        <div className="data-points-container">
          {visualization.data_points.map((dataPoint, index) => (
            <div key={index} className="data-point-card">
              <div className="data-point-content">
                <input
                  type="text"
                  value={dataPoint.label || ""}
                  onChange={(e) => updateDataPoint(index, "label", e.target.value)}
                  placeholder="Data label"
                  className="data-point-label-input"
                />
                <input
                  type="number"
                  value={dataPoint.value || 0}
                  onChange={(e) => updateDataPoint(index, "value", e.target.value)}
                  placeholder="Value"
                  className="data-point-value-input"
                />
                <input
                  type="text"
                  value={dataPoint.category || ""}
                  onChange={(e) => updateDataPoint(index, "category", e.target.value)}
                  placeholder="Category"
                  className="data-point-category-input"
                />
              </div>
              <button
                type="button"
                className="remove-button"
                onClick={() => removeDataPoint(index)}
                aria-label="Remove ingredient"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="section-container relative">
        <div className="chart-container">
          <h2 className="section-title">Visualization</h2>
          <div className="chart-placeholder">
            <ChartRenderer 
              type={visualization.type} 
              data_points={visualization.data_points} 
            />
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="section-container relative">
        {changedKeysRef.current.includes("insights") && <Ping />}
        <div className="section-header">
          <h2 className="section-title">Key Insights</h2>
          <button type="button" className="add-step-button" onClick={addInsight}>
            + Add Insight
          </button>
        </div>
        <div className="insights-container">
          {visualization.insights.map((insight, index) => (
            <div key={index} className="insight-item">
              {/* Number Circle */}
              <div className="insight-number">{index + 1}</div>

              {/* Vertical Line */}
              {index < visualization.insights.length - 1 && <div className="insight-line" />}

              {/* Instruction Content */}
              <div
                className={`insight-content ${
                  editingInsightIndex === index
                    ? "insight-content-editing"
                    : "insight-content-default"
                }`}
                onClick={() => setEditingInsightIndex(index)}
              >
                <textarea
                  className="insight-textarea"
                  value={insight || ""}
                  onChange={(e) => updateInsight(index, e.target.value)}
                  placeholder={!insight ? "Enter key insight..." : ""}
                  onFocus={() => setEditingInsightIndex(index)}
                  onBlur={(e) => {
                    // Only blur if clicking outside this instruction
                    if (!e.relatedTarget || !e.currentTarget.contains(e.relatedTarget as Node)) {
                      setEditingInsightIndex(null);
                    }
                  }}
                />

                {/* Delete Button (only visible on hover) */}
                <button
                  type="button"
                  className={`insight-delete-btn ${
                    editingInsightIndex === index
                      ? "insight-delete-btn-editing"
                      : "insight-delete-btn-default"
                  } remove-button`}
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent triggering parent onClick
                    removeInsight(index);
                  }}
                  aria-label="Remove instruction"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Generate Visualization Button */}
      <div className="action-container">
        <button
          className={isLoading ? "generate-button loading" : "generate-button"}
          type="button"
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
          disabled={isLoading}
        >
          {isLoading ? "Please Wait..." : "Generate Visualization"}
        </button>
      </div>
    </form>
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