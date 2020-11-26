module.exports =(sequelize,DataTypes) => {
    const databib_item = sequelize.define("databib_item",{
        Barcode:{
            type:DataTypes.STRING(13),
            allowNull:false,
            validate:{
                notEmpty:true
            },
            primaryKey: true
        },
        Bib_ID:{
            type:DataTypes.STRING(10) + ' CHARSET utf8 COLLATE utf8_unicode_ci',
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        Copy:{
            type:DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        },
        borrowandreturn_bnr_ID:{
            type:DataTypes.INTEGER(20),
        },
        item_in:{
            type:DataTypes.DATE,
            defaultValue: DataTypes.NOW,
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        item_out:{
            type:DataTypes.DATE,
        },
        libid_getitemin:{
            type:DataTypes.INTEGER(11),
            allowNull:false,
            validate:{
                notEmpty:true
            }
        },
        libid_getitemout:{
            type:DataTypes.INTEGER(11),
        },
        item_description:{
            type:DataTypes.TEXT + ' CHARSET utf8 COLLATE utf8_unicode_ci',
        },
    });

    databib_item.associate = models =>{
        databib_item.hasMany(models.databib,{
            foreignKey: 'Bib_ID'
        })
    };
    return databib_item;
}