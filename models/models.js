const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const UserSeller = sequelize.define("userseller", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.STRING, defaultValue: "SELLER" },
  number: { type: DataTypes.STRING, allowNull: false, unique: true },
  inn: { type: DataTypes.STRING, allowNull: false, unique: true },
  type: { type: DataTypes.STRING, allowNull: false },
  confirmationCode: { type: DataTypes.STRING },
  confirmed: { type: DataTypes.BOOLEAN, defaultValue: false }, // Добавленное поле для отслеживания подтверждения
});

module.exports = {
  UserSeller,
};
