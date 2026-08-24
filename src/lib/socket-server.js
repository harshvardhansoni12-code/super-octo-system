import { Server } from "socket.io";
import { getToken } from "next-auth/jwt";
import { generateText } from "./gemini.js";

const SUPPORT_ROOM = "support";
const AI_COMMAND = /^\/ai\s+([\s\S]+)/i;

let io;

function parseCookies(cookieHeader) {
  const cookies = {};
  if (!cookieHeader) return cookies;

  for (const part of cookieHeader.split(";")) {
    const index = part.indexOf("=");
    if (index === -1) continue;
    const name = part.slice(0, index).trim();
    const value = part.slice(index + 1).trim();
    cookies[name] = decodeURIComponent(value);
  }
  return cookies;
}

export function initSocketServer(httpServer) {
  io = new Server(httpServer, {
    path: "/api/socket",
  });

  io.use(async (socket, next) => {
    const cookies = parseCookies(socket.handshake.headers.cookie);
    const token = await getToken({
      req: { cookies, headers: socket.handshake.headers },
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token?.id) {
      console.log("[socket-server] rejected connection: no valid session cookie");
      return next(new Error("Unauthorized"));
    }

    socket.data.user = {
      id: token.id,
      name: token.name || token.email,
      role: token.role,
    };
    next();
  });

  io.on("connection", (socket) => {
    const { user } = socket.data;
    console.log(
      `[socket-server] connected: ${user.name} (${user.role}) socket=${socket.id}, room "${SUPPORT_ROOM}" now has ${io.sockets.adapter.rooms.get(SUPPORT_ROOM)?.size ?? 0} + 1 member(s)`,
    );
    socket.join(SUPPORT_ROOM);

    socket.on("chat:message", (payload) => {
      console.log(`[socket-server] chat:message from ${user.name}:`, payload);

      const text = typeof payload?.text === "string" ? payload.text.trim() : "";
      if (!text) {
        console.log("[socket-server] ignored empty message");
        return;
      }

      const message = {
        id: `${socket.id}-${Date.now()}`,
        text,
        senderId: user.id,
        senderName: user.name,
        senderRole: user.role,
        createdAt: new Date().toISOString(),
      };

      const roomSize = io.sockets.adapter.rooms.get(SUPPORT_ROOM)?.size ?? 0;
      console.log(
        `[socket-server] broadcasting to "${SUPPORT_ROOM}" (${roomSize} member(s)):`,
        message,
      );
      io.to(SUPPORT_ROOM).emit("chat:message", message);

      const aiMatch = text.match(AI_COMMAND);
      if (aiMatch) {
        const prompt = aiMatch[1].trim();
        console.log(`[socket-server] /ai command from ${user.name}: "${prompt}"`);

        generateText(prompt)
          .then((reply) => {
            io.to(SUPPORT_ROOM).emit("chat:message", {
              id: `ai-${Date.now()}`,
              text: reply,
              senderId: "ai",
              senderName: "AI Assistant",
              senderRole: "AI",
              createdAt: new Date().toISOString(),
            });
          })
          .catch((error) => {
            console.error("[socket-server] /ai command failed:", error);
            io.to(SUPPORT_ROOM).emit("chat:message", {
              id: `ai-${Date.now()}`,
              text: `Sorry, I couldn't get a response (${error.message || "unknown error"}).`,
              senderId: "ai",
              senderName: "AI Assistant",
              senderRole: "AI",
              createdAt: new Date().toISOString(),
            });
          });
      }
    });

    socket.on("disconnect", (reason) => {
      console.log(`[socket-server] disconnected: ${user.name} (${reason})`);
    });
  });

  return io;
}

export function getSocketServer() {
  return io;
}
