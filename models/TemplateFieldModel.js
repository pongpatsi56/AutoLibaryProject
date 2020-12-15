module.exports =(sequelize,DataTypes) => {
    const temp_field = sequelize.define("temp_field",{
        tf_ID:{
            type:DataTypes.INTEGER(20),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true,
            autoIncrement: true
        },
        Temp:{
            type:DataTypes.INTEGER(50),
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
    })
    return temp_field;
}