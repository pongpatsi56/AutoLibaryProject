module.exports =(sequelize,DataTypes) => {
    const fine_reciept = sequelize.define("fine_reciept",{
        receipt_ID:{
            type:DataTypes.STRING(15) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        bnr_ID:{
            type:DataTypes.INTEGER(20),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Payment_Total:{
            type:DataTypes.DOUBLE(45,2),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Payment_Real:{
            type:DataTypes.DOUBLE(45,2),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Paid:{
            type:DataTypes.DOUBLE(45,2),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Change:{
            type:DataTypes.DOUBLE(45,2),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Free:{
            type:DataTypes.DOUBLE(45,2),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Discription:{
            type:DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return fine_reciept;
}