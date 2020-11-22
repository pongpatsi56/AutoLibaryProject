module.exports =(sequelize,DataTypes) => {
    const SubfieldModel = sequelize.define("SubfieldModel",{
        subfield_ID:{
            type:DataTypes.INTEGER(6),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        mem_Citizenid:{
            type:DataTypes.STRING(13)  + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        FName:{
            type:DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        LName:{
            type:DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Username:{
            type:DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Password:{
            type:DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Position:{
            type:DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        mem_type:{
            type:DataTypes.INTEGER(2),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return SubfieldModel;
}