const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  status: { type: String, enum: ['TODO', 'IN_PROGRESS', 'DONE'], default: 'TODO' },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' }
});

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
