import { WebContainer, type FileSystemTree, type SpawnOptions } from "@webcontainer/api";
import type { FileItem } from "../api/projects";

let webcontainerPromise: Promise<WebContainer> | null = null;

function getWebContainer(): Promise<WebContainer> {
  if (!webcontainerPromise) {
    webcontainerPromise = WebContainer.boot();
  }
  return webcontainerPromise;
}

function ensureDirectory(
  tree: FileSystemTree,
  parts: string[]
): FileSystemTree {
  let current = tree;
  for (const part of parts) {
    if (!current[part]) {
      current[part] = { directory: {} };
    }
    current = (current[part] as { directory: FileSystemTree }).directory;
  }
  return current;
}

function buildFileTree(files: FileItem[]): FileSystemTree {
  const tree: FileSystemTree = {};

  for (const file of files) {
    const normalized = file.path.replace(/^\/+/, "");
    const parts = normalized.split("/").filter(Boolean);

    if (file.isDirectory) {
      ensureDirectory(tree, parts);
      continue;
    }

    const fileName = parts.length > 0 ? parts[parts.length - 1] : file.name;
    const dirParts = parts.slice(0, -1);
    const dir = ensureDirectory(tree, dirParts);

    dir[fileName] = {
      file: { contents: file.content ?? "" },
    };
  }

  return tree;
}

async function mountProjectFiles(files: FileItem[]): Promise<void> {
  const webcontainer = await getWebContainer();
  const tree = buildFileTree(files);
  await webcontainer.mount(tree);
}

async function spawnCommand(command: string, options?: SpawnOptions) {
  const webcontainer = await getWebContainer();
  const [cmd, ...args] = command.split(" ").filter(Boolean);

  if (!cmd) return null;

  return webcontainer.spawn(cmd, args, { cwd: "/", ...options });
}

export { getWebContainer, mountProjectFiles, spawnCommand };
