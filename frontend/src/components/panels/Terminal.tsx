import { useEffect, useRef, useState } from "react";
import { Play, Square, Terminal as TerminalIcon } from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";
import {
  getWebContainer,
  mountProjectFiles,
  spawnCommand,
} from "../../services/webcontainer";

export default function TerminalPanel() {
  const { files, currentProject } = useProjectStore();
  const [isBooting, setIsBooting] = useState(true);
  const [isReady, setIsReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [command, setCommand] = useState("");
  const [lines, setLines] = useState<string[]>([
    "WebContainer terminal initialized",
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const logRef = useRef<HTMLDivElement | null>(null);
  const outputBufferRef = useRef("");
  const lastMountedProjectId = useRef<string | null>(null);
  const processRef = useRef<any>(null);
  const inputWriterRef = useRef<WritableStreamDefaultWriter<string> | null>(null);

  const appendLine = (text: string) =>
    setLines((prev) => [...prev, text]);

  useEffect(() => {
    let canceled = false;

    const boot = async () => {
      setIsBooting(true);
      setError(null);

      try {
        await getWebContainer();
        if (canceled) return;
        setIsReady(true);
      } catch (err) {
        if (!canceled) {
          setError("Failed to boot WebContainer. Check console for details.");
        }
      } finally {
        if (!canceled) setIsBooting(false);
      }
    };

    boot();
    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;

    const syncFiles = async () => {
      if (!isReady || !currentProject) return;

      try {
        await mountProjectFiles(files);
        if (!canceled && lastMountedProjectId.current !== currentProject.id) {
          appendLine(`Mounted files for ${currentProject.name}`);
          lastMountedProjectId.current = currentProject.id;
        }
      } catch (err) {
        if (!canceled) {
          setError("Failed to mount project files.");
        }
      }
    };

    syncFiles();
    return () => {
      canceled = true;
    };
  }, [files, currentProject, isReady]);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [lines]);

  const handleOutput = (chunk: string) => {
    outputBufferRef.current += chunk;
    const segments = outputBufferRef.current.split(/\r?\n/);
    outputBufferRef.current = segments.pop() ?? "";
    if (segments.length > 0) {
      setLines((prev) => [...prev, ...segments]);
    }
  };

  const addToHistory = (commandText: string) => {
    setHistory((prev) => [...prev, commandText]);
    setHistoryIndex(null);
  };

  const startProcess = async (
    commandText: string,
    options?: { env?: Record<string, string | number | boolean> }
  ) => {
    setIsRunning(true);
    appendLine(`$ ${commandText}`);

    try {
      const process = await spawnCommand(commandText, options);
      if (!process) {
        setIsRunning(false);
        return null;
      }

      processRef.current = process;
      inputWriterRef.current = process.input.getWriter();

      process.output
        .pipeTo(
          new WritableStream({
            write(data) {
              handleOutput(data as string);
            },
          })
        )
        .catch(() => {
          // Ignore stream close errors from terminated processes.
        });

      const exitCode = await process.exit;
      if (outputBufferRef.current.length > 0) {
        appendLine(outputBufferRef.current);
        outputBufferRef.current = "";
      }
      appendLine(`exit ${exitCode}`);
      return exitCode;
    } catch (err) {
      appendLine("Command failed to run.");
      return null;
    } finally {
      inputWriterRef.current?.releaseLock();
      inputWriterRef.current = null;
      processRef.current = null;
      setIsRunning(false);
    }
  };

  const handleRun = async () => {
    if (!isReady) return;

    const commandText = command;
    setCommand("");

    if (isRunning && processRef.current && inputWriterRef.current) {
      appendLine(commandText);
      try {
        await inputWriterRef.current.write(`${commandText}\n`);
      } catch {
        appendLine("Failed to send input.");
      }
      return;
    }

    if (!commandText.trim()) return;

    addToHistory(commandText);
    await startProcess(commandText);
  };

  const handleInterrupt = () => {
    if (!processRef.current) return;
    appendLine("^C");
    try {
      processRef.current.kill();
    } catch {
      // Ignore kill errors.
    }
  };

  const runViteScaffold = async () => {
    if (!isReady || isRunning) return;
    const exitCode = await startProcess(
      "npm create vite@latest . -- --template react-ts",
      { env: { npm_config_yes: "true" } }
    );
    if (exitCode === 0) {
      await startProcess("npm install");
    }
  };

  return (
    <div
      className="flex flex-col h-full overflow-hidden"
      style={{ backgroundColor: "var(--color-bg-primary)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-[30px] border-b text-[11px] font-medium uppercase tracking-wider shrink-0"
        style={{
          borderColor: "var(--color-border-default)",
          color: "var(--color-text-tertiary)",
          backgroundColor: "var(--color-bg-secondary)",
        }}
      >
        <div className="flex items-center gap-2">
          <TerminalIcon size={12} />
          Terminal
        </div>
        <div className="text-[10px] normal-case tracking-normal">
          {isBooting && "Booting"}
          {!isBooting && isReady && "Ready"}
          {!isBooting && !isReady && "Offline"}
        </div>
      </div>

      {/* Terminal Output */}
      <div
        ref={logRef}
        className="flex-1 overflow-y-auto px-3 py-2 space-y-1"
        style={{ fontFamily: "var(--font-mono)", fontSize: "12px" }}
      >
        {lines.map((line, index) => (
          <div
            key={`${line}-${index}`}
            style={{ color: "var(--color-text-secondary)" }}
          >
            {line}
          </div>
        ))}
        {error && (
          <div style={{ color: "var(--color-accent-red)" }}>{error}</div>
        )}
      </div>

      {/* Terminal Input */}
      <div
        className="flex items-center gap-2 px-3 py-2 border-t"
        style={{ borderColor: "var(--color-border-default)" }}
      >
        <span style={{ color: "var(--color-accent-cyan)" }}>❯</span>
        <input
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key.toLowerCase() === "c") {
              e.preventDefault();
              handleInterrupt();
              return;
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              if (history.length === 0) return;
              const nextIndex =
                historyIndex === null
                  ? history.length - 1
                  : Math.max(0, historyIndex - 1);
              setHistoryIndex(nextIndex);
              setCommand(history[nextIndex] || "");
              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();
              if (historyIndex === null) return;
              const nextIndex = historyIndex + 1;
              if (nextIndex >= history.length) {
                setHistoryIndex(null);
                setCommand("");
              } else {
                setHistoryIndex(nextIndex);
                setCommand(history[nextIndex] || "");
              }
              return;
            }

            if (e.key === "Enter") handleRun();
          }}
          placeholder={
            currentProject
              ? "Type a command (e.g., ls, npm install)"
              : "Open a project to mount files"
          }
          disabled={!isReady}
          className="flex-1 bg-transparent outline-none text-xs"
          style={{ color: "var(--color-text-primary)" }}
        />
        <button
          onClick={runViteScaffold}
          disabled={!isReady || isRunning}
          className="px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider border"
          style={{
            color: "var(--color-text-tertiary)",
            borderColor: "var(--color-border-default)",
            backgroundColor: "var(--color-bg-secondary)",
          }}
          title="Create Vite React TS + install dependencies"
        >
          Vite React TS
        </button>
        <button
          onClick={handleInterrupt}
          disabled={!isRunning}
          className="p-1 rounded transition-colors"
          style={{
            color: isRunning
              ? "var(--color-accent-red)"
              : "var(--color-text-muted)",
          }}
          title="Stop (Ctrl+C)"
        >
          <Square size={12} />
        </button>
        <button
          onClick={handleRun}
          disabled={!isReady || !command.trim()}
          className="p-1 rounded transition-colors"
          style={{
            color: command.trim()
              ? "var(--color-text-primary)"
              : "var(--color-text-muted)",
          }}
          title="Run"
        >
          <Play size={14} />
        </button>
      </div>
    </div>
  );
}
