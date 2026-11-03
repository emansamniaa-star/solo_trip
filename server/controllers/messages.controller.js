import * as messageModel from '../models/message.model.js'

export async function listConversations(req, res, next) {
  try {
    const conversations = await messageModel.listConversationsForUser(req.user.id)
    res.json(
      conversations.map((c) => ({
        ...c,
        updatedAt: c.updatedAt
          ? new Date(c.updatedAt).toISOString().slice(0, 10)
          : null,
        lastMessage: c.lastMessage || '',
      })),
    )
  } catch (error) {
    next(error)
  }
}

export async function getConversationThread(req, res, next) {
  try {
    const conversationId = Number(req.params.id)
    if (!Number.isInteger(conversationId) || conversationId < 1) {
      return res.status(400).json({ error: 'Invalid conversation id' })
    }

    const meta = await messageModel.getConversationMeta(conversationId, req.user.id)
    if (!meta) {
      return res.status(404).json({ error: 'Conversation not found' })
    }

    const rows = await messageModel.listMessages(conversationId)
    const messages = rows.map((m) => ({
      id: m.id,
      text: m.text,
      fromMe: m.senderId === req.user.id,
    }))

    res.json({ conversation: meta, messages })
  } catch (error) {
    next(error)
  }
}

export async function sendMessage(req, res, next) {
  try {
    const conversationId = Number(req.params.id)
    const { text } = req.body

    if (!Number.isInteger(conversationId) || conversationId < 1) {
      return res.status(400).json({ error: 'Invalid conversation id' })
    }
    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: 'Message text is required' })
    }

    const allowed = await messageModel.userInConversation(conversationId, req.user.id)
    if (!allowed) {
      return res.status(403).json({ error: 'Not a member of this conversation' })
    }

    const message = await messageModel.createMessage({
      conversationId,
      senderId: req.user.id,
      text: String(text).trim(),
    })

    res.status(201).json({
      id: message.id,
      text: message.text,
      fromMe: true,
    })
  } catch (error) {
    next(error)
  }
}

export async function startConversation(req, res, next) {
  try {
    const { otherUserId, tripLabel } = req.body
    const otherId = Number(otherUserId)

    if (!Number.isInteger(otherId) || otherId < 1) {
      return res.status(400).json({ error: 'otherUserId is required' })
    }
    if (otherId === req.user.id) {
      return res.status(400).json({ error: 'Cannot start a chat with yourself' })
    }
    if (!tripLabel) {
      return res.status(400).json({ error: 'tripLabel is required' })
    }

    const conversation = await messageModel.createConversation({
      tripLabel,
      userIds: [req.user.id, otherId],
    })

    res.status(201).json(conversation)
  } catch (error) {
    next(error)
  }
}
