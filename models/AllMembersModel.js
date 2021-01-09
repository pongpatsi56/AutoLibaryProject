module.exports = (sequelize, DataTypes) => {
    const allmembers = sequelize.define("allmembers", {
        member_ID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            validate: {
                notEmpty: true
            },
            primaryKey: true
        },
        mem_Citizenid: {
            type: DataTypes.STRING(13) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        FName: {
            type: DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        LName: {
            type: DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Username: {
            type: DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Password: {
            type: DataTypes.STRING(100) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Position: {
            type: DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Class:{
            type:DataTypes.STRING(25) + ' CHARSET utf8 COLLATE utf8_unicode_ci'
        },
        Classroom:{
            type:DataTypes.STRING(25) + ' CHARSET utf8 COLLATE utf8_unicode_ci'
        },
        profile_img:{
            type:DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        },
    })
    return allmembers;
}