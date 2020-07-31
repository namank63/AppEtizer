var express= require("express");
var app = express();
app.set("view engine","ejs");
app.get("/", function(req,res){
    res.render("landing");
});
app.get("/food", function(req,res){
  var food = [
      {name: "Pizza" ,image:"https://www.tasteofhome.com/wp-content/uploads/2017/10/Chicken-Pizza_exps30800_FM143298B03_11_8bC_RMS-2.jpg"},
      {name: "Italian Pasta" ,image:"https://1.bp.blogspot.com/-0IwBC-Wltc8/W8_d-FuHaXI/AAAAAAAAC0o/wm0Hs1FmHjklNnUlXoCCmtbqnpqlwv1fQCLcBGAs/s1600/World%2BPasta%2BDay%2B2018.jpg"},
      {name: "Noodles" ,image:"http://new.nankaseimen.com/wp-content/uploads/2016/10/Nanka-0059.jpg"},
      {name: "Aalu paratha" ,image:"https://i.ytimg.com/vi/ohrbhGYQ-1o/maxresdefault.jpg"}
  ]
  res.render("food",{food:food});
});
 
app.listen(3000,function(){
    console.log("The AppEtizer server  has started");
});