const DataTypes = require("sequelize");
const sequelize = require("../config/db");
const Category = sequelize.define(
  "categories",
  {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    timestamps: true,
  }

);

module.exports = Category;