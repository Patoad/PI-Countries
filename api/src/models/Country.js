const { DataTypes } = require('sequelize');
// Exportamos una funcion que define el modelo
// Luego le injectamos la conexion a sequelize.
module.exports = (sequelize) => {
  // defino el modelo
  sequelize.define('country', {
    
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    flags: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    continents: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    capital: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
    subregion: {
      type: DataTypes.INTEGER,
    },
    
    area: {
      type: DataTypes.INTEGER,
    },
    
    population: {
      type: DataTypes.INTEGER,
    },

    createdInDb: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },

  }, {
    timestamp: true,
    // createdAt: true,
    // updatedAt: false
  });
};