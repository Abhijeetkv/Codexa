import prisma from "../lib/prisma.js";

// Mock AI service — easily swappable with OpenAI/Gemini later
export const aiService = {
  async chat(message: string, _projectId?: string) {
    // Simulate AI thinking delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Simple mock responses based on keywords
    const lower = message.toLowerCase();

    if (lower.includes("hello") || lower.includes("hi")) {
      return {
        role: "assistant" as const,
        content:
          "Hello! I'm Codexa AI, your coding assistant. I can help you with:\n\n- Writing and debugging code\n- Explaining concepts\n- Suggesting improvements\n- Answering technical questions\n\nHow can I help you today?",
      };
    }

    if (lower.includes("help")) {
      return {
        role: "assistant" as const,
        content:
          "I can assist you with:\n\n```\n• Code generation and completion\n• Bug fixing and debugging\n• Code review and optimization\n• Technical explanations\n• Architecture suggestions\n```\n\nJust describe what you need!",
      };
    }

    return {
      role: "assistant" as const,
      content: `I understand you're asking about: "${message}"\n\nThis is a mock AI response. To enable real AI responses, configure an AI provider (OpenAI/Gemini) in the backend settings.\n\n\`\`\`typescript\n// Example: Configure AI provider\nconst aiConfig = {\n  provider: "openai",\n  model: "gpt-4",\n  apiKey: process.env.OPENAI_API_KEY\n};\n\`\`\``,
    };
  },

  async saveChatMessage(
    chatSessionId: string,
    role: "USER" | "ASSISTANT" | "SYSTEM",
    content: string
  ) {
    return prisma.chatMessage.create({
      data: { chatSessionId, role, content },
    });
  },

  async getOrCreateSession(projectId: string, title?: string) {
    // Find existing or create new
    let session = await prisma.chatSession.findFirst({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: { messages: { orderBy: { createdAt: "asc" } } },
    });

    if (!session) {
      session = await prisma.chatSession.create({
        data: {
          projectId,
          title: title || "New Chat",
        },
        include: { messages: true },
      });
    }

    return session;
  },

  async getChatSessions(projectId: string) {
    return prisma.chatSession.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          orderBy: { createdAt: "asc" },
          take: 50,
        },
      },
    });
  },
};
