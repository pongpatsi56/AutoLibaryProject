module.exports =(sequelize,DataTypes) => {
    const field = sequelize.define("field",{
        field_ID:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Field:{
            type:DataTypes.STRING(6)  + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        Name:{
            type:DataTypes.STRING(80) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    });
    field.associate = models => {
        field.hasMany(models.subfield, {foreignKey: 'Field'});
        field.hasMany(models.indicator, { as: 'indicator1', foreignKey: 'Field' });
        field.hasMany(models.indicator, { as: 'indicator2', foreignKey: 'Field' });
    };
    return field;
}