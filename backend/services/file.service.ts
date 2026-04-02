import prisma from "../lib/prisma.js";

export const fileService = {
  async create(data: {
    projectId: string;
    path: string;
    name: string;
    content?: string;
    isDirectory?: boolean;
  }) {
    const extension = data.isDirectory
      ? null
      : data.name.includes(".")
        ? data.name.split(".").pop() || null
        : null;

    return prisma.file.create({
      data: {
        projectId: data.projectId,
        path: data.path,
        name: data.name,
        content: data.content || "",
        isDirectory: data.isDirectory || false,
        extension,
      },
    });
  },

  async getByProject(projectId: string) {
    return prisma.file.findMany({
      where: { projectId },
      orderBy: [{ isDirectory: "desc" }, { path: "asc" }],
    });
  },

  async getById(id: string) {
    return prisma.file.findUnique({ where: { id } });
  },

  async update(id: string, data: { content?: string; name?: string; path?: string }) {
    return prisma.file.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.file.delete({ where: { id } });
  },

  async deleteByPath(projectId: string, path: string) {
    // Delete files matching path prefix (for folder deletion)
    return prisma.file.deleteMany({
      where: {
        projectId,
        path: { startsWith: path },
      },
    });
  },
};
