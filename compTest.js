


function button1Click(event) {
	//edit1.value = "LSH123"; //mask = AAA999

    //setValue
    edit1.setValue("LSH456");
}



function button2Click(event) {
	//alert(edit1.value);
    console.log("edit1.value: ", edit1.value);

    //getValue
    var ed = edit1.getValue();
    console.log(ed);
}



function button3Click(event) {
	bProgress1.value = Math.random() * 100;
    cProgress1.value = bProgress1.value;
}

function button4Click(event) {
    //codecombo1.data = [
	//	{"CODE":"JPY","CODE_NM":"일본"},
	//	{"CODE":"EUR","CODE_NM":"유럽연합"},
	//	{"CODE":"CNY","CODE_NM":"중국"},
	//	{"CODE":"ITL","CODE_NM":"이탈리아"},
	//	{"CODE":"AUD","CODE_NM":"호주"},
	//	{"CODE":"HKD","CODE_NM":"홍콩"}
	//];
    var data = [
        {"CD":"JPY","CD_NM":"일본"},
        {"CD":"EUR","CD_NM":"유럽연합"},
        {"CD":"CNY","CD_NM":"중국"},
        {"CD":"ITL","CD_NM":"이탈리아"},
        {"CD":"AUD","CD_NM":"호주"},
        {"CD":"HKD","CD_NM":"홍콩"}
    ];
    codecombo1.setData(data);
}

function button5Click(event) {
    var val = codecombo1.getValue();
    var text = codecombo1.getText();
    var sel = codecombo1.getSelected();
    var data = codecombo1.getData();

    console.log("Value: ", val);
    console.log("Text: ", text);
    console.log("Selected: ", sel);
    console.log("Data: ", data);
}

function calendar2Select(event) {
	edit3.value = calendar2.value;
}

function button6Click(event) {
	treeview1.loadData([{
        "text":"My Documents",
        "children":[{
          "text":"Photos",
          "state":"closed",
          "children":[{
            "text":"Friend"
          },{
            "text":"Wife"
          },{
            "text":"Company"
          }]
        },{
          "text":"Program Files",
          "state":"closed",
          "children":[{
            "text":"Intel"
          },{
            "text":"Java"
          },{
            "text":"Microsoft Office"
          },{
            "text":"Games"
          }]
        },{
          "text":"Actions",
          "children":[{
            "text":"Add",
            "iconCls":"icon-add"
          },{
            "text":"Remove",
            "iconCls":"icon-remove"
          },{
            "text":"Save",
            "iconCls":"icon-save"
          },{
            "text":"Search",
            "iconCls":"icon-search"
          }]
        },{
          "text":"index.html"
        },{
          "text":"about.html"
        },{
          "text":"welcome.html"
        }]
       }]);
}

function button7Click(event) {
    var data = treeview1.getData();
    var sel = treeview1.getSelected();

    console.log("Data: ", data, "Selected: ", sel);
	
}

function button8Click(event) {
    var data = [
        {"name": "오유빈", "gender": "M", "mobile": "010-1234-5678"},
        {"name": "원동연", "gender": "M", "mobile": "010-1234-5678"},
        {"name": "이동호", "gender": "M", "mobile": "010-1234-5678"},
        {"name": "이상현", "gender": "M", "mobile": "010-1234-5678"},
        {"name": "이지오", "gender": "F", "mobile": "010-1234-5678"},
        {"name": "정유담", "gender": "F", "mobile": "010-1234-5678"},
        {"name": "최동준", "gender": "M", "mobile": "010-1234-5678"}
    ];

    var gen =[{CODE:"M" , CODE_NM:"남자"}
    ,{CODE:"F", CODE_NM:"여자"}];

    grid1.SetJsonStorage("gen",gen);
    
    console.log(data);
    grid1.setData(data);
}

function button9Click(event) {
  var sel = grid1.getSelection();
  console.log("Selection: ", sel);
}

function button10Click(event) {
	var sel = grid1.getCheckedRows();
  console.log("CheckedRows: ", sel);
}

setInterval(myWatch, 1000);

function myWatch() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  let seconds = now.getSeconds();

  hours = String(hours).padStart(2, '0');
  minutes = String(minutes).padStart(2, '0');
  seconds = String(seconds).padStart(2, '0');

  let time = hours + ":" + minutes + ":" + seconds;

  edit4.setValue(time);
}