var chapterNumber=2;

var jsCode=$(".cells").eq(0).find(".ncells").eq(0).find("a").attr("href");
var patt = /'[0-9]*'/g;
var params=jsCode.match(patt);

while (chapterNumber<9){
    var $ncells=$(".cells").eq(chapterNumber).find(".ncells");
    for (var i=0;i<$ncells.length;i++){
        var $ncell=$ncells.eq(i);
        var chapterId=$ncell.find("h4").attr("id").substr(3);
        $ncell.find(".roundpointStudent.lock").removeClass("lock").addClass("orange01");
        var $a=$ncell.find("a");
        var newJsCode="javascript:getTeacherAjax("+params[0]+","+params[1]+",'"+chapterId+"');";
        console.info(newJsCode);
        $a.attr("href",newJsCode);
    }

    chapterNumber++;
}

