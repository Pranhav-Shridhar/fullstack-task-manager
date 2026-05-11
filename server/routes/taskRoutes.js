import express from "express";

import {
  getTasks,
  createTask,
  deleteTask,
  toggleTask,
} from "../controllers/taskController.js";

const router = express.Router();

router.get("/", getTasks);

router.post("/", createTask);

router.delete("/:id", deleteTask);

router.put("/:id", toggleTask);

export default router;