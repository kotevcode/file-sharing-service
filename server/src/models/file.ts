import { Model, DataTypes } from 'sequelize';

export default class File extends Model {
  id!: string;
  createdAt!: Date;
  s3Key!: string;
  expiresAt!: Date;
  deleted!: boolean;

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
    deleted: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  };

  static initData = {
    modelName: 'File',
    tableName: 'files',
  };
}
