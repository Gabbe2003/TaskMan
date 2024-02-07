const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
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
        enum: ['low', 'medium', 'high'],
        default: 'low'
    },
    status: { 
        type: String,
        enum: ['completed', 'in progress', 'pending'],
        default: 'pending'
    },
    dueDate: {
        type: Date,
    },
  
});

const folderSchema = new Schema({
    name: { type: String, required: true },
    favorite: { type: Boolean, default: false },
    tasks: [taskSchema],
    owner: {
        type: String, 
        ref: 'User',
        required: true 
    },
});

const FolderModel = model('folders', folderSchema);
module.exports = FolderModel;
