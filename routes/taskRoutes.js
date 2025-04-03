const express = require('express');
const router = express.Router();

const { createTask, getTasks, updateTaskStatus, deleteTaskById } = require('../controllers/TaskManagementController/taskController');

router.post('/createTask', createTask);
router.get('/getAllTasks', getTasks);
router.patch('/updateTaskById/:id', updateTaskStatus);
router.patch('/deleteTaskById/:id', deleteTaskById);

module.exports = router;