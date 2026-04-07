import express from 'express'
import Cohort from '../models/Cohort.js'
import User from '../models/User.js'
import { authMiddleware } from '../utils/auth.js'

const router = express.Router()

// Apply authMiddleware to all routes in this file
router.use(authMiddleware)

// GET /api/cohorts - Get all cohorts
router.get("/", async (req, res) => {
  try {
    const cohorts = await Cohort.find({})
      .populate(['organization','users'], "-password")
    res.json(cohorts)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET /api/cohorts/ - Get cohorts
router.get("/", async (req, res) => {
  try {
    // get the cohort by ID
    const cohorts = await Cohort.find({})
      .populate(['organization','users'], "-password")

    res.json(cohorts)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET /api/cohorts/:id - Get a cohort
router.get("/:id", async (req, res) => {
  try {
    // get the cohort by ID
    const cohort = await Cohort.findById(req.params.id)
      .populate(['organization','users'], "-password")
    if (!cohort) {
      return res
        .status(404)
        .json({ message: "No cohort found with this id!" })
    }

    // get the users that belong to that cohort

    res.json(cohort)
  } catch (err) {
    res.status(500).json(err)
  }
})

// PUT /api/cohorts/:id - Update a cohort
router.put("/:id", async (req, res) => {
  try {
    const cohort = await Cohort.findById(req.params.id)
      .populate(['organization','users'], "-password")
    if (!cohort) {
      return res
        .status(404)
        .json({ message: "No cohort found with this id!" })
    }
    const updatedCohort = await Cohort.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true },
    )
    res.json(updatedCohort)
  } catch (err) {
    res.status(500).json(err)
  }
})

// DELETE /api/cohorts/:id - Delete a cohort
router.delete("/:id", async (req, res) => {
  try {
    const cohortID = req.params.id
    let cohort = await Cohort.findById(cohortID)
    if (!cohort) {
      return res
        .status(404)
        .json({ message: "No cohort found with this id!" })
    }

    await User.updateMany(
      // 1. Filter: Find documents where the 'cohorts' array includes the cohort IDs
      { cohorts: cohortID },
      // 2. Action: Remove those IDs from the 'cohorts' array
      { $pull: { cohorts: cohortID } }
    )
    await Cohort.findByIdAndDelete(cohortID)
    
    res.json({ message: "Cohort deleted!" })
  } catch (err) {
    res.status(500).json(err)
  }
})

export default router
