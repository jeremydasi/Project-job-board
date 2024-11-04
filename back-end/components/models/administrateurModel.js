import { DataTypes } from 'sequelize';

export default (sequelize) => {
    const Administrateur = sequelize.define('administrateur', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        admin_firstname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin_lastname: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        admin_mail: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        admin_password: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name_company: {
            type: DataTypes.STRING,
            allowNull: false,
        },
    }, {
        // Désactiver la création automatique de createdAt et updatedAt
        timestamps: false,
    });

    return Administrateur;
};
