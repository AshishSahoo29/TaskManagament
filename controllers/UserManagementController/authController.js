const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../../models/UserManagementModel/user');
const nodemailer = require('nodemailer');

//email transporter -> using gmail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: "swainbasundhara1@gmail.com",
    pass: 'fjut gwbx reso umzg'
  }
});

// Register Controller
exports.registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const newUser = new User({
      fullName: name,
      email,
      password,
      role
    });

    await newUser.save();

    return res.status(201).json({ message: 'User registered successfully'});

  } catch (error) {
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
};

//login  request -> validate password and send otp
exports.loginRequest = async(req, res) => {
  try{
    const {email, password} = req.body;
    const user =  await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
      return res.status(401).json({message: "Invalid credentials"});
    }

    const otp = Math.floor(Math.random() * 10000);
    const hashedOtp = await bcrypt.hash(otp.toString(), 10);
    
    const otpExpiry = new Date(Date.now() + 2 * 60 * 1000);

    user.otp = hashedOtp;
    user.resetOtpExpiresAt = otpExpiry;
    await user.save();

    //send otp via email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Login OTP',
      text: `Your OTP is: ${otp}`
    };

    const message = await transporter.sendMail(mailOptions);

    if(!message){
      return res.status(500).json({message: "Error sending otp, please try again after sometime"});
    }

    return res.status(200).json({message: "Otp sent successfully"});

  }catch(error){
    return res.status(500).json({message: "Error sending otp, please try again after sometime", error: error.message});
  }
}

//login verification -> validate otp
exports.verifyLogin = async (req, res) => {
  try{
    const {email, otp} = req.body;
    const user =  await User.findOne({email});
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
 
    //compare hashed otp and check for expiry time
    const isMatch = await User.compareOtp(otp);

    if(!isMatch){
      return res.status(401).json({message: "Invalid otp"});
    }

    //generate jwt token
    //const token = jwt.sign({id: user._id, email: user.email, role: user.role}, process.env.JWT_SECRET, {expiresIn: '1d'});
    userObj = {
      id: user._id,
      email: user.email,
      role: user.role
    }

    return res.status(200).json({message: "Login successful", userObj});

  }catch(error){
    return res.status(500).json({message: "Error verifying otp, please try again after sometime", error: error.message});
  }
}

//get all users
exports.getAllUsers = async (req, res) => {
  try{
    const users = await User.find();
    if(!users){
      return res.status(404).json({message: "Users not found"});
    }
    return res.status(200).json({message: "Users fetched successfully", users});
  }catch(error){
    return res.status(500).json({message: "Error fetching users, please try again after sometime", error: error.message});
  }
}

//fetch user by id
exports.getUserById = async (req, res) => {
  try{
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    return res.status(200).json({message: "User fetched successfully", user});
  }catch(error){
    return res.status(500).json({message: "Error fetching user, please try again after sometime", error: error.message});
  }
}

//update user by id
exports.updateUserById = async (req, res) => {
  try{
    const {id} = req.params;
    const {name, email, password, role} = req.body;
    const user = await User.findById(id);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    user.name = name;
    user.email = email;
    user.password = password;
    user.role = role;
    await user.save();
    return res.status(200).json({message: "User updated successfully", user});
  }catch(error){
    return res.status(500).json({message: "Error updating user, please try again after sometime", error: error.message});
  }
}


//soft delete user by id
exports.deleteUserById = async (req, res) => {
  try{
    const {id} = req.params;
    const user = await User.findById(id);
    if(!user){
      return res.status(404).json({message: "User not found"});
    }
    user.isActive = true;
    await user.save();
    return res.status(200).json({message: "User deleted successfully", user});
  }catch(error){
    return res.status(500).json({message: "Error deleting user, please try again after sometime", error: error.message});
  }
}


