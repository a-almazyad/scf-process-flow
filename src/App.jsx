import { useEffect, useMemo, useRef, useState } from "react";
import {
  Background,
  Controls,
  Handle,
  MarkerType,
  Panel,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useReactFlow,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  IconArrowsMaximize,
  IconAlertTriangle,
  IconBook2,
  IconBuildingBank,
  IconCheck,
  IconChevronRight,
  IconCircleCheck,
  IconCpu,
  IconFileDescription,
  IconHelp,
  IconLayoutGrid,
  IconLock,
  IconMail,
  IconMaximize,
  IconMessageDots,
  IconMinimize,
  IconPercentage,
  IconReportMoney,
  IconRoute,
  IconSearch,
  IconSend,
  IconShieldCheck,
  IconShoppingBag,
  IconShoppingCart,
  IconSparkles,
  IconTransfer,
  IconUser,
  IconUserPlus,
  IconUsers,
  IconWallet,
  IconX,
} from "@tabler/icons-react";
import { workflows } from "./workflows.js";

const iconMap = {
  bank: IconBuildingBank,
  book: IconBook2,
  check: IconCircleCheck,
  cpu: IconCpu,
  file: IconFileDescription,
  lock: IconLock,
  mail: IconMail,
  percent: IconPercentage,
  route: IconRoute,
  send: IconSend,
  shield: IconShieldCheck,
  shoppingBag: IconShoppingBag,
  shoppingCart: IconShoppingCart,
  transfer: IconTransfer,
  user: IconUser,
  userPlus: IconUserPlus,
  users: IconUsers,
  wallet: IconWallet,
  money: IconReportMoney,
};

function LaneNode({ data }) {
  const LaneIcon = iconMap[data.icon] || IconLayoutGrid;
  const hasLongLabel = data.label.length > 16;
  return (
    <div className="lane-node" style={{ "--lane": data.color, "--lane-soft": data.soft }}>
      <div className={`lane-rail ${hasLongLabel ? "lane-rail--long" : ""}`}>
        <LaneIcon size={15} stroke={1.8} aria-hidden="true" />
        <span title={data.label}>{data.label}</span>
      </div>
    </div>
  );
}

function TaskNode({ data, selected }) {
  const Icon = iconMap[data.icon] || IconFileDescription;
  const isEvent = data.kind === "start" || data.kind === "end" || data.kind === "event";
  const isGateway = data.kind === "gateway";

  return (
    <div
      className={`flow-node ${isEvent ? "flow-node--event" : ""} ${isGateway ? "flow-node--gateway" : ""} ${data.challenge ? "flow-node--challenge" : ""} ${data.changeType ? `flow-node--${data.changeType}` : ""} ${selected ? "is-selected" : ""}`}
      style={{ "--accent": data.color || "#7b8494" }}
    >
      <Handle id="in-left" type="target" position={Position.Left} />
      <Handle id="in-top" type="target" position={Position.Top} />
      <Handle id="in-bottom" type="target" position={Position.Bottom} />
      <Handle id="in-right" type="target" position={Position.Right} />
      <Handle id="out-right" type="source" position={Position.Right} />
      <Handle id="out-bottom" type="source" position={Position.Bottom} />
      <Handle id="out-top" type="source" position={Position.Top} />
      <Handle id="out-left" type="source" position={Position.Left} />

      {data.challenge && (
        <span className="node-alert" title={data.challenge} aria-label={`Current challenge: ${data.challenge}`}>
          <IconAlertTriangle size={13} stroke={2.2} />
        </span>
      )}

      {isGateway ? (
        <div className="gateway-shape"><IconHelp size={18} stroke={2} /></div>
      ) : (
        <div className="node-icon"><Icon size={17} stroke={1.9} /></div>
      )}
      <div className="node-copy">
        <span className="node-label">{data.label}</span>
        {data.note && <span className="node-note">{data.note}</span>}
      </div>
    </div>
  );
}

const nodeTypes = { lane: LaneNode, task: TaskNode };

