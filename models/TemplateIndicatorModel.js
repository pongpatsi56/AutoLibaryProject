module.exports =(sequelize,DataTypes) => {
    const temp_indicator = sequelize.define("temp_indicator",{
        ti_ID:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true,
            autoIncrement: true
        },
        Temp:{
            type:DataTypes.INTEGER(20),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Field:{
            type: DataTypes.STRING(6) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Indicator:{
            type:DataTypes.INTEGER(4),
        },
        Order:{
            type:DataTypes.INTEGER(1),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return temp_indicator;
}