const express = require('express')
const bodyParser = require('body-parser')
const mysql = require('mysql')



const app = express()
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));





//--------------------------- database connecte & query ---------------------------

var database = mysql.createConnection({
  host: "bidaazao1nlrlvinmdcr-mysql.services.clever-cloud.com",
  database : "bidaazao1nlrlvinmdcr",
  user: "uvqolx3wh67olxir",
  password: "DLtbVarwhKt2rrCmyKGL"
});

database.connect(function(err) {
if (err) throw err;
console.log("Connected!");
});

var sqlRwah = "SELECT DISTINCT RawyID, RawyName FROM `0-3rwaah` WHERE RawyID != 12;"
let rwah=[];
database.query(sqlRwah, function (err, result) {
  if (err) throw err;
  rwah = result;
}); 


var sqlSorah = "SELECT DISTINCT `1-6sorah`.`SorahID`, `1-6sorah`.`SorahName` FROM `1-6sorah` ORDER BY `1-6sorah`.`SorahID` ASC;"
let Sorah=[];
database.query(sqlSorah, function (err, result) {
  if (err) throw err;
  Sorah = result;
}); 


var sqlBab = "SELECT DISTINCT `1-1abwab`.`BabID`, `1-1abwab`.`BabName` FROM `1-1abwab` ORDER BY `1-1abwab`.`BabID` ASC"
let Bab=[];
database.query(sqlBab, function (err, result) {
  if (err) throw err;
  Bab = result;
});



//--------------------------- Home page ---------------------------

var noOfKelafat = 1;
var searchType = "true";


// app.get('/', function(req, res, next) { 
//     database.query('SELECT DISTINCT `1-1abwab`.`BabID`, `1-1abwab`.`BabName` FROM `1-1abwab` ORDER BY `1-1abwab`.`BabID` ASC', function(error, data){
//         res.render('HomePage.ejs', { Bab_data : Bab , Sorah:Sorah, rwah:rwah , searchType:searchType, noOfKelafat:noOfKelafat});
//     });      
// });

app.get('/', function(req, res, next) {
  res.render('HomePage.ejs', { Bab_data : Bab , Sorah:Sorah, rwah:rwah , searchType:searchType, noOfKelafat:noOfKelafat});
});




app.get('/get_data', function(request, response, next){

  var type = request.query.type;

  var search_query = request.query.parent_value;
  if(type == 'load_Khelaf')
  {        
      var query = 'SELECT DISTINCT `1-2khelafat`.`KhelafID`, `1-2khelafat`.`KhelafAName`, `1-2khelafat`.`KhelafEName` FROM `1-2khelafat`, `1-5babkhelaf` WHERE `1-2khelafat`.`KhelafID` = `1-5babkhelaf`.`KhelafID` AND `1-5babkhelaf`.`BabID` = ' + search_query + ' ORDER BY `1-2khelafat`.`KhelafID` ASC;'
  }else if(type == 'load_Sorah')
  {
      var query = 'SELECT DISTINCT `1-7ٍayat`.`AyahID` FROM `1-7ٍayat` WHERE `1-7ٍayat`.`sorahID` = ' + search_query + '; ';
  }

  database.query(query, function(error, data){

      var data_arr = [];
      data.forEach(function(row){
          data_arr.push(row);
      });
      response.json(data_arr);

  });

});

//--------------------------- Change noOfKelaf ---------------------------

app.post("/noOfKelaf", function(req, res) {

  if (req.body.button==="add"){
      noOfKelafat++;
      res.redirect("/"); 
  } else if (req.body.button==="remove") {
      if (noOfKelafat>1){noOfKelafat--;}
      res.redirect("/"); 
  } 
});


//--------------------------- Change searchingType ---------------------------

app.post("/GoHome", function(req, res) {
  noOfKelafat = 1;
  res.redirect("/"); 
});


//--------------------------- Change searchingType ---------------------------

app.post("/searchingType", function(req, res) {
  searchType = req.body.searchingType;
  noOfKelafat = 1;
  res.redirect("/"); 
});


//--------------------------- submit ---------------------------

