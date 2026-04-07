import express from 'express'
import Organization from '../models/Organization.js'
import Cohort from '../models/Cohort.js'
import User from '../models/User.js'
import { authMiddleware } from '../utils/auth.js'

const router = express.Router()

// Apply authMiddleware to all routes in this file
router.use(authMiddleware)

// POST /api/organizations - Create a new organization
router.post("/", async (req, res) => {
  try {
    let organization = await Organization.create({
      ...req.body
    })
    // await organization.populate(['owner','collaborators'],'username')
    res.status(201).json(organization)
  } catch (err) {
    res.status(400).json(err)
  }
})

// POST /api/organizations/:id/cohorts - Create a new cohort for the logged-in user
router.post("/:id/cohorts", async (req, res) => {
  try {
    const organizationId = req.params.id
    const organization = await Organization.findById(organizationId)
    if (!organization) {
      return res
        .status(404)
        .json({ message: "No organization found with this id!" })
    }
    let cohort = await Cohort.create({
      ...req.body,
      organization: organizationId

    })
    await cohort.populate(['organization','users'], "-password")
    res.status(201).json(cohort)
  } catch (err) {
    res.status(400).json(err)
  }
})

// GET /api/organizations/:id/cohorts - Create a new cohort for the logged-in user
router.get("/:id/cohorts", async (req, res) => {
  try {
    const organizationId = req.params.id
    const organization = await Organization.findById(organizationId)
    if (!organization) {
      return res
        .status(404)
        .json({ message: "No organization found with this id!" })
    }
    let cohorts = await Cohort.find({organization: organizationId})
      .populate(['organization','users'], "-password")
    res.status(200).json(cohorts)
  } catch (err) {
    res.status(400).json(err)
  }
})

// GET /api/organizations - Get all organizations for the logged-in user
router.get("/", async (req, res) => {
  try {
    const organizations = await Organization.find({})
    res.json(organizations)
  } catch (err) {
    res.status(500).json(err)
  }
})

// GET /api/organizations/:id - Get a organization for the logged-in user
router.get("/:id", async (req, res) => {
  try {
    const organizationId = req.params.id
    const organization = await Organization.findById(organizationId)
    if (!organization) {
      return res
        .status(404)
        .json({ message: "No organization found with this id!" })
    }

    // get the cohorts that belong to that organization

    res.json(organization)
  } catch (err) {
    res.status(500).json(err)
  }
})

// PUT /api/organizations/:id - Update a organization
router.put("/:id", async (req, res) => {
  try {
    const organization = await Organization.findById(req.params.id)
    if (!organization) {
      return res
        .status(404)
        .json({ message: "No organization found with this id!" })
    }
    const updatedOrganization = await Organization.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after', runValidators: true },
    )
    res.json(updatedOrganization)
  } catch (err) {
    res.status(500).json(err)
  }
})

// DELETE /api/organizations/:id - Delete a organization
router.delete("/:id", async (req, res) => {
  try {
    const organizationID = req.params.id

    let organization = await Organization.findById(req.params.id)
    if (!organization) {
      return res
        .status(404)
        .json({ message: "No organization found with this id!" })
    }

    const cohorts = await Cohort.deleteMany({ organization: organizationID })
    if(cohorts.length>0) {
      await User.updateMany(
        // 1. Filter: Find documents where the 'cohorts' array includes the cohort IDs
        { cohorts: cohorts },
        // 2. Action: Remove those IDs from the 'cohorts' array
        { $pull: { cohorts: cohorts } }
      )
    }
    await Organization.findByIdAndDelete(organizationID)
    res.status(200).json({ message: "Organization deleted!" })
  } catch (err) {
    res.status(500).json(err)
  }
})

export default router
