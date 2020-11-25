module.exports =(sequelize,DataTypes) => {
    const highschoollevel = sequelize.define("highschoollevel",{
        highschoollevel_ID:{
            type:DataTypes.INTEGER(10),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        Class:{
            type:DataTypes.STRING(25) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Classroom:{
            type:DataTypes.STRING(25) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
    })
    return highschoollevel;
}