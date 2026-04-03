const languageMap: Record<string, string> = {
  js: "javascript",
  jsx: "javascript",
  ts: "typescript",
  tsx: "typescript",
  py: "python",
  rb: "ruby",
  java: "java",
  c: "c",
  cpp: "cpp",
  cs: "csharp",
  go: "go",
  rs: "rust",
  php: "php",
  swift: "swift",
  kt: "kotlin",
  scala: "scala",
  html: "html",
  htm: "html",
  css: "css",
  scss: "scss",
  sass: "scss",
  less: "less",
  json: "json",
  xml: "xml",
  yaml: "yaml",
  yml: "yaml",
  md: "markdown",
  sql: "sql",
  sh: "shell",
  bash: "shell",
  zsh: "shell",
  ps1: "powershell",
  dockerfile: "dockerfile",
  toml: "ini",
  ini: "ini",
  env: "ini",
  graphql: "graphql",
  gql: "graphql",
  prisma: "graphql",
  vue: "html",
  svelte: "html",
};

export function getLanguageFromExtension(ext?: string): string {
  if (!ext) return "plaintext";
  return languageMap[ext.toLowerCase()] || "plaintext";
}

export function getLanguageFromFilename(filename: string): string {
  const ext = filename.includes(".") ? filename.split(".").pop() : undefined;
  return getLanguageFromExtension(ext);
}