function edgeStyle(edge) {
  const isMessage = edge.data?.kind === "message";
  return {
    ...edge,
    type: "smoothstep",
    pathOptions: { borderRadius: 8, offset: 6 },
    markerEnd: {
      type: isMessage ? MarkerType.Arrow : MarkerType.ArrowClosed,
      width: 15,
      height: 15,
      color: isMessage ? "#7c8491" : "#454c58",
    },
    style: {
      stroke: isMessage ? "#7c8491" : "#454c58",
      strokeWidth: isMessage ? 1.45 : 1.6,
      strokeDasharray: isMessage ? "7 6" : undefined,
    },
    labelStyle: { fill: "#596170", fontSize: 11, fontWeight: 650 },
    labelBgStyle: { fill: "#ffffff", fillOpacity: 0.94 },
    labelBgPadding: [5, 3],
    labelBgBorderRadius: 4,
  };
}

function CanvasToolbar({ showMessages, setShowMessages, isFullscreen, onToggleFullscreen }) {
  const { fitView } = useReactFlow();

  useEffect(() => {
    const fitTimer = window.setTimeout(
      () => fitView({ padding: isFullscreen ? 0.035 : 0.08, duration: 450 }),
      80,
    );
    return () => window.clearTimeout(fitTimer);
  }, [fitView, isFullscreen]);

  return (
    <Panel position="top-right" className="canvas-toolbar">
      <button
        type="button"
        className={showMessages ? "is-active" : ""}
        onClick={() => setShowMessages((value) => !value)}
        aria-pressed={showMessages}
      >
        <IconMessageDots size={16} />
        Messages
      </button>
      <button type="button" onClick={() => fitView({ padding: 0.08, duration: 450 })}>
        <IconArrowsMaximize size={16} />
        Fit
      </button>
      <button
        type="button"
        className={isFullscreen ? "is-active" : ""}
        onClick={onToggleFullscreen}
        aria-label={isFullscreen ? "Exit full screen" : "View workflow full screen"}
        aria-pressed={isFullscreen}
      >
        {isFullscreen ? <IconMinimize size={16} /> : <IconMaximize size={16} />}
        {isFullscreen ? "Exit" : "Full screen"}
      </button>
    </Panel>
  );
}

