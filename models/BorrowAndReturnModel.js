module.exports =(sequelize,DataTypes) => {
    const borrowandreturn = sequelize.define("borrowandreturn",{
        bnr_ID:{
            type:DataTypes.INTEGER(20),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            autoIncrement: true,
            primaryKey: true
        },
        Librarian_ID:{
            type:DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Member_ID:{
            type:DataTypes.STRING(20) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Barcode:{
            type:DataTypes.STRING(13) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Bib_ID:{
            type:DataTypes.STRING(10) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Borrow:{
            type:DataTypes.DATE,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Due:{
            type:DataTypes.DATE,
            defaultValue:null
        },
        Returns:{
            type:DataTypes.DATE,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        
    });

    borrowandreturn.associate = models =>{
        borrowandreturn.belongsTo(models.databib_item,{
            foreignKey: 'Barcode'
        })
        borrowandreturn.belongsTo(models.databib,{ as: 'nameBooks',
            foreignKey: 'Bib_ID'
        })
    };

    return borrowandreturn;
}