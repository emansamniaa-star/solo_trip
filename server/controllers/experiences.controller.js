import * as experienceModel from '../models/experience.model.js'

export async function listExperiences(req, res, next) {
  try {
    const stories = await experienceModel.findAllExperiences()
    res.json(stories)
  } catch (error) {
    next(error)
  }
}

export async function getExperienceById(req, res, next) {
  try {
    const id = Number(req.params.id)
    if (!Number.isInteger(id) || id < 1) {
      return res.status(400).json({ error: 'Invalid experience id' })
    }

    const story = await experienceModel.findExperienceById(id)
    if (!story) {
      return res.status(404).json({ error: 'Experience not found' })
    }

    res.json(story)
  } catch (error) {
    next(error)
  }
}

export async function createExperience(req, res, next) {
  try {
    const { title, place, excerpt, tag, body } = req.body

    if (!title || !place || !excerpt || !tag || !body) {
      return res.status(400).json({ error: 'Missing required experience fields' })
    }

    const story = await experienceModel.createExperience({
      title,
      place,
      excerpt,
      tag,
      body,
      author: req.user.firstName,
      authorUserId: req.user.id,
    })

    res.status(201).json(story)
  } catch (error) {
    next(error)
  }
}