function ProcessCanvas({ workflow }) {
  const [selected, setSelected] = useState(null);
  const [showMessages, setShowMessages] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const canvasShellRef = useRef(null);

  const leaveFullscreen = () => {
    setIsFullscreen(false);
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  const toggleFullscreen = () => {
    if (isFullscreen) {
      leaveFullscreen();
      return;
    }

    setIsFullscreen(true);
    canvasShellRef.current?.requestFullscreen?.().catch(() => {});
  };

  useEffect(() => {
    if (!isFullscreen) return undefined;

    const exitOnEscape = (event) => {
      if (event.key === "Escape") leaveFullscreen();
    };
    const syncNativeFullscreen = () => {
      if (!document.fullscreenElement) setIsFullscreen(false);
    };

    document.body.classList.add("is-workflow-fullscreen");
    document.addEventListener("keydown", exitOnEscape);
    document.addEventListener("fullscreenchange", syncNativeFullscreen);
    return () => {
      document.body.classList.remove("is-workflow-fullscreen");
      document.removeEventListener("keydown", exitOnEscape);
      document.removeEventListener("fullscreenchange", syncNativeFullscreen);
    };
  }, [isFullscreen]);

  const nodes = useMemo(
    () => workflow.nodes.map((node) => ({ ...node, selected: node.id === selected?.id })),
    [workflow, selected],
  );
  const edges = useMemo(
    () => workflow.edges
      .filter((edge) => showMessages || edge.data?.kind !== "message")
      .map(edgeStyle),
    [workflow, showMessages],
  );

  return (
    <div ref={canvasShellRef} className={`canvas-shell ${isFullscreen ? "is-fullscreen" : ""}`}>
      <ReactFlowProvider>
        <ReactFlow
          key={workflow.id}
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable
          panOnDrag
          zoomOnScroll={false}
          zoomOnPinch
          fitView
          fitViewOptions={{ padding: 0.08, minZoom: 0.24, maxZoom: 0.88 }}
          minZoom={0.18}
          maxZoom={1.35}
          onPaneClick={() => setSelected(null)}
          onNodeClick={(_, node) => node.type === "task" && setSelected(node)}
          aria-label={`${workflow.title} workflow diagram`}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e2e6eb" gap={24} size={1} />
          <Controls showInteractive={false} position="bottom-left" />
          <CanvasToolbar
            showMessages={showMessages}
            setShowMessages={setShowMessages}
            isFullscreen={isFullscreen}
            onToggleFullscreen={toggleFullscreen}
          />
        </ReactFlow>
      </ReactFlowProvider>

      <div className={`step-drawer ${selected ? "is-open" : ""}`} aria-hidden={!selected}>
        {selected && (
          <>
            <button className="drawer-close" type="button" onClick={() => setSelected(null)} aria-label="Close step details">
              <IconX size={17} />
            </button>
            <div className="drawer-kicker">{selected.data.owner} · {selected.data.kind === "gateway" ? "Decision" : "Process step"}</div>
            <h3>{selected.data.label}</h3>
            <p>{selected.data.description || "This step is part of the validated process sequence."}</p>
            {selected.data.challenge && (
              <div className="drawer-callout drawer-callout--risk">
                <IconAlertTriangle size={15} />
                <span><strong>Current challenge</strong>{selected.data.challenge}</span>
              </div>
            )}
            {selected.data.changeType && (
              <div className="drawer-callout drawer-callout--future">
                <IconCircleCheck size={15} />
                <span><strong>Future-state change</strong>{selected.data.changeType === "new" ? "New API-enabled step" : "Simplified supplier journey"}</span>
              </div>
            )}
            <div className="drawer-meta">
              <span style={{ "--dot": selected.data.color }}><i />{selected.data.owner}</span>
              <span>{selected.data.kind}</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function OnboardingComparison({ mode, onChange }) {
  return (
    <div className="onboarding-compare">
      <div className="onboarding-compare__copy">
        <strong>Current vs future onboarding</strong>
        <span>Compare today’s Taulia-first journey with the API-enabled Manafa journey.</span>
      </div>
      <div className="onboarding-switch" role="group" aria-label="Supplier onboarding flow">
        <button type="button" className={mode === "as-is" ? "is-active" : ""} aria-pressed={mode === "as-is"} onClick={() => onChange("as-is")}>
          <span>As-is</span>
          <small>Taulia-first</small>
        </button>
        <button type="button" className={mode === "to-be" ? "is-active" : ""} aria-pressed={mode === "to-be"} onClick={() => onChange("to-be")}>
          <span>To-be</span>
          <small>API-enabled</small>
        </button>
      </div>
    </div>
  );
}

function FlowHighlights({ workflow }) {
  if (!workflow.highlights) return null;
  const isRisk = workflow.tone === "risk";
  const HighlightIcon = isRisk ? IconAlertTriangle : IconCircleCheck;

  return (
    <aside className={`flow-highlights flow-highlights--${workflow.tone}`} aria-label={workflow.highlightTitle}>
      <div className="flow-highlights__intro">
        <HighlightIcon size={20} stroke={2} />
        <div>
          <strong>{workflow.highlightTitle}</strong>
          <span>{workflow.highlightSummary}</span>
        </div>
      </div>
      <div className="flow-highlights__items">
        {workflow.highlights.map((item) => (
          <div key={item.title}>
            <strong>{item.title}</strong>
            <span>{item.body}</span>
          </div>
        ))}
      </div>
      {workflow.assumption && <p>{workflow.assumption}</p>}
    </aside>
  );
}

function Overview({ onOpen }) {
  return (
    <section className="overview" aria-label="SCF workflow overview">
      <div className="overview-intro">
        <div>
          <span className="section-kicker">End-to-end lifecycle</span>
          <h2>Three processes. One continuous financing journey.</h2>
        </div>
        <p>Start with supplier enablement, move through invoice financing, then settle and close the loan.</p>
      </div>

      <div className="journey-line" aria-hidden="true">
        <span className="journey-line__track" />
        {workflows.map((workflow, index) => (
          <span key={workflow.id} className="journey-point" style={{ "--stage": workflow.accent }}>
            <i>{String(index + 1).padStart(2, "0")}</i>
          </span>
        ))}
      </div>

      <div className="process-cards">
        {workflows.map((workflow, index) => (
          <article key={workflow.id} className="process-card" style={{ "--stage": workflow.accent }}>
            <div className="process-card__topline">
              <span>Process {String(index + 1).padStart(2, "0")}</span>
              <workflow.CardIcon size={20} stroke={1.8} />
            </div>
            <h3>{workflow.shortTitle}</h3>
            <p>{workflow.summary}</p>
            <dl>
              <div><dt>{workflow.stepCount}</dt><dd>steps</dd></div>
              <div><dt>{workflow.laneCount}</dt><dd>teams & systems</dd></div>
            </dl>
            <button type="button" onClick={() => onOpen(workflow.id)}>
              Explore process <IconChevronRight size={17} />
            </button>
          </article>
        ))}
      </div>

      <div className="overview-note">
        <IconSparkles size={19} />
        <div>
          <strong>Validated process map</strong>
          <span>Solid lines show work inside a lane. Dashed lines show messages or handoffs across lanes.</span>
        </div>
      </div>
    </section>
  );
}

export function App() {
  const [activeId, setActiveId] = useState("overview");
  const [onboardingMode, setOnboardingMode] = useState("as-is");
  const activeDefinition = workflows.find((workflow) => workflow.id === activeId);
  const activeWorkflow = activeDefinition?.variants?.[onboardingMode] || activeDefinition;

  return (
    <main className="app-shell">
      <header className="site-header">
        <div className="brand-lockup">
          <span className="brand-mark"><IconRoute size={21} stroke={2.1} /></span>
          <span>Manafa</span>
          <i>SCF</i>
        </div>
        <div className="header-meta">
          <span className="status-dot" />
          Validated process map · v2
        </div>
      </header>

      <section className="hero">
        <div>
          <span className="eyebrow">Supply chain finance · operating model</span>
          <h1>From onboarding<br />to settlement.</h1>
        </div>
        <p>A clear, interactive view of the supplier lifecycle—from first invitation through financing, repayment, and loan closure.</p>
      </section>

      <nav className="process-tabs" aria-label="Workflow processes">
        <button className={activeId === "overview" ? "is-active" : ""} onClick={() => setActiveId("overview")}>
          <IconLayoutGrid size={17} /> Overview
        </button>
        {workflows.map((workflow, index) => (
          <button
            key={workflow.id}
            className={activeId === workflow.id ? "is-active" : ""}
            onClick={() => setActiveId(workflow.id)}
            style={{ "--tab": workflow.accent }}
          >
            <span>{String(index + 1).padStart(2, "0")}</span>
            {workflow.tabTitle}
          </button>
        ))}
      </nav>

      {activeWorkflow ? (
        <section className="process-view">
          {activeDefinition?.id === "onboarding" && (
            <OnboardingComparison mode={onboardingMode} onChange={setOnboardingMode} />
          )}
          <div className="process-heading">
            <div>
              <span className="section-kicker" style={{ color: activeWorkflow.accent }}>{activeWorkflow.phase}</span>
              <h2>{activeWorkflow.title}</h2>
              <p>{activeWorkflow.summary}</p>
            </div>
            <div className="process-key">
              <span><i className="line-solid" /> Sequence</span>
              <span><i className="line-dashed" /> Message flow</span>
              <span><i className="shape-diamond" /> Decision</span>
              {activeWorkflow.tone === "risk" && <span><IconAlertTriangle className="key-alert" size={13} /> Current challenge</span>}
            </div>
          </div>
          <FlowHighlights workflow={activeWorkflow} />
          <ProcessCanvas key={activeWorkflow.id} workflow={activeWorkflow} />
          <p className="canvas-help">Drag to pan · pinch or use the controls to zoom · select a step for details</p>
        </section>
      ) : (
        <Overview onOpen={setActiveId} />
      )}

      <footer>
        <span>SCF operating workflow</span>
        <span>Supplier onboarding · Invoice financing · Settlement & closure</span>
      </footer>
    </main>
  );
}
