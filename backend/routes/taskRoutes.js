import express from 'express'
import Project from '../models/Project.js'
import Task from '../models/Task.js'
import { authMiddleware } from '../utils/auth.js'
import { isProjectOwner } from "../utils/projectAuth.js";

const router = express.Router({ mergeParams: true })
 
// Apply authMiddleware to all routes in this file
router.use(authMiddleware);
 
// POST /api/projects/:projectId/tasks - Create a new task
router.post('/', async (req, res) => {
  try {

    // check if a project ID was included in the URL
    const { projectId } = req.params
    if (!projectId) {
      return res.status(400).json({ message: 'No project ID specified in request' });
    }
    
    // check if the specified project ID exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'No project found with this project ID' });
    }

    // check if the user owns the specified project
    if (!isProjectOwner(project.user, req.user._id)) {
      return res.status(403).json({ message: 'User not authorized to add tasks belonging to this this project' });
    }

    // create a new task that is a child of the specified project
    const task = await Task.create({
      ...req.body,
      project: projectId
    });
    res.status(201).json(task);

  } catch (err) {
    res.status(400).json(err);
  }
});
 
// GET /api/projects/:projectId/tasks - Get all tasks for the logged-in user
router.get('/', async (req, res) => {
  try {

    // check if a project ID was included in the URL
    const { projectId } = req.params
    if (!projectId) {
      return res.status(400).json({ message: 'No project ID specified in request' });
    }
    
    // check if the specified project ID exists
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: 'No project found with this project ID' });
    }

    // check if the user owns the specified project
    if (!isProjectOwner(project.user, req.user._id)) {
      return res.status(403).json({ message: 'User not authorized to view tasks belonging to this this project' });
    }

    // get all tasks that are children of the specified project
    const tasks = await Task.find({ project: projectId });
    res.json(tasks);

  } catch (err) {
    res.status(500).json(err);
  }
});
 
// PUT /api/tasks/:taskId - Update a task
// also works with PUT /api/projects/:projectId/tasks/:taskId - Update a task
router.put('/:taskId', async (req, res) => {
  try {

    // check if the task exists
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }

    const projectId = task.project;
    
    // check if the project for the specified task exists
    const project = await Project.findById(projectId);
    if (!task.project) {
      return res.status(404).json({ message: 'No parent project found for this task' });
    }

    // check if the user owns the project for the specified task
    if (!isProjectOwner(project.user, req.user._id)) {
      return res.status(403).json({ message: 'User not authorized to update tasks belonging to this this project' });
    }

    // update the task
    const updatedTask = await Task.findByIdAndUpdate(req.params.taskId, req.body, { new: true, runValidators: true });
    res.json(updatedTask);

  } catch (err) {
    res.status(500).json(err);
  }
});
 
// DELETE /api/tasks/:taskId - Delete a task
// also works with DELETE /api/projects/:projectId/tasks/:taskId - Delete a task
router.delete('/:taskId', async (req, res) => {
  try {

    // check if the task exists
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({ message: 'No task found with this id!' });
    }

    const projectId = task.project;
    
    // check if the project for the specified task exists
    const project = await Project.findById(projectId);
    if (!task.project) {
      return res.status(404).json({ message: 'No parent project found for this task' });
    }

    // check if the user owns the project for the specified task
    if (!isProjectOwner(project.user, req.user._id)) {
      return res.status(403).json({ message: 'User not authorized to delete tasks belonging to this this project' });
    }

    // delete the task
    const deletedTask = await Task.findByIdAndDelete(req.params.taskId);
    res.json({ message: 'Task deleted!' });

  } catch (err) {
    res.status(500).json(err);
  }
});
 
export default router