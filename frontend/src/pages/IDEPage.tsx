import { useEffect } from "react";
import Topbar from "../components/layout/Topbar";
import Sidebar from "../components/layout/Sidebar";
import StatusBar from "../components/layout/StatusBar";
import EditorTabs from "../components/editor/EditorTabs";
import CodeEditor from "../components/editor/CodeEditor";
import FileExplorer from "../components/panels/FileExplorer";
import AIChat from "../components/panels/AIChat";
import GitPanel from "../components/panels/GitPanel";
import SearchPanel from "../components/panels/SearchPanel";
import TerminalPanel from "../components/panels/Terminal";
import LoginModal from "../components/modals/LoginModal";
import NewProjectModal from "../components/modals/NewProjectModal";
import NewFileModal from "../components/modals/NewFileModal";
import { useUIStore } from "../stores/uiStore";
import { useProjectStore } from "../stores/projectStore";

export default function IDEPage() {
  const { sidePanel, showTerminal, sidePanelWidth, terminalHeight } =
    useUIStore();
  const { currentProject, loadProjects, createProject, loadProject } =
    useProjectStore();

  // Initialize: load or create a project
  useEffect(() => {
    const init = async () => {
      try {
        await loadProjects();
        const state = useProjectStore.getState();

        if (state.projects.length > 0) {
          await loadProject(state.projects[0].id);
        } else {
          // Auto-create a starter project for guests
          const project = await createProject("Untitled Project");
          await loadProject(project.id);
        }
      } catch {
        // If backend is not running, still show UI
        console.warn("Backend not available — running in offline mode");
      }
    };
    init();
  }, []);

  const renderSidePanel = () => {
    switch (sidePanel) {
      case "explorer":
        return <FileExplorer />;
      case "search":
        return <SearchPanel />;
      case "git":
        return <GitPanel />;
      case "ai":
        return <AIChat />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Topbar />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Side Panel */}
        {sidePanel && (
          <div
            className="shrink-0 overflow-hidden border-r"
            style={{
              width: `${sidePanelWidth}px`,
              borderColor: "var(--color-border-default)",
            }}
          >
            {renderSidePanel()}
          </div>
        )}

        {/* Main Content */}
        <div className="flex flex-col flex-1 overflow-hidden">
          {/* Editor Area */}
          <div className="flex flex-col flex-1 overflow-hidden">
            <EditorTabs />
            <CodeEditor />
          </div>

          {/* Terminal */}
          {showTerminal && (
            <>
              <div
                className="resize-handle resize-handle-v"
                style={{ backgroundColor: "var(--color-border-default)" }}
              />
              <div
                className="shrink-0 overflow-hidden"
                style={{ height: `${terminalHeight}px` }}
              >
                <TerminalPanel />
              </div>
            </>
          )}
        </div>
      </div>

      <StatusBar />

      {/* Modals */}
      <LoginModal />
      <NewProjectModal />
      <NewFileModal />
    </div>
  );
}
