module.exports =(sequelize,DataTypes) => {
    const subfield = sequelize.define("subfield",{
        subfield_ID:{
            type:DataTypes.INTEGER(6),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        Field:{
            type:DataTypes.STRING(6)  + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Code:{
            type:DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Name_Eng:{
            type:DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return subfield;
}