app.post("/submit", (req, res) => {
  var khelafID = []; var KhelafAName = []; var KhelafEName = []; var word = []; var RawyID = []; var TableName = []; var TableQuery = []; var khelafat = []; var Ayah = '';
  let Sorah=[];
  if (searchType==='true'){
      console.log(req.body);

      if (typeof(req.body.RawyID) === 'object'){
          req.body.RawyID.forEach(function(row){
              RawyID.push(row);
          });
      } else {
          RawyID.push(req.body.RawyID);   
      }    


      if ( (req.body.Sorah==1) && (req.body.Ayah==1) ){
          var SQL = "SELECT `101000albasmalah`.`AwalAssorah` AS ' C0' ,`117003haasakt`.`Mothakkar` AS ' C1' , GROUP_CONCAT(DISTINCT (`0-3rwaah`.`RawyName`) ORDER BY `0-3rwaah`.`RawyID` ASC SEPARATOR ' ، ' ) as 'C2'  FROM  `0-1treeq`, `0-3rwaah` ,`101000albasmalah`,`103008edgham_hamz`,`105000madd_naql_sakt`,`117003haasakt` WHERE `0-1treeq`.`RawyID`= `0-3rwaah`.`RawyID` AND `0-1treeq`.`RawyID` IN ("+RawyID.toString()+") AND `101000albasmalah`.`ColID` = `0-1treeq`.`ColID` AND `103008edgham_hamz`.`ColID` = `105000madd_naql_sakt`.`ColID` AND `103008edgham_hamz`.`munfasel` = `105000madd_naql_sakt`.`munfasel` AND `103008edgham_hamz`.`muttasel` = `105000madd_naql_sakt`.`muttasel` AND `105000madd_naql_sakt`.`ColID` = `0-1treeq`.`ColID` AND `117003haasakt`.`ColID` = `103008edgham_hamz`.`ColID` AND `117003haasakt`.`edgham` = `103008edgham_hamz`.`EdghamKabeer` GROUP BY `101000albasmalah`.`AwalAssorah`,`117003haasakt`.`Mothakkar` ORDER BY `101000albasmalah`.`AwalAssorah`,`117003haasakt`.`Mothakkar` ;";
          khelafat.push('أول السورة', 'ٱلعـٰلمین' , 'الرواة');
          Ayah = "﴿بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیمِ ۝١ ٱلۡحَمۡدُ لِلَّهِ رَبِّ ٱلۡعَـٰلَمِینَ ۝٢﴾"


          database.query(SQL, function (err, data) {
              if (err) throw err;
              res.render('result.ejs', { data : data, khelafat : khelafat , Ayah:Ayah});    
          }); 


      } else if (  (req.body.Sorah==1) && (req.body.Ayah==7)  ){

          var SQL = "SELECT `102002seratt`.`seratt2` AS ' C0' ,`102010hom`.`Alyhom` AS ' C1' ,`105000madd_naql_sakt`.`MeemJame` AS ' C2' ,`102010hom`.`Alyhom` AS ' C3' ,`105000madd_naql_sakt`.`MeemJame` AS ' C4' ,`117003haasakt`.`Mothakkar` AS ' C5' , GROUP_CONCAT(DISTINCT (`0-3rwaah`.`RawyName`) ORDER BY `0-3rwaah`.`RawyID` ASC SEPARATOR ' ، ' ) as 'C6'  FROM  `0-1treeq`, `0-3rwaah` ,`102002seratt`,`105000madd_naql_sakt`,`102010hom`,`103008edgham_hamz`,`117003haasakt` WHERE `0-1treeq`.`RawyID`= `0-3rwaah`.`RawyID` AND `0-1treeq`.`RawyID` IN ("+RawyID.toString()+") AND `102002seratt`.`ColID` = `0-1treeq`.`ColID` AND `105000madd_naql_sakt`.`ColID` = `0-1treeq`.`ColID` AND `102010hom`.`RawyID` = `0-1treeq`.`RawyID` AND `103008edgham_hamz`.`ColID` = `105000madd_naql_sakt`.`ColID` AND `103008edgham_hamz`.`munfasel` = `105000madd_naql_sakt`.`munfasel` AND `103008edgham_hamz`.`muttasel` = `105000madd_naql_sakt`.`muttasel` AND `117003haasakt`.`ColID` = `103008edgham_hamz`.`ColID` AND `117003haasakt`.`edgham` = `103008edgham_hamz`.`EdghamKabeer` GROUP BY `102002seratt`.`seratt2`,`102010hom`.`Alyhom`,`105000madd_naql_sakt`.`MeemJame`,`102010hom`.`Alyhom`,`105000madd_naql_sakt`.`MeemJame`,`117003haasakt`.`Mothakkar` ORDER BY `102002seratt`.`seratt2`,`102010hom`.`Alyhom`,`105000madd_naql_sakt`.`MeemJame`,`102010hom`.`Alyhom`,`105000madd_naql_sakt`.`MeemJame`,`117003haasakt`.`Mothakkar`;";
          khelafat.push('صِرَ ٰ⁠طَ','عَلَیۡهِمۡ (الهاء)','عَلَیۡهِمۡ (الميم)','عَلَیۡهِمۡ (الهاء)','عَلَیۡهِمۡ (الميم)','ٱلضَّاۤلِّینَ' , 'الرواة');
          Ayah = "﴿صِرَ ٰ⁠طَ ٱلَّذِینَ أَنۡعَمۡتَ عَلَیۡهِمۡ غَیۡرِ ٱلۡمَغۡضُوبِ عَلَیۡهِمۡ وَلَا ٱلضَّاۤلِّینَ﴾";


          database.query(SQL, function (err, data) {
              if (err) throw err;
              res.render('result.ejs', { data : data, khelafat : khelafat , Ayah:Ayah});    
          }); 

      } else if (  (req.body.Sorah==2) && (req.body.Ayah==2)  ){

          var SQL = "SELECT `105001maddtabreaa`.`maddtabreaa` AS ' C0' ,`104001haaalkenayah`.`haaSaken` AS ' C1' ,`103008edgham_hamz`.`EdghamKabeer` AS ' C2' ,`112000annonwaattanween`.`GunnahLam` AS ' C3' ,`117003haasakt`.`Mothakkar` AS ' C4' , GROUP_CONCAT(DISTINCT (`0-3rwaah`.`RawyName`) ORDER BY `0-3rwaah`.`RawyID` ASC SEPARATOR ' ، ' ) as 'C5'  FROM  `0-1treeq`, `0-3rwaah` ,`103008edgham_hamz`,`105000madd_naql_sakt`,`104001haaalkenayah`,`105001maddtabreaa`,`112000annonwaattanween`,`117003haasakt` WHERE `0-1treeq`.`RawyID`= `0-3rwaah`.`RawyID` AND `0-1treeq`.`RawyID` IN ("+RawyID.toString()+") AND  `103008edgham_hamz`.`ColID` = `105000madd_naql_sakt`.`ColID` AND `103008edgham_hamz`.`munfasel` = `105000madd_naql_sakt`.`munfasel` AND `103008edgham_hamz`.`muttasel` = `105000madd_naql_sakt`.`muttasel` AND `105000madd_naql_sakt`.`ColID` = `0-1treeq`.`ColID` AND `104001haaalkenayah`.`QarieID` = `0-1treeq`.`QarieID` AND `105001maddtabreaa`.`ColID` = `0-1treeq`.`ColID` AND `112000annonwaattanween`.`ColID` = `0-1treeq`.`ColID` AND `117003haasakt`.`ColID` = `103008edgham_hamz`.`ColID` AND `117003haasakt`.`edgham` = `103008edgham_hamz`.`EdghamKabeer` GROUP BY `105001maddtabreaa`.`maddtabreaa`,`104001haaalkenayah`.`haaSaken`,`103008edgham_hamz`.`EdghamKabeer`,`112000annonwaattanween`.`GunnahLam`,`117003haasakt`.`Mothakkar` ORDER BY `105001maddtabreaa`.`maddtabreaa`,`104001haaalkenayah`.`haaSaken`,`103008edgham_hamz`.`EdghamKabeer`,`112000annonwaattanween`.`GunnahLam`,`117003haasakt`.`Mothakkar` ;";
          khelafat.push('لَا رَیۡبَۛ','فِیهِۛ هُدًى (صلة هـ)','فِیهِۛ هُدًى (الإدغام الكبير)','هُدًى لِّلۡمُتَّقِینَ (إدغام ل)','لِّلۡمُتَّقِینَ (هاء السكت)','الرواة');
          Ayah = "﴿ذَ ٰ⁠لِكَ ٱلۡكِتَـٰبُ لَا رَیۡبَۛ فِیهِۛ هُدًى لِّلۡمُتَّقِینَ﴾";


          database.query(SQL, function (err, data) {
              if (err) throw err;
              res.render('result.ejs', { data : data, khelafat : khelafat , Ayah:Ayah});    
          }); 

      } else {

          res.send("جاري العمل عليها");
      }


  } else {

      // -------- khelafID, KhelafAName, KhelafEName ----------
      if (typeof(req.body.Khelaf) === 'object'){
          req.body.Khelaf.forEach(function(row){
              khelafID.push(JSON.parse(row).KhelafID );
              KhelafAName.push(JSON.parse(row).KhelafAName );
              KhelafEName.push(JSON.parse(row).KhelafEName );
          });
      } else {
          khelafID.push(JSON.parse(req.body.Khelaf).KhelafID );
          KhelafAName.push(JSON.parse(req.body.Khelaf).KhelafAName );
          KhelafEName.push(JSON.parse(req.body.Khelaf).KhelafEName );
      }

      // --------------------   word   ----------------------
      if (typeof(req.body.word) === 'object'){
          req.body.word.forEach(function(row){
              word.push(row);
          });
      } else {
          word.push(req.body.word);   
      }

      // ---------------------------------------------------

      for (var i in KhelafAName){
          if (word[i] === '') {khelafat.push(KhelafAName[i]) } else {khelafat.push(word[i])}
     }
      
      // ---------------------------------------------------
  

      // --------------------  RawyID  ----------------------
      if (typeof(req.body.RawyID) === 'object'){
          req.body.RawyID.forEach(function(row){
              RawyID.push(row);
          });
      } else {
          RawyID.push(req.body.RawyID);   
      }    
      // ---------------------------------------------------

      var sqlTableQuery = "SELECT DISTINCT `1-3tabels`.`TableName`, `1-3tabels`.`TableQuery` FROM `1-3tabels`, `1-4khelaftable` WHERE `1-3tabels`.`TableID` = `1-4khelaftable`.`TableID` AND `1-4khelaftable`.`KhelafID` in ("+khelafID.toString()+");";

      database.query(sqlTableQuery, function (err, data) {
          if (err) throw err;
          data.forEach(function(row){
              TableName.push(row.TableName);
              TableQuery.push(row.TableQuery);
          });   
          
          var SELECT = "SELECT ";
          for (var i in KhelafEName){
               SELECT += KhelafEName[i] + " AS ' C"+ i +"' ,";
          }
          khelafat.push("الرواة");
          SELECT += " GROUP_CONCAT(DISTINCT (`0-3rwaah`.`RawyName`) ORDER BY `0-3rwaah`.`RawyID` ASC SEPARATOR ' ، ' ) as 'C"+KhelafAName.length+"' "
          var FROM = " FROM  `0-1treeq`, `0-3rwaah` ," + TableName.toString();
          var WHERE = " WHERE `0-1treeq`.`RawyID`= `0-3rwaah`.`RawyID` AND `0-1treeq`.`RawyID` IN ("+RawyID.toString()+") AND " + TableQuery.join(" AND ");
          var GroupOrder = " GROUP BY " + KhelafEName.toString() + " ORDER BY " + KhelafEName.toString() + " ; " ;
          
          var sqlresult = SELECT + FROM + WHERE + GroupOrder;
          console.log(sqlresult);


          database.query(sqlresult, function (err, data) {
              if (err) throw err;
              res.render('result.ejs', { data : data, khelafat : khelafat , Ayah:Ayah});    
          }); 



      }); 

  }
      
  
      // ---------------------------------------------------
  
  

});











app.listen(port, () => {
  console.log(`app listening on port ${port}`)
})
