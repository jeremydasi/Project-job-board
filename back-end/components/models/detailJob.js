import { DataTypes } from 'sequelize';

export default (sequelize) => {
  const DetailJob = sequelize.define('DetailJob', {
    job_name: { type: DataTypes.STRING, allowNull: false },
    name_company: { type: DataTypes.STRING, allowNull: false },
    city: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.STRING, allowNull: false },
    poste_details: { type: DataTypes.TEXT, allowNull: false },
    address: { type: DataTypes.STRING, allowNull: false },
    description_company: { type: DataTypes.TEXT, allowNull: false },
    qualifications: { type: DataTypes.TEXT, allowNull: false },
    skills: { type: DataTypes.TEXT, allowNull: false },
    languages: { type: DataTypes.TEXT, allowNull: false }
  }, {
    tableName: 'detail_jobs',
    timestamps: false
  });

  return DetailJob;
};