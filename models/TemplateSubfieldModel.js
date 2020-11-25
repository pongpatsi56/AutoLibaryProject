module.exports =(sequelize,DataTypes) => {
    const temp_subfield = sequelize.define("temp_subfield",{
        ts_ID:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true,
            autoIncrement: true
        },
        Field:{
            type:DataTypes.INTEGER(3),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Subfield:{
            type:DataTypes.STRING(250) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return temp_subfield;
}