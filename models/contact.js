const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contact = sequelize.define('Contact', {
  phoneNumber: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
  linkedId: { type: DataTypes.INTEGER },
  linkPrecedence: { type: DataTypes.ENUM('primary', 'secondary'), allowNull: false },
  createdAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
  deletedAt: { type: DataTypes.DATE }
}, {
  timestamps: true,
  paranoid: true,
  tableName: 'Contacts'
});

module.exports = Contact;
