const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, enum: ['ADMIN', 'ASSISTANT', 'MANAGER'], required: true},
    loginOtp: {type: String},
    loginOtpExpiresAt: {type: Date},
    isActive: {type: Boolean, default: false},
}, {timestamps: true});

//pre hook to save hashed password
userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// //pre hook to save otp in hashed form
// userSchema.pre('save', async function(next) {
//     if (this.isModified('loginOtp')) {
//         this.loginOtp = await bcrypt.hash(this.loginOtp, 10);
//     }
//     next();
// });

//compare method of bcrypt to check password
userSchema.methods.comparePassword = async function(plainPassword) {
    return await bcrypt.compare(plainPassword, this.password);
};

//compare method to compare login otp
userSchema.methods.compareLoginOtp = async function(plainOtp) {
    return await bcrypt.compare(plainOtp, this.loginOtp);
};

module.exports = mongoose.model('User', userSchema);