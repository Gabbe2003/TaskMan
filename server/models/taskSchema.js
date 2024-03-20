const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    subTask: {
        type: String,
        default: ''
    },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High'],
        default: 'Low'
    },
    status: { 
        type: String,
        enum: ['Completed', 'In progress', 'Pending'],
        default: 'Pending'
    },
    dueDate: {
        type: Date,
    },
    createdTask: {
        type: Date,
        default: Date.now 
    },
});

const folderSchema = new Schema({
    name: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    dueDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)},
    tasks: [taskSchema],
    owner: {
        type: String, 
        ref: 'User',
        required: true 
    },
});

const FolderModel = model('folders', folderSchema);
module.exports = FolderModel;
