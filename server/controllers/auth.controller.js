const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Admin, User } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { logger } = require('../logger');


const registerAdmin = async (req, res) => {
    const log = logger.child({ logMetadata: `Admin ${req.body?.email || 'Unkonown'}` });

    try {
        const { fullname, email, companyName, password } = req.body;

        if (!fullname || !email || !companyName || !password) {
            log.warn(`Missing required fields: ${JSON.stringify(req.body)}`);
            return res.status(400).json({ message: 'All fields are required: fullname, email, companyName, password' });
        }

        // check if email is taken
        const emailExists = await Admin.findOne({
            where: {
                email
            }
        });

        if (emailExists) {
            log.warn(`Email already registered: ${email}`);
            return res.status(401).json({ message: 'Email already registered' });
        }

        // check if fullname is taken
        const fullnameExists = await Admin.findOne({
            where: {
                fullname
            }
        });

        if (fullnameExists) {
            log.warn(`Fullname already registered: ${email}`)
            return res.status(401).json({ message: 'Fullname already registered' });
        }

        // Create Admin
        // hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const adminId = uuidv4();

        // Create Admin
        const newAdmin = await Admin.create({
            id: adminId,
            fullname,
            email,
            companyName,
            password: hashedPassword,
        });

        log.info(`${fullname}'s admin account created successfullly`);
        return res.status(200).json({ message: `${fullname}'s admin account created successfully` });

    } catch (error) {
        log.error({
            message: `Failed to create admin account: ${error.message}`,
            stack: error.stack,
        });
        return res.status(500).json({ message: "Failed to create admin account" });
    }
};


const login = async (req, res) => {
    const log = logger.child();

    try {
        const { email, password } = req.body;

        // Try to find the user in Admin first
        let user = await Admin.findOne({ where: { email } });
        let userType = 'admin';

        // If not found in Admin, try in User
        if (!user) {
            user = await User.findOne({ where: { email } });
            userType = 'user';
        }

        if (!user) {
            log.warn(`Login failed - Email not found: ${email}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        };

        // check if inputed password matches user password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            log.warn(`Login failed - Incorrect password for email: ${email}`);
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        // create cookie
        const age = 1000 * 60 * 60 * 24  // token lasts for 24 hours
        const token = jwt.sign(
            {
                id: user.id,
                type: userType
            }, process.env.JWT_SECRET_KEY, { expiresIn: age });

        const { password: userPassword, ...info } = user.dataValues;

        const cookieName = userType === 'admin' ? 'adminToken' : 'userToken';

        res.cookie(cookieName, token, {
            httpOnly: true,
            // secure: true,  // uncomment before production
            maxAge: age,
        }).status(200).json({ info, message: 'Login successful' });
        log.info('Login successful');

    } catch (error) {
        log.error({
            message: `Failed to login: ${error.message}`,
            stack: error.stack,
        });
        return res.status(500).json({ message: "Failed to login" });
    }
};


const logout = async (req, res) => {
    const log = logger.child({ logMetadata: `User ${req.userId || 'Unknown'}` });

    try {
        res.clearCookie("userToken").status(200).json({ message: "Logout successful" })
        log.info('Logout successful');
    } catch (error) {
        log.error({
            message: `Register failed: ${error.message}`,
            stack: error.stack,
            email: req.userId || 'Unknown'
        });
        return res.status(500).json({ message: "Failed to logout user" });
    };
};

module.exports = { registerAdmin, login, logout };
