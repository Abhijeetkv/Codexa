import { useState } from "react";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  FolderPlus,
  RefreshCw,
  MoreHorizontal,
  Trash2,
} from "lucide-react";
import { useProjectStore } from "../../stores/projectStore";
import { useEditorStore } from "../../stores/editorStore";
import { useUIStore } from "../../stores/uiStore";
import { getFileIcon, getFileIconColor } from "../../utils/fileIcons";
import type { FileItem } from "../../api/projects";

interface TreeNode {
  file?: FileItem;
  name: string;
  path: string;
  isDirectory: boolean;
  children: TreeNode[];
}

function buildFileTree(files: FileItem[]): TreeNode[] {
  const root: TreeNode[] = [];

  // Separate dirs and files
  const dirs = files.filter((f) => f.isDirectory);
  const regularFiles = files.filter((f) => !f.isDirectory);

  // Add directories
  dirs.forEach((dir) => {
    root.push({
      file: dir,
      name: dir.name,
      path: dir.path,
      isDirectory: true,
      children: [],
    });
  });

  // Add files to their parent directories or root
  regularFiles.forEach((file) => {
    const pathParts = file.path.split("/");
    if (pathParts.length <= 1) {
      root.push({
        file,
        name: file.name,
        path: file.path,
        isDirectory: false,
        children: [],
      });
    } else {
      const parentPath = pathParts.slice(0, -1).join("/");
      const parentDir = root.find((d) => d.path === parentPath);
      if (parentDir) {
        parentDir.children.push({
          file,
          name: file.name,
          path: file.path,
          isDirectory: false,
          children: [],
        });
      } else {
        root.push({
          file,
          name: file.name,
          path: file.path,
          isDirectory: false,
          children: [],
        });
      }
    }
  });

  // Sort: dirs first, then alphabetically
  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.isDirectory && !b.isDirectory) return -1;
      if (!a.isDirectory && b.isDirectory) return 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((n) => sort(n.children));
  };
  sort(root);

  return root;
}

function FileTreeItem({
  node,
  depth,
}: {
  node: TreeNode;
  depth: number;
}) {
  const [isOpen, setIsOpen] = useState(depth < 2);
  const [showActions, setShowActions] = useState(false);
  const { openFile } = useEditorStore();
  const { activeTabId } = useEditorStore();
  const { deleteFile } = useProjectStore();

  const isActive = node.file?.id === activeTabId;
  const Icon = getFileIcon(node.name, node.isDirectory, isOpen);
  const iconColor = getFileIconColor(node.name, node.isDirectory);

  const handleClick = () => {
    if (node.isDirectory) {
      setIsOpen(!isOpen);
    } else if (node.file) {
      openFile(node.file);
    }
  };

  return (
    <div>
      <div
        className="group flex items-center gap-1 px-2 py-[3px] cursor-pointer transition-colors text-xs"
        style={{
          paddingLeft: `${depth * 12 + 8}px`,
          backgroundColor: isActive
            ? "var(--color-accent-blue-muted)"
            : "transparent",
          color: isActive
            ? "var(--color-text-primary)"
            : "var(--color-text-secondary)",
        }}
        onMouseOver={(e) => {
          if (!isActive)
            e.currentTarget.style.backgroundColor = "var(--color-bg-hover)";
          setShowActions(true);
        }}
        onMouseOut={(e) => {
          if (!isActive)
            e.currentTarget.style.backgroundColor = "transparent";
          setShowActions(false);
        }}
        onClick={handleClick}
      >
        {node.isDirectory ? (
          isOpen ? (
            <ChevronDown
              size={12}
              style={{ color: "var(--color-text-tertiary)" }}
            />
          ) : (
            <ChevronRight
              size={12}
              style={{ color: "var(--color-text-tertiary)" }}
            />
          )
        ) : (
          <span className="w-3" />
        )}
        <Icon
          size={14}
          style={{ color: iconColor, flexShrink: 0 }}
          strokeWidth={1.5}
        />
        <span className="truncate flex-1">{node.name}</span>
        {showActions && node.file && (
          <button
            className="p-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: "var(--color-text-tertiary)" }}
            onClick={(e) => {
              e.stopPropagation();
              if (node.file) deleteFile(node.file.id);
            }}
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
      {node.isDirectory && isOpen && (
        <div className="animate-fade-in">
          {node.children.map((child) => (
            <FileTreeItem key={child.path} node={child} depth={depth + 1} />
          ))}
          {node.children.length === 0 && (
            <div
              className="text-[11px] italic py-1"
              style={{
                paddingLeft: `${(depth + 1) * 12 + 24}px`,
                color: "var(--color-text-muted)",
              }}
            >
              Empty folder
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function FileExplorer() {
  const { files, currentProject, loadFiles } = useProjectStore();
  const { setShowNewFileModal } = useUIStore();

  const tree = buildFileTree(files);

  return (
    <div
      className="flex flex-col h-full overflow-hidden animate-fade-in"
      style={{ backgroundColor: "var(--color-bg-secondary)" }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-3 h-[34px] border-b text-[11px] font-semibold uppercase tracking-wider shrink-0"
        style={{
          borderColor: "var(--color-border-default)",
          color: "var(--color-text-tertiary)",
        }}
      >
        <span>Explorer</span>
        <div className="flex items-center gap-0.5">
          <button
            className="p-1 rounded transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => setShowNewFileModal(true, false)}
            title="New File"
          >
            <Plus size={14} />
          </button>
          <button
            className="p-1 rounded transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => setShowNewFileModal(true, true)}
            title="New Folder"
          >
            <FolderPlus size={14} />
          </button>
          <button
            className="p-1 rounded transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            onClick={() => currentProject && loadFiles(currentProject.id)}
            title="Refresh"
          >
            <RefreshCw size={13} />
          </button>
          <button
            className="p-1 rounded transition-colors"
            style={{ color: "var(--color-text-tertiary)" }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = "var(--color-bg-hover)")
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = "transparent")
            }
            title="More Actions"
          >
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      {/* Tree */}
      <div className="flex-1 overflow-y-auto py-1">
        {tree.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center gap-2 py-8 px-4 text-center"
          >
            <p
              className="text-xs"
              style={{ color: "var(--color-text-tertiary)" }}
            >
              No files yet
            </p>
            <button
              className="text-xs px-3 py-1 rounded transition-colors"
              style={{
                backgroundColor: "var(--color-accent-blue-muted)",
                color: "var(--color-accent-blue)",
                border: "1px solid var(--color-accent-blue)",
              }}
              onClick={() => setShowNewFileModal(true, false)}
            >
              Create a file
            </button>
          </div>
        ) : (
          tree.map((node) => (
            <FileTreeItem key={node.path} node={node} depth={0} />
          ))
        )}
      </div>
    </div>
  );
}
