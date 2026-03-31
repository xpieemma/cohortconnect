import express from "express";
import Project from "../models/Project.js";
import Task from "../models/Task.js";
import { authMiddleware } from "../utils/auth.js";
import { isProjectOwner } from "../utils/projectAuth.js";

const router = express.Router();

// Apply authMiddleware to all routes in this file
router.use(authMiddleware);

// POST /api/projects - Create a new project
router.post("/", async (req, res) => {
  try {
    const project = await Project.create({
      ...req.body,
      user: req.user._id,
    });
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json(err);
  }
});

// GET /api/projects - Get all projects for the logged-in user
router.get("/", async (req, res) => {
  try {
    const projects = await Project.find({ user: req.user._id });
    res.json(projects);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET /api/projects/:id - Get a project for the logged-in user
router.get("/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id!" });
    }
    if (!isProjectOwner(project.user, req.user._id)) {
      return res
        .status(403)
        .json({ message: "User not authorized to view this project" });
    }
    res.json(project);
  } catch (err) {
    res.status(500).json(err);
  }
});

// PUT /api/projects/:id - Update a project
router.put("/:id", async (req, res) => {
  try {
    // This needs an authorization check
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id!" });
    }
    if (!isProjectOwner(project.user, req.user._id)) {
      return res
        .status(403)
        .json({ message: "User not authorized to update this project" });
    }
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );
    res.json(updatedProject);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE /api/projects/:id - Delete a project
router.delete("/:id", async (req, res) => {
  try {
    // This needs an authorization check
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res
        .status(404)
        .json({ message: "No project found with this id!" });
    }
    if (!isProjectOwner(project.user, req.user._id)) {
      return res
        .status(403)
        .json({ message: "User not authorized to delete this project" });
    }
    await Task.deleteMany({ project: req.params.id });
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

export default router;
