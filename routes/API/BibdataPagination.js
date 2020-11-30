
module.exports = async (req, res) => {
    try {
        var GetAllBibID = await req.models.databib.findAll({ attributes: ['Bib_ID'], group: ['Bib_ID'] });
        var ObjDataBib = {};
        // console.log(GetAllBibID);
        // for (const key in GetAllBibID) {
        //     if (GetAllBibID.hasOwnProperty(key)) {
        //         console.log(key);
        //         var ObjSingleBib = await databib.findAll({ attributes: ['Bib_ID', 'Field', 'Subfield'], where: { Bib_ID: GetAllBibID[key] } });
        //         ObjDataBib.push(ObjSingleBib);
        //     }
        // }
        res.send(GetAllBibID);
    } catch (e) {
        console.log(e);
        res.status(400).send('something error with',e)
    }


}


//   module.exports = async (req, res) => {  
//     try{
//         var reqCurrentPage = req.body.currentPage;
//         var reqPerPage = req.body.perPage;
//         var reqSortColumn = req.body.sortColumn;
//         var reqSortType = req.body.sortType;
//         var reqKeywordSearch = req.body.keywordSearch;
//         var reqStartDate = req.body.startDate;
//         var reqStopDate = req.body.stopDate;

//         var ifValidate = true; var countFailCase = 0;
//         var resValue = {}; var resText = []; var resStatus = null; var resCode = null;

//         if(
//             reqSortColumn && reqSortColumn !=  null && reqSortColumn != undefined
//             && reqSortType && reqSortType !=  null && reqSortType != undefined
//         ){
//             var objPagination = {}; var objWhereBank = {}; var arrOrderBy = [];

//             ///////////// Find Amount Pagination Page //////////////
//             if(reqCurrentPage){ objPagination.currentPage = parseInt(reqCurrentPage); }else{ objPagination.currentPage = 1; }
//             if(reqPerPage){ objPagination.perPage = parseInt(reqPerPage); }else{ objPagination.perPage = 10; }
//             if(objPagination.currentPage && objPagination.perPage){ objPagination.startPage = (objPagination.currentPage - 1) * objPagination.perPage; }else{ resText.push('Pagination PerPage OR PaginationPage Data is undefined'); }
//             //////////////////////////////////////////////////////////

//             if(objPagination.startPage >= 0){

//                 //////////////// Filter Main Condition /////////////////
//                 objWhereBank.deletedAt = { [req.models.sequelize.Op.eq]: null };
//                 if(reqKeywordSearch && reqKeywordSearch != null && reqKeywordSearch != undefined){
//                     objWhereBank[req.models.sequelize.Op.or] = [
//                         req.models.sequelize.where(req.models.sequelize.col('bank.bank_name'), { [req.models.sequelize.Op.like]: %${reqKeywordSearch}% }),
//                         req.models.sequelize.where(req.models.sequelize.col('bank.bank_branch'), { [req.models.sequelize.Op.like]: %${reqKeywordSearch}% }),
//                         req.models.sequelize.where(req.models.sequelize.col('bank.bank_account_number'), { [req.models.sequelize.Op.like]: %${reqKeywordSearch}% }),
//                         req.models.sequelize.where(req.models.sequelize.col('bank.bank_account_name'), { [req.models.sequelize.Op.like]: %${reqKeywordSearch}% })
//                     ]
//                 }
//                 if(
//                     reqStartDate && reqStartDate != null && reqStartDate != undefined 
//                     && reqStopDate && reqStopDate != null && reqStopDate != undefined
//                 ){ objWhereBank.createdAt = { [req.models.sequelize.Op.between]: [reqStartDate, reqStopDate] }; }

//                 ///////////////// Filter Main OrderBy //////////////////

//                 arrOrderBy = [reqSortColumn, reqSortType];

//                 ////////////////////////////////////////////////////////


//             }else{ countFailCase++; resText.push('Start Page length less than to 0 fail'); }

//             var bankFindAll = await req.models.bank.findAll({
//                 attributes: [
//                     'bank_id', 'bank_name','bank_branch','bank_account_number',
//                     'bank_account_name', 'bank_img_path'
//                 ],
//                 where: objWhereBank,
//                 order: [arrOrderBy],
//                 offset: objPagination.startPage,
//                 limit: objPagination.perPage,
//             });

//             if(bankFindAll && bankFindAll.length > 0){ resValue.resBankFindAll = bankFindAll; }
//             else{ countFailCase++; resText.push(Select bank is fail); }

//             if(countFailCase > 0){ ifValidate = false; resCode = 204; resStatus = No Content; resValue = Warning; }

//             if(ifValidate){ res.json({ code: 200, status: OK, value: resValue, failCase: countFailCase, text: resText }); }
//             else{ res.json({ code: resCode, status: resStatus, value: resValue, failCase: countFailCase, text: resText }); }
//         }else{
//             res.send(JSON.stringify({ code: 400, status: Bad Request, value: Fail, text: Request Data is undefined }));
//         }
//     }catch(e){
//         console.log(e)
//         res.send(JSON.stringify({ code: 404, status: Not Found, value: Fail, text: Data is catch }));
//     }
// }