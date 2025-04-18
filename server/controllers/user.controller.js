const { Admin, User } = require("../models");
const { logger } = require('../logger');


const profile = async (req, res) => {
    const log = logger.child({ logMetadata: `User/Admin ${req.userId || req.adminId || 'Unknown'}` });

    try {
        const userId = req.userId;
        const adminId = req.adminId;

        if (!userId && !adminId) {
            log.warn('Missing both userId and adminId in request.');
            return res.status(400).json({ message: 'Missing identification in request.' });
        }

        let userProfile;

        if (userId) {
            userProfile = await User.findOne({ where: { id: userId } });
        } else if (adminId) {
            userProfile = await Admin.findOne({ where: { id: adminId } });
        }

        if (!userProfile) {
            log.warn(`Profile not found for User/Admin, id: ${req.userId}`);
            return res.status(404).json({ message: "User/Admin profile not found" });
        };

        const { password: userPassword, ...userInfo } = userProfile.dataValues;

        log.info('Profile retrieved successfully');
        return res.status(200).json({ userProfileDetails: userInfo });
    } catch (error) {
        log.error({
            message: `Failed to retrieve profile: ${error.message}`,
            stack: error.stack,
            userId: req.userId || 'Unknown'
        });
        return res.status(500).json({ message: "Failed to get User/Admin profile" });
    };
};


module.exports = { profile };
