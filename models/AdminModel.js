module.exports = (sequelize, DataTypes) => {
    const admin = sequelize.define("admin", {
        admin_ID: {
            type: DataTypes.INTEGER(11),
            allowNull: false,
            validate: {
                notEmpty: true
            },
            primaryKey: true
        },
        adm_CitizenID: {
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
            type: DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Password: {
            type: DataTypes.STRING(45) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    })
    return admin;
}