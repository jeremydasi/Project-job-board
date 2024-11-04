import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const User = sequelize.define('users', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        user_firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_place: {
            type: DataTypes.STRING,
        },
        type_contract: {
            type: DataTypes.STRING,
        },
    }, {
        // Désactiver la création automatique de createdAt et updatedAt
        timestamps: false,
    });

    return User;
};
