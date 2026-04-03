import {
  FileText,
  FileJson,
  FileCode,
  File,
  Folder,
  FolderOpen,
  Image,
  FileType,
  Braces,
  Hash,
  Database,
  Globe,
  Palette,
  Settings,
  type LucideIcon,
} from "lucide-react";

const extIconMap: Record<string, LucideIcon> = {
  js: FileCode,
  jsx: FileCode,
  ts: FileCode,
  tsx: FileCode,
  py: FileType,
  json: FileJson,
  html: Globe,
  htm: Globe,
  css: Palette,
  scss: Palette,
  md: FileText,
  txt: FileText,
  svg: Image,
  png: Image,
  jpg: Image,
  gif: Image,
  sql: Database,
  prisma: Database,
  env: Settings,
  yaml: Braces,
  yml: Braces,
  toml: Braces,
  sh: Hash,
  bash: Hash,
};

const extColorMap: Record<string, string> = {
  js: "#f7df1e",
  jsx: "#61dafb",
  ts: "#3178c6",
  tsx: "#3178c6",
  py: "#3776ab",
  json: "#a8b1ff",
  html: "#e34f26",
  htm: "#e34f26",
  css: "#1572b6",
  scss: "#c6538c",
  md: "#8b949e",
  sql: "#d29922",
  prisma: "#2d3748",
  env: "#6e7681",
  yaml: "#cb171e",
  yml: "#cb171e",
};

export function getFileIcon(name: string, isDirectory: boolean, isOpen?: boolean): LucideIcon {
  if (isDirectory) return isOpen ? FolderOpen : Folder;

  const ext = name.includes(".") ? name.split(".").pop()?.toLowerCase() : "";
  return extIconMap[ext || ""] || File;
}

export function getFileIconColor(name: string, isDirectory: boolean): string {
  if (isDirectory) return "#8b949e";

  const ext = name.includes(".") ? name.split(".").pop()?.toLowerCase() : "";
  return extColorMap[ext || ""] || "#8b949e";
}
