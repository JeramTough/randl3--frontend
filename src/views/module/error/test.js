var chapterNumber=0;

var jsCode=$(".cells").find(".roundpointStudent.blue").eq(0).parent().parent().find("a").attr("href");
var patt = /'[0-9]*'/g;
var params=jsCode.match(patt);

while (chapterNumber<9){
    var $ncells=$(".cells").eq(chapterNumber).find(".ncells");
    for (var i=0;i<$ncells.length;i++){
        var $ncell=$ncells.eq(i);
        if ($ncell.find(".roundpointStudent.blue").length===0){
            var chapterId=$ncell.find("h4").attr("id").substr(3);
            $ncell.find(".roundpointStudent.lock").removeClass("lock").addClass("orange01");
            var $a=$ncell.find("a");
            var newJsCode="javascript:getTeacherAjax("+params[0]+","+params[1]+",'"+chapterId+"');";
            console.info(newJsCode);
            $a.attr("href",newJsCode);
        }
    }

    chapterNumber++;
}

