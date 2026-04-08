import express from 'express'
import Organization from '../models/Organization.js'
import Cohort from '../models/Cohort.js'
import User from '../models/User.js'
import { authMiddleware } from '../utils/auth.js'

const router = express.Router()


router.use(authMiddleware)


router.post("/", async (req, res) => {
  try {
    let organization = await Organization.create({
      ...req.body
    })
    
    res.status(201).json(organization)
  } catch (err) {
    res.status(400).json(err)
  }
})


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


router.get("/", async (req, res) => {
  try {
    const organizations = await Organization.find({})
    res.json(organizations)
  } catch (err) {
    res.status(500).json(err)
  }
})


router.get("/:id", async (req, res) => {
  try {
    const organizationId = req.params.id
    const organization = await Organization.findById(organizationId)
    if (!organization) {
      return res
        .status(404)
        .json({ message: "No organization found with this id!" })
    }



    res.json(organization)
  } catch (err) {
    res.status(500).json(err)
  }
})


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
 
router.delete("/:id", async (req, res) => {
  try {
    const organizationID = req.params.id

    let organization = await Organization.findById(req.params.id)
    if (!organization) {
      return res
        .status(404)
        .json({ message: "No organization found with this id!" })
    }

    const cohortsToDelete = await Cohort.find({ organization: organizationID }, '_id');
    const cohortIds = cohortsToDelete.map(c => c._id);
            await Cohort.deleteMany({ organization: organizationID })
    if(cohortsIds.length>0) {
      await User.updateMany(
     
        { cohorts: {$in: cohortIds} },
       
        { $pull: { cohorts:{ $in: cohortsIds }} }
      );
    }
    await Organization.findByIdAndDelete(organizationID)
    res.status(200).json({ message: "Organization deleted!" })
  } catch (err) {
    res.status(500).json(err)
  }
})

export default router
