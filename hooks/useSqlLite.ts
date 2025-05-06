import * as SQLite from "expo-sqlite";
import { useEffect } from "react";

const db = SQLite.openDatabaseSync("chaty.db");

export const useSqlLite = () => {
  const initializeDB = async () => {
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        nick_name TEXT,
        created_at DATETIME,
        last_message TEXT
      );
      
      CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        conversation_id TEXT NOT NULL,
        sender_id JSON NOT NULL,
        receiver_id TEXT NOT NULL,
        content TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        status TEXT DEFAULT 'sent',
        FOREIGN KEY(conversation_id) REFERENCES conversations(id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);
    `);
  };

  const getAllConversations = async () => {
    try {
      return await db.getAllAsync("SELECT * FROM conversations");
    } catch (error) {
      console.error("获取对话失败:", error);
      return [];
    }
  };

  const getOrCreateConversation = async (
    userId: string,
    targetUserId: string,
    nick_name?: string,
  ) => {
    const conversationId = [userId, targetUserId].sort().join("_");

    await db.runAsync("INSERT OR IGNORE INTO conversations (id) VALUES (?)", [
      conversationId,
    ]);

    if (nick_name) {
      await db.runAsync("UPDATE conversations SET nick_name = ? WHERE id = ?", [
        nick_name,
        conversationId,
      ]);
    }

    return conversationId;
  };

  const saveMessage = async (
    conversationId: string,
    senderId: string,
    receiverId: string,
    content: string,
    time: any,
  ) => {
    await db.runAsync(
      "INSERT INTO messages (conversation_id, sender_id, receiver_id, content) VALUES (?, ?, ?, ?)",
      [conversationId, senderId, receiverId, content],
    );

    console.log(content);

    await db.runAsync(
      "UPDATE conversations SET last_message = ?, created_at = ? WHERE id = ?",
      [content, time, conversationId],
    );
  };

  const getMessages = async (conversationId: string) => {
    return await db.getAllAsync<any>(
      "SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at DESC",
      [conversationId],
    );
  };

  const clearAllData = async () => {
    try {
      const tables = await db.getAllAsync(
        "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
      );

      for (const table of tables) {
        await db.execAsync(`DROP TABLE ${table.name}`);
      }

      console.log("所有数据已清除");
      return true;
    } catch (error) {
      console.error("清除数据失败:", error);
      return false;
    }
  };

  useEffect(() => {
    initializeDB();
  }, []);

  return {
    getOrCreateConversation,
    saveMessage,
    getMessages,
    clearAllData,
    getAllConversations,
  };
};
