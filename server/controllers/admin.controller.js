const bcrypt = require("bcrypt");
const { Admin, User } = require("../models");
const { v4: uuidv4 } = require("uuid");
const { logger } = require('../logger');
const { USER_ROLES  } = require('../constants');


const createUser = async (req, res) => {
    const log = logger.child({ logMetadata: `Admin ${req.body?.email || 'Unkonown'}` });

    try {
        const { fullname, email, password, role } = req.body;

        // check if fullname is taken
        const fullnameExists = await User.findOne({
            where: {
                fullname
            }
        });

        if (fullnameExists) {
            log.warn(`Fullname already registered: ${email}`)
            return res.status(401).json({ message: 'Fullname already registered' });
        }

        const fullnameExistsAdmin = await Admin.findOne({
            where: {
                fullname
            }
        });

        if (fullnameExistsAdmin) {
            log.warn(`Fullname already registered: ${email}`)
            return res.status(401).json({ message: 'Fullname already registered' });
        }

        // check if email is taken
        const emailExists = await User.findOne({
            where: {
                email: email
            }
        });

        if (emailExists) {
            log.warn(`Email already registered: ${email}`);
            return res.status(401).json({ message: 'Email already registered' });
        }

        const emailExistsAdmin = await User.findOne({
            where: {
                email: email
            }
        });

        if (emailExistsAdmin) {
            log.warn(`Email already registered: ${email}`);
            return res.status(401).json({ message: 'Email already registered' });
        }

        // Create User
        // hash password
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        const userId = uuidv4();

        // Create User
        const newUser = await User.create({
            id: userId,
            fullname,
            email,
            password: hashedPassword,
            role: USER_ROLES[role] || USER_ROLES.IT_SUPPORT,
            createdByAdminId: req.adminId
        });

        log.info(`${fullname}'s user account created successfullly`);
        return res.status(200).json({ message: `${fullname}'s user account created successfully` });

    } catch (error) {
        log.error({
            message: `Failed to create user account: ${error.message}`,
            stack: error.stack,
        });
        return res.status(500).json({ message: "Failed to create user account" });
    }
};


const getAllUsers = async (req, res) => {
    const log = logger.child({ logMetadata: `Admin ${req.adminId || 'Unkonown'}` });

    try {
        const { sortBy = 'createdAt', order = 'DESC', page = 1, limit = 10 } = req.query;
        const { userId, email, fullname } = req.body;
        let where = {};
        if (userId) where.id = userId;
        if (email) where.email = email;
        if (fullname) where.fullname = fullname;

        const pageNum = parseInt(page, 10);
        const pageLimit = parseInt(limit, 10);
        const offset = (pageNum - 1) * pageLimit;

        const { rows: users, count: totalUsers } = await User.findAndCountAll({
            where,
            order: [[sortBy, order]],
            limit: pageLimit,
            offset,
        });

        const totalPages = Math.ceil(totalUsers / pageLimit);

        log.info('User(s) profile retrieved successfully');
        return res.status(200).json({
            users,
            pagination: {
                totalUsers,
                totalPages,
                currentPage: pageNum,
                pageSize: users.length,
            },
        });
    } catch (error) {
        log.error({
            message: `Failed to get user(s) profile: ${error.message}`,
            stack: error.stack,
            adminId: req.adminId || 'Unknown'
        });
        return res.status(500).json({ message: "Failed to get user(s)" });
    }
};


const getUserById = async (req, res) => {
    const log = logger.child({ logMetadata: `Admin ${req.adminId || 'Unkonown'}` });

    try {
        const { id } = req.params;

        const user = await User.findOne({
            where: {
                id
            }
        });

        log.info(`User-${id} profile retrieved successfully`);
        return res.status(200).json({ user });
    } catch (error) {
        log.error({
            message: `Failed to get user's profile: ${error.message}`,
            stack: error.stack,
            adminId: req.adminId || 'Unknown'
        });
        return res.status(500).json({ message: "Failed to get user's profile" });
    }
};

module.exports = { createUser, getAllUsers, getUserById };
