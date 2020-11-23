module.exports =(sequelize,DataTypes) => {
    const field = sequelize.define("field",{
        field_ID:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        Field:{
            type:DataTypes.STRING(3)  + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Name:{
            type:DataTypes.STRING(80) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return field;
}