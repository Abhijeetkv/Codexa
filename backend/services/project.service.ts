import prisma from "../lib/prisma.js";

export const projectService = {
  async create(data: {
    name: string;
    description?: string;
    userId?: string;
    guestSessionId?: string;
  }) {
    const isGuest = !data.userId;

    return prisma.project.create({
      data: {
        name: data.name,
        description: data.description,
        userId: data.userId,
        guestSessionId: isGuest ? data.guestSessionId : undefined,
        isGuest,
      },
      include: { files: true },
    });
  },

  async list(userId?: string, guestSessionId?: string) {
    const where: any = {};

    if (userId) {
      where.userId = userId;
    } else if (guestSessionId) {
      where.guestSessionId = guestSessionId;
      where.isGuest = true;
    } else {
      return [];
    }

    return prisma.project.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      include: {
        files: { select: { id: true, name: true, path: true, isDirectory: true } },
        _count: { select: { files: true } },
      },
    });
  },

  async getById(id: string) {
    return prisma.project.findUnique({
      where: { id },
      include: {
        files: {
          orderBy: [{ isDirectory: "desc" }, { name: "asc" }],
        },
        repository: true,
      },
    });
  },

  async update(id: string, data: { name?: string; description?: string }) {
    return prisma.project.update({
      where: { id },
      data,
    });
  },

  async delete(id: string) {
    return prisma.project.delete({ where: { id } });
  },

  async migrateToUser(projectId: string, userId: string) {
    return prisma.project.update({
      where: { id: projectId },
      data: {
        userId,
        isGuest: false,
        guestSessionId: null,
      },
    });
  },
};
