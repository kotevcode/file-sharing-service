import { Model, DataTypes } from 'sequelize';

export default class Bool extends Model {
  id!: string;
  createdAt!: Date;
  s3Key!: string;
  expiresAt!: Date;

  static DataTypes = {
    id: {
      type         : DataTypes.UUID,
      primaryKey   : true,
      defaultValue : DataTypes.UUIDV4,
      allowNull    : false,
      autoIncrement: false,
    },
    createdAt: {
      type: DataTypes.DATE,
    },
    s3Key: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    expiresAt: {
      type: DataTypes.DATE,
    },
  };

  static initData = {
    modelName: 'File',
    tableName: 'files',
  };
}
