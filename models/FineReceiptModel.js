module.exports =(sequelize,DataTypes) => {
    const fine_reciept = sequelize.define("fine_reciept",{
        receipt_ID:{
            type:DataTypes.INTEGER(20),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        bnr_ID:{
            type:DataTypes.INTEGER(20),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true,
            autoIncrement:true
        },
        receipt_NO:{
            type:DataTypes.STRING(10) + ' CHARSET utf8 COLLATE utf8_unicode_ci'
        },
        Amount:{
            type:DataTypes.DOUBLE(45,2),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        fine_type:{
            type:DataTypes.STRING(10) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        IsPaid:{
            type:DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Description:{
            type:DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci'
        },
    })
    return fine_reciept;
}