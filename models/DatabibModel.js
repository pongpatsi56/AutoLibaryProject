module.exports =(sequelize,DataTypes) => {
    const databib = sequelize.define("databib",{
        databib_ID:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            autoIncrement: true,
            primaryKey: true
        },
        Bib_ID:{
            type:DataTypes.STRING(10) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Field:{
            type:DataTypes.INTEGER(3),
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

    databib.associate = models =>{
        databib.belongsTo(models.databib_item,{
            foreignKey: 'Bib_ID'
        })
    };

    return databib;
}