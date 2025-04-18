const Sequelize = require("sequelize");
const { config } = require("./config")


const sequelize = new Sequelize(config.DB_NAME, config.DB_USER, config.DB_PASSWORD, {
    host: config.DOMAIN_NAME,
    dialect: "postgres"
});

(async () => {
    try {
        await sequelize.authenticate();
        console.log("Connection established successfully!");
    } catch (error) {
        console.log("Unable to connect to the database: ", error);
    };
})();

export default sequelize;
