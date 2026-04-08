import express from 'express'
import Cohort from '../models/Cohort.js'
import User from '../models/User.js'
import { authMiddleware } from '../utils/auth.js'

const router = express.Router()


router.use(authMiddleware)


router.get("/", async (req, res) => {
  try {
    const cohorts = await Cohort.find({})
      .populate(['organization','users'], "-password")
    res.json(cohorts)
  } catch (err) {
    res.status(500).json(err)
  }
})


// router.get("/", async (req, res) => {
//   try {
//     const cohorts = await Cohort.find({})
//       .populate(['organization','users'], "-password")

//     res.json(cohorts)
//   } catch (err) {
//     res.status(500).json(err)
//   }
// })


router.get("/:id", async (req, res) => {
  try {
    
    const cohort = await Cohort.findById(req.params.id)
      .populate(['organization','users'], "-password")
    if (!cohort) {
      return res
        .status(404)
        .json({ message: "No cohort found with this id!" })
    }



    res.json(cohort)
  } catch (err) {
    res.status(500).json(err)
  }
})


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
      { cohorts: cohortID },
      { $pull: { cohorts: cohortID } }
    )
    await Cohort.findByIdAndDelete(cohortID)
    
    res.json({ message: "Cohort deleted!" })
  } catch (err) {
    res.status(500).json(err)
  }
})

export default router
