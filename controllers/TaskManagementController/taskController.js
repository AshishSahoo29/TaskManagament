const Task = require('../../models/TaskManagementModel/task');

//create task
exports.createTask = async (req, res) => {
try {
    const { title, description, assignedBy,assignedTo } = req.body;
    const newTask = new Task({ title, description, assignedBy, assignedTo });
    
    await newTask.save();
    return res.status(201).json({ message: "Task created successfully", task: newTask });
    
} catch (error) {
    return res.status(500).json({ message: "Error creating task, please try again after sometime", error: error.message });        
}
};  

//fetch All tasks
exports.getTasks = async (req, res) => {
try {
    const tasks = await Task.find({ assignedTo: req.user.id });
    if(tasks){
        return res.status(404).json({ message: "Tasks not found" });
    }
    return res.status(200).json({ message: "Tasks fetched successfully", tasks });
    
} catch (error) {
    return res.status(500).json({ message: "Error fetching tasks, please try again after sometime", error: error.message });
    
}
};
  
//update task
exports.updateTaskStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const task = await Task.findByIdAndUpdate(req.params.id, { status }, { new: true });

        if (!task) return res.status(404).json({ message: "Task not found" });
        return res.status(200).json({ message: "Task status updated", task });
        
    } catch (error) {
        return res.status(500).json({ message: "Error updating task status, please try again after sometime", error: error.message });        
    }

};

//soft delete tasks by patch
exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { isDeleted: true }, { new: true });
        if (!task) return res.status(404).json({ message: "Task not found" });
        return res.status(200).json({ message: "Task deleted successfully", task });
        
    } catch (error) {
        return res.status(500).json({ message: "Error deleting task, please try again after sometime", error: error.message });        
    }
}


exports.logWorkHours = async (req, res) => {
    try {
        const { hours } = req.body;
        const task = await Task.findById(req.params.id);
        
        if (!task) return res.status(404).json({ message: "Task not found" });
        
        task.timeLogs.push({ date: new Date(), hours });
        await task.save();
        
        res.json({ message: "Work hours logged", task });        
    } catch (error) {
        return res.status(500).json({ message: "Error logging work hours, please try again after sometime", error: error.message });        
    }

};