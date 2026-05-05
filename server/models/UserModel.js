const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
    identifier: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        select: false // Security ke liye: normal queries mein password nahi dikhega
    },
    role: {
        type: String,
        enum: ['student', 'teacher', 'admin'],
        default: 'student'
    },
    branch: {
        type: String,
        default: 'N/A'
    },
    semester: {
        type: String,
        default: 'N/A'
    },
    // --- FACE RECOGNITION FIELDS ---
    faceDescriptor: {
    type: [Number], // 'Array' ki jagah '[Number]' use karein taaki calculations sahi hon
    default: [],
    select: true // Isse verifyAndMarkAttendance mein data hamesha load hoga
},
    faceId: {
        type: String,
        unique: true,
        sparse: true // Multiple null values allow karne ke liye
    }
}, {
    timestamps: true // createdAt aur updatedAt automatic ban jayenge
});

// Password match karne ke liye custom method
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Data save hone se pehle password ko hash (encrypt) karna
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

const User = mongoose.model('User', userSchema);
module.exports = User;