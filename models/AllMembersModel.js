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
            type: DataTypes.STRING(13),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        FName: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        LName: {
            type: DataTypes.STRING(45),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Username: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Password: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        Position: {
            type: DataTypes.STRING(20),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        mem_type: {
            type: DataTypes.INTEGER(2),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
    })
    return allmembers;
}