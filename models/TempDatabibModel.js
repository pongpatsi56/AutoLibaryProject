module.exports =(sequelize,DataTypes) => {
    const temp_databib = sequelize.define("temp_databib",{
        tempdatabib_ID:{
            type:DataTypes.INTEGER(10),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        template_ID:{
            type:DataTypes.STRING(10) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Field:{
            type:DataTypes.STRING(6) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Indicator1:{
            type:DataTypes.STRING(1) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        },
        Indicator2:{
            type:DataTypes.STRING(1) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        },
        Subfield:{
            type:DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    });

    temp_databib.associate = models =>{
        temp_databib.belongsTo(models.template,{
            foreignKey: 'template_ID'
        })
    };

    return temp_databib;
}