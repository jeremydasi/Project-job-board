// models/user.js
import { DataTypes } from 'sequelize';
import bcrypt from 'bcrypt';

export default (sequelize) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    user_firstname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_lastname: {
      type: DataTypes.STRING,
      allowNull: false
    },
    user_email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    password: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    user_place: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    type_contract: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    tableName: 'users', // Nom de table spécifique
    timestamps: false    
  });

  // Avant de sauvegarder un utilisateur, on hache le mot de passe s'il a été modifié
  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      user.password = await bcrypt.hash(user.password, 10);
    }
  });

  return User;
};
