



function grid1Cellclick(event) {
	var grid = event.args["grid"];
	var column = event.args["column"];
	var Index = event.args["Index"];
	var RecNo = event.args["RecNo"];
	var OrginEvent = event.args["OrginEvent"];

    var sel = grid1.getSelection();
    console.log(sel);

    edit1.setValue(sel.movieCd);
    input2.value = sel.movieNm;
    //document.getElementById("input2").value = sel.movieNm;
    document.getElementById("input3").value = sel.movieNmEn;
    document.getElementById("input4").value = sel.prdtYear;
    dateedit1.setValue(sel.openDt);
    edit2.setValue(sel.audience);
    document.getElementById("input6").value = sel.nationAlt;
    document.getElementById("input7").value = sel.genreAlt;
}

function button1Click(event) {
    grid1.setValue("movieCd", edit1.value);
    grid1.setValue("movieNm", input2.value);
    grid1.setValue("movieNmEn", input3.value);
    grid1.setValue("prdtYear", input4.value);
    grid1.setValue("openDt", dateedit1.value);
    grid1.setValue("audience", edit2.value);
    grid1.setValue("nationAlt", input6.value);
    grid1.setValue("genreAlt", input7.value);
}