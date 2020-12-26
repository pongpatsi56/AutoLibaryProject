module.exports =(sequelize,DataTypes) => {
    const template = sequelize.define("template",{
        template_ID:{
            type:DataTypes.INTEGER(20),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true,
            autoIncrement: true
        },
        Name:{
            type:DataTypes.STRING(255) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Type:{
            type:DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Description:{
            type:DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    });
    template.associate = models => {
        template.hasMany(models.temp_databib, {foreignKey: 'template_ID'});
    };
    return template;
}