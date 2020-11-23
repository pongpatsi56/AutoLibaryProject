module.exports =(sequelize,DataTypes) => {
    const indicator = sequelize.define("indicator",{
        indicator_ID:{
            type:DataTypes.INTEGER(5),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        Field:{
            type:DataTypes.INTEGER(3),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Code:{
            type:DataTypes.STRING(2) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Description:{
            type:DataTypes.STRING(100) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Order:{
            type:DataTypes.INTEGER(1),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return indicator;
}