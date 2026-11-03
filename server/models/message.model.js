import { sql } from '../config/db.js'

export async function listConversationsForUser(userId) {
  return sql`
    SELECT
      c.id,
      c.trip_label AS "tripLabel",
      c.updated_at AS "updatedAt",
      other.first_name AS "withUser",
      (
        SELECT m.body
        FROM messages m
        WHERE m.conversation_id = c.id
        ORDER BY m.created_at DESC
        LIMIT 1
      ) AS "lastMessage"
    FROM conversations c
    INNER JOIN conversation_members me
      ON me.conversation_id = c.id AND me.user_id = ${userId}
    INNER JOIN conversation_members other_mem
      ON other_mem.conversation_id = c.id AND other_mem.user_id <> ${userId}
    INNER JOIN users other
      ON other.id = other_mem.user_id
    ORDER BY c.updated_at DESC
  `
}

export async function userInConversation(conversationId, userId) {
  const rows = await sql`
    SELECT 1
    FROM conversation_members
    WHERE conversation_id = ${conversationId} AND user_id = ${userId}
    LIMIT 1
  `
  return rows.length > 0
}

export async function getConversationMeta(conversationId, userId) {
  const rows = await sql`
    SELECT
      c.id,
      c.trip_label AS "tripLabel",
      other.first_name AS "withUser"
    FROM conversations c
    INNER JOIN conversation_members me
      ON me.conversation_id = c.id AND me.user_id = ${userId}
    INNER JOIN conversation_members other_mem
      ON other_mem.conversation_id = c.id AND other_mem.user_id <> ${userId}
    INNER JOIN users other
      ON other.id = other_mem.user_id
    WHERE c.id = ${conversationId}
    LIMIT 1
  `
  return rows[0] || null
}

export async function listMessages(conversationId) {
  return sql`
    SELECT
      id,
      conversation_id AS "conversationId",
      sender_id AS "senderId",
      body AS text,
      created_at AS "createdAt"
    FROM messages
    WHERE conversation_id = ${conversationId}
    ORDER BY created_at ASC
  `
}

export async function createConversation({ tripLabel, userIds }) {
  const rows = await sql`
    INSERT INTO conversations (trip_label)
    VALUES (${tripLabel})
    RETURNING id, trip_label AS "tripLabel", updated_at AS "updatedAt"
  `
  const conversation = rows[0]
  for (const userId of userIds) {
    await sql`
      INSERT INTO conversation_members (conversation_id, user_id)
      VALUES (${conversation.id}, ${userId})
    `
  }
  return conversation
}

export async function createMessage({ conversationId, senderId, text }) {
  const rows = await sql`
    INSERT INTO messages (conversation_id, sender_id, body)
    VALUES (${conversationId}, ${senderId}, ${text})
    RETURNING
      id,
      conversation_id AS "conversationId",
      sender_id AS "senderId",
      body AS text,
      created_at AS "createdAt"
  `
  await sql`
    UPDATE conversations
    SET updated_at = NOW()
    WHERE id = ${conversationId}
  `
  return rows[0]
}
