const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const UserSeller = sequelize.define("userseller", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  img: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "ADMIN" },
  email: { type: DataTypes.STRING },
  number: { type: DataTypes.STRING, allowNull: false, unique: true },
  confirmationCode: { type: DataTypes.STRING },
  confirmed: { type: DataTypes.BOOLEAN, defaultValue: false }, // Добавленное поле для отслеживания подтверждения
  inn: { type: DataTypes.STRING, allowNull: false, unique: true },
});

module.exports = {
  UserSeller,
};
