/*  GBS Function List

function WorkErrorProc(sMsg, sUrl, sLine)
function DialogWindowLoad()
function NeedParams()
function ResultParams()
function RaiseError(sMsg)
function ShowErrorDialog(sMsg, sUrl, sLine, callback) -> Return the result through a callback function
function ShowInfoDialog(sMsg, callback) -> Return the result through a callback function
function ShowInfoDialog2(sTitle, sMsg, callback) -> Return the result through a callback function
function ShowFileListDialog(fileList, callback)
function ShowInfoWarnDialog(sCif, sAcct, sMed, sRef, callback) -> Return the result through a callback function
function DArgument()
// function SET_COMM_DATA(SectionName, FieldName, Value, Index) -> Replaced with setMainCommData/setBizCommData
// function GET_COMM_DATA(SectionName, FieldName, Index) -> Replaced with getMainCommData/getBizCommData
// function DEL_SECTION(SectionName) -> Delete
// function DEL_COMM_DATA(SectionName, Index) -> Delete
// function COUNT_COMM_DATA(SectionName) -> Delete
function setMainCommData(sectionName, jsonData)
function getMainCommData(sectionName)
function setBizCommData(sectionName, jsonData)
function getBizCommData(sectionName)
function LOG(arg)
function LIB()
function APM()
function topWindow()
function ActiveWindow()
// function fShowModalDialogPut(Upmu_cd, DArg, gbn) -> Delete (Use the openPopup function)
function trim(tmpStr)
function isSpace(inChar)
// function G_SetCBWithDSO(objCB, objDSO, KeyFld, KeyValue, CodeFld, CodeNmFld, NeedDel) -> Replaced with G_SetCBWithData
function G_SetCBWithData(objCB, arrData, KeyFld, KeyValue, CodeFld, CodeNmFld)
// function G_SetCBWithDSOVal(objCB, objDSO, KeyFld, KeyValue, CodeNm, NeedDel) -> Delete
function addCommas(nStr)
function HBS_ExcelLoad()
function ltrim ( s )
function rtrim ( s )
function trim ( s )
function fSearchCM1102(strCifNo, strRefNo)
function fCheckGB(init_do)
function SET_LINK_VALUE(pName, pValue)
function GET_LINK_VALUE(pName)
function SET_SCAN_OBJ(pObjScan, pScanCD)
function PROC_SCAN(pScanCD, pRecognize, callback) -> Return the result through a callback function
function GET_SCAN_VALUE(pScanCD, pName, pOption) -> TO-BE: OCR function not available
function SHOW_SCAN_CODE(pScanCD, callback) -> Return the result through a callback function
function SAVE_SCAN_DOC_ID(callback) -> Return the result through a callback function
function INIT_SCAN()
function CALL_IMG_VIEW_DOC_ID(pDoc_ID)
function CALL_IMG_VIEW_REF_NO(pRefNo, pHisNo, pOption)
function CALL_IMG_VIEW_REF_NO2(pRefNo, pHisNo, pScanCd)
function FIF_SET_CREDIT_RATING(pCode, pObj, callback) -> Change some parameters
// function WV_ALERT_FLD_NAME(pRec) -> Delete
function GETIDCARDVALUE(pType, pScanCD) -> TO-BE: OCR function not available
function GETRECOGITEMVALUE(pType, pScanCD) -> TO-BE: OCR function not available
function GETIDCARDCLASS(pScanCD) -> TO-BE: OCR function not available
function UPLOADIMAGE(pFileName, pScanCD, callback) -> Return the result through a callback function
function INITBILLSCANRECOGNIZE(pScanCD)
function GETDOCID(pRefNo, pHisNo, pScanCD, callback) -> Return the result through a callback function
function PHOTOSAVE(pScanCD)
function CALL_SPECIMENT_SCREEN(pScanList, pKeyType, pKeyValue)
function SHOW_SPECIMEN(strCifNo, strRefNo)
function SET_CBB_SCAN_CD(objScanCB, pMenuID)
function ClearCJUM()
function SetJUM(brno, ref)
function executeError(type, msg, desc)
function setExecuteMsg(msg)

*/

var $gbsLib = {};
(function(){
	// Supported : "ActionManager" component of winvader
	var _actManager = function(elem) {
		this.id   = (elem.getAttribute('id')+'').trim();
		this.onActive = (elem.getAttribute('onactive')+'').trim();
		this.elem = elem;
		this.actions = [];

		var self = this;
		if (this.id != '') window[this.id] = this;

		function getAttr(el,at) {
			var rt = el.getAttribute(at);
			rt = ((rt === null)||(rt === undefined))?null:(rt+'').trim();
			return rt;
		}

		async function execEvent(evtNm,evtTxt) {
			try {
				//console.log('execEvent',evtNm,evtTxt)
				if (evtTxt != '') {
					await eval(evtTxt);
					//return true;
				}
			} catch(E) {
				console.error('  ['+location.pathname+'] actionManager.'+evtNm+' Error : ',E);
				// return E;
				throw E;
			}
		}

		var acts = $( this.elem ).find('action');
		for (var i=0;i<acts.length;i++) {
			var act = {
				'name'    : getAttr(acts[i],'name'),
				//'execute' : getAttr(acts[i],'execute'),
				'ctrl'    : []
			};
			var ctls = $( acts[i] ).find('ctrl');
			for (var j=0;j<ctls.length;j++){
				var ctl = {
					'elem'    : ctls[j],
					'cid'     : getAttr(ctls[j],'cid'),
					'clear'   : getAttr(ctls[j],'clear'),
					'enabled' : getAttr(ctls[j],'enabled'),
					'value'   : getAttr(ctls[j],'value')
				};

				ctl.clear   = (ctl.clear !== null)?((ctl.clear).toUpperCase()=='TRUE'):null;
				ctl.enabled = (ctl.enabled !== null)?((ctl.enabled).toUpperCase()=='TRUE'):null;

				act.ctrl.push(ctl);
			}
			this.actions.push(act);
		}

		if (this.id != '') window[this.id] = this;

		execEvent('onActive',this.onActive);

		this.execAction = async function(actName) {
			var upperActName = actName.toUpperCase();
			var act = null;
			for (var i=0;i<this.actions.length;i++) {
				if ((this.actions[i].name ?? '').toUpperCase() == upperActName){
					act = this.actions[i];
					break;
				}
			}
			if (act != null){
				// Ctrl - Processing
				if (act.ctrl.length > 0) {
					for (var k=0;k<act.ctrl.length;k++){
						//console.log(act.ctrl[k]);
						var c = act.ctrl[k];
						if (window[c.cid] !== undefined){
							var o = window[c.cid];
							for (var x in c){
								if (((x+'')==='cid')||((x+'')==='elem')) continue;
								if (c[x] !== null) {
									//console.log('    "'+x+'" = "',c[x],'"');
									if (x == 'enabled') {
										o['disabled'] = !(c[x]);
									} else {
										if (x == 'clear') {
											try {
												if (c[x]) {
													// ctrl clear='true' is Clear Value
													o['value'] = '';
												}
											} catch(E) { }
										} else {
											o[x] = c[x];
										}
									}
								}
							}
						}
					}
				}

				//console.log(`executeAction('${actName}')`);
				await execEvent(actName, `executeAction('${actName}')`);
			}
		};

		this.ExecAction = async function(actName) {
			await this.execAction(actName);
		};
	};

	$gbsLib['actManager'] = _actManager;
	// Supported : "ActionListener" component of winvader

	var _actListener = function(elem) {
		this.id   = (elem.getAttribute('id')+'').trim();
		this.onActive = (elem.getAttribute('onactive')+'').trim();
		this.elem = elem;
		this.actions = [];
		this.ActionManager = {
			'ExecAction' : function(actNm) {
				console.log('not assigned "ActionManager" : ['+actNm+'] not executed');
			}
		};

		var self = this;
		if (this.id != '') window[this.id] = this;

		function getAttr(el,at) {
			return (el.getAttribute(at)+'').trim();
		}

		function execEvent(evtNm,evtTxt) {
			try {
				if (evtTxt != '') {
					eval(evtTxt);
				}
			} catch(E) {
				console.error('  ['+location.pathname+'] actionManager.'+evtNm+' Error : '+E.message);
			}
		}

		var acts = $( this.elem ).find('actlink');
		for (var i=0;i<acts.length;i++){
			var act = {
				'name'    : getAttr(acts[i],'actionname'),
				'linkid'  : getAttr(acts[i],'linkid'),
				'elem'    : null
			};

			if (act.linkid != '') {
				var fe = $('#'+act.linkid);
				if (fe.length > 0) act.elem = fe[0];
			}
			this.actions.push(act);
		}
		//console.log('actListener.actions',this.actions);
	};
	$gbsLib['actListener'] = _actListener;

	$gbsLib.genActions = function(){
		var acts = $('actman');

		for (var i=0;i<acts.length;i++) {
			new $gbsLib.actManager(acts[i]);
		}
		//console.log('actman',acts);

		var acts = $('actlsnr');
		for (var i=0;i<acts.length;i++) {
			new $gbsLib.actListener(acts[i]);
		}
		//console.log('actlsnr',acts);
	};
})();

/****************************************************************
 *
 * 설  명 : showModalDialog 기능을 대체하는 JavaScript
 *
 *    수정일          수정자       Version        Function 명
 * ------------    ---------   -------------  ----------------------------
 * 2023.08.01    JongSung Park       0.9          최초생성
 *
 * 사용방법 = openPopup(url, varParam, openParam, callback , [out targetWin]);
 */
var returnVal = null;
var _openPopup_callback = new Map();
var _openPopup_closed = false;
var _openPopupSupported = false;
var _openPopupWins = [];
const _openPopup_Arguments = new Map();
var openPopup =  function(arg1, arg2, arg3, arg4, arg5) {
	var popupWrapper = document.createElement("div");
	popupWrapper.style = 'position:fixed; left:0px; top:0px;width:100%;height:100%;background-color:rgba(194,194,194, 0.2);z-index:99999;';
	popupWrapper.classList.add('popupWrapper');


	var url = "";
	if(arg1.startsWith("/")){ url = window.location.origin + arg1;}
	else if(arg1.startsWith(".")){
		const pathSegments = window.location.href.split("/");
		pathSegments.pop();
		const pathWithoutFileName = pathSegments.join("/");
		url = pathWithoutFileName + "/" + arg1;
	}
	var w;
	var h;
	var resizable = "no";
	var scroll = "no";
	var status = "no";

	if(typeof(arg3) == 'string'){
		let mdattrs = arg3.split(";");
		for (i = 0; i < mdattrs.length; i++) {
			var mdattr = mdattrs[i].replace(":","=").split("=");
			var n = mdattr[0];
			var v = mdattr[1];
			if (n) {
				n = n.trim().toLowerCase();
			}
			if (v) {
				v = v.trim().toLowerCase();
			}
			if (n == "dialogheight") {
				h = v.replace("px", "");
			} else if (n == "dialogwidth") {
				w = v.replace("px", "");
			} else if (n == "resizable") {
				resizable = v;
			} else if (n == "scroll") {
				scroll = v;
			} else if (n == "status") {
				status = v;
			} else {
			}
		}
	}else{
		if(typeof(arg3.dialogHeight) != "undefined") h= arg3.dialogHeight;
		if(typeof(arg3.dialogWidth) != "undefined") w= arg3.dialogWidth;
		if(typeof(arg3.resizable) != "undefined") {
			if(resizable.toLowerCase() == "true") resizable="yes";
			else if(resizable.toLowerCase() == "false") resizable="no";
			else resizable= arg3.resizable;
		}
		if(typeof(arg3.scroll) != "undefined") scroll= arg3.scroll;
		if(typeof(arg3.status) != "undefined") status= arg3.status;
	}

	var left = window.screenX + (window.outerWidth / 2) - (w / 2);
	var top = window.screenY + (window.outerHeight / 2) - (h / 2);
	var targetWin = window.open(url, "", "toolbar=no, location=no, directories=no, status=" + status +
		", menubar=no, scrollbars=" + scroll + ", resizable=" + resizable + ", copyhistory=no, width=" + w	+
		", height=" + h + ", top=" + top + ", left=" + left);
	if (targetWin) _openPopupWins.push(targetWin);
	targetWin.addEventListener('load', function(event) {
		if(typeof(targetWin._openPopupSupported) == "undefined"){
			var head= targetWin.document.getElementsByTagName('head')[0];
			var script= document.createElement('script');
			script.type= 'text/javascript';
			script.text= "window.addEventListener(\"beforeunload\" , function(){if(typeof(_openPopupSupported) =='undefined' && opener != null && !opener.closed && typeof(opener._openPopupSupported) != 'undefined')opener.openPopup_Callback(undefined);});"
			head.appendChild(script);
		}
	});

	if(targetWin && targetWin.closed){
		alert("Please turn off the pop-up blocker.");
		return;
	}

	if(arg5 != undefined)  arg5.targetWin = targetWin;
	_openPopup_Arguments.set( targetWin,arg2);
	_openPopup_callback.set(targetWin, arg4);
	popupWrapper.addEventListener("mousedown", function(){
		targetWin.focus();
		if (!targetWin.location.pathname) {
			window.top.document.body.removeChild(popupWrapper);
		}
	});
	popupWrapper.targetWin = targetWin;
	window.top.document.body.appendChild(popupWrapper);
	targetWin.focus();

};
_openPopupSupported = true;

function openPopup_Callback(e, argWin , targetWin) {
	const popupWrapper = argWin ? Array.prototype.find.call(window.top.document.body.querySelectorAll('.popupWrapper'), elem => elem.targetWin === argWin) : null;
	var callback = _openPopup_callback.get(targetWin);
	if (callback != undefined)  {
		setTimeout(function() {
			if (popupWrapper) {
				window.top.document.body.removeChild(popupWrapper);
			}
			callback(e);
		}, 10);
	} else {
		if (popupWrapper) {
			window.top.document.body.removeChild(popupWrapper);
		}
	}
	_openPopup_callback.delete(targetWin);
	_openPopup_Arguments.delete(targetWin);

};

// window.removeEventListener("beforeunload" , function(){openPopup_closed(returnVal);});
// window.addEventListener("beforeunload" , function(){openPopup_closed(returnVal);});
window.removeEventListener("beforeunload" , beforeUnloadEvt);
window.addEventListener("beforeunload" , beforeUnloadEvt);

function beforeUnloadEvt() {
	if (_openPopupWins.length > 0) {
		_openPopupWins.forEach(elem => {
			elem.close();
		});
	}

	if (window.onBeforeClose) {
		window.onBeforeClose();
	}
	openPopup_closed(returnVal);
}

window.getOpenPopupArgumentsInner = function(targetWin) {
	var args = _openPopup_Arguments.get( targetWin);
	if(args != 'undefined') {
		return args;
	}else return undefined;
};

if (opener != null && !opener.closed) {
	try {
		window.dialogArguments = opener.getOpenPopupArgumentsInner(this);
	} catch (err) {
		// console.error("팝업 처리 시 오류가 발생하였습니다. \n오류내용 : " + err);
		console.error("There was an error processing the popup. \nError contents : " + err);
	}
} else if (parent.opener != null && !parent.opener.closed && typeof(parent.opener.showModalDialogSupported) != "undefined") {
	try {
		window.dialogArguments = parent.opener.getOpenPopupArgumentsInner(this);
		parent.window.dialogArguments = window.dialogArguments;
	} catch (err) {
		// console.error("팝업 처리 시 오류가 발생하였습니다. \n오류내용 : " + err);
		console.error("There was an error processing the popup. \nError contents : " + err);
	}
}

Object.defineProperty(window, "returnValue", {
	set: function(newValue){
		setReturnValue(newValue)
	},configurable: true
});

function setReturnValue(obj){
	returnVal = obj;
}

function openPopup_closed(obj) {
	if(_openPopup_closed) return;
	_openPopup_closed = true;

	if (opener != null && !opener.closed && typeof(opener._openPopupSupported) != "undefined") {
		try {
			opener.openPopup_Callback(obj, window, this);
		} catch (err) {
			console.error("There was an error processing the popup. \nError contents : " + err);
		}
	} else if (parent.opener != null && !parent.opener.closed && typeof(parent.opener._openPopupSupported) != "undefined") {
		try {
			parent.opener.openPopup_Callback(obj, window, this);
		} catch (err) {
			console.error("There was an error processing the popup. \nError contents : " + err);
		}
	} else {
	}

}

//interface function for compatibility
function getDialogArguments() {};

/****************************************************************
 *
 * 설  명 : showModalDialog 기능을 대체하는 JavaScript (dialog 형태)
 *
 *    수정일        수정자       Version        Function 명
 * ------------  ---------   -------------  ----------------------------
 * 2023.08.01      Jun Lee       1.0           최초생성
 * 
 * 사용방법 = openDialog(url, varParam, openParam, callback);
 */
function openDialog(url = '', dArg, options, callback) {
	if (!url) {
		return;
	}

	if(url.startsWith("/")){ 
		url = window.location.origin + url;
	} else if(url.startsWith(".")){
		const pathSegments = window.location.href.split("/");
		pathSegments.pop();
		const pathWithoutFileName = pathSegments.join("/");
		url = pathWithoutFileName + "/" + url;
	}

	const opt = {};
	opt.title = options.title ?? url.split('/').at(-1).split('.').at(-1);
	opt.url = url;
	if (options.resizable) {
		opt.resize = options.resizable;
	}
	if (options.scroll) {
		opt.scroll = options.scroll;
	}
	if (options.dialogHeight) {
		opt.height = options.dialogHeight;
	}
	if (options.dialogWidth) {
		opt.width = options.dialogWidth;
	}
	if (options.center) {
		opt.center = options.center;
	}

	const popupCtrl = new top.MAIN.$popupCtrl({
		'title': options.title ?? url.split('/').at(-1).split('.').at(0),
		'url': url,
		'resize': options.resizable,
		'scroll': options.scroll,
		'width': options.dialogWidth,
		'height': options.dialogHeight,
		'center': options.center,
		'onLoaded': function(popupObj) {
			//console.log('popupObj --> ', popupObj);
			
			let returnVal = null;

			popupObj.window['dialogArguments'] = dArg;
			Object.defineProperty(popupObj.window, "returnValue", {
				set: function(newValue){
					setReturnValue(newValue);
				}
			});

			function setReturnValue(obj){
				returnVal = obj;
			}

			popupObj.window['close'] = function(){
				if (callback) {
					callback(returnVal);
				}
				popupObj.clickClose();
			};

			popupObj.window.DialogWindowLoad();
		}
	});
	
	//popupCtrl.setDialogArg(dArg);
	popupCtrl.initPopup();

	//console.log('popupCtrl --> ', popupCtrl);
	popupCtrl.show();
}

/*=======================================*/
/* script/common.js - Convert for Y[wai] */
/*=======================================*/
function topWindow() {
	var topWnd = null;
	if (window.dialogArguments){
		topWnd = window.dialogArguments.topWindow;
		//console.log('topWnd',topWnd);
	}
	else {
		topWnd = window.top;
		//console.log('[FRM] topWindow()',topWnd.location.pathname);
	}
	return topWnd;
}

function LOG(arg) {
	//topWindow().LIB.document.body.Log(arg.toString());
	console.log('[GBS]',arg);
}

function LIB() {
	const libWnd = topWindow()?.LIB;
	if (libWnd) {
		libWnd.callWnd = window;
	}
	return libWnd;
}

function APM() {
	return topWindow()?.APM;
}

function addCommas(nStr) {
	nStr += '';
	x = nStr.split('.');
	x1 = x[0];
	x2 = x.length > 1 ? '.' + x[1] : '';
	var rgx = /(\d+)(\d{3})/;
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}
	return x1 + x2;
}

function HBS_ExcelLoad(gridId) {
    var DArg  = new DArgument();
    DArg.Args = new Array(1);

    // DArg.Args[0] = topWindow().MAIN.WVMF.selectedID;
	DArg.Args[0] = topWindow().MAIN.tabCtrl.getCurrentTab().id;

    openPopup('/frame/excelLoad.html', DArg, "status:no;resizable:no;scroll:yes;center:yes;dialogHeight: 222px; dialogWidth: 450px", function(gMainDialog) {
		if (gMainDialog) {
			// LIB().WINMAN1.SetEnvVariable("WVD_CONFIG_COREGRID_BF_EXCEL_SCRIPT_RESULT", "TRUE");
			window[gridId]?.exportExcel();
		}
	});
}

function ltrim ( s ) {
	return s.replace(/^\s+/, "" );
}

function rtrim ( s ) {
	return s.replace(/\s+$/, "" );
}

function trim(tmpStr) {
	var atChar;
	if (tmpStr.length > 0) atChar = tmpStr.charAt(0);
	while (isSpace(atChar))
	{
		tmpStr = tmpStr.substring(1, tmpStr.length);
		atChar = tmpStr.charAt(0);
	}
	if (tmpStr.length > 0) atChar = tmpStr.charAt(tmpStr.length-1);
	while (isSpace(atChar))
	{
		tmpStr = tmpStr.substring(0,( tmpStr.length-1));
		atChar = tmpStr.charAt(tmpStr.length-1);
	}
	return tmpStr;
}

function isSpace(inChar) {
	return (inChar == ' ' || inChar == '\t' || inChar == '\n');
}

/*=======================================*/
/* script/common.js - Convert for Y[wai] */
/*=======================================*/
// DATA Control
function ActiveWindow()
{
	// ORG :   return topWindow().MAIN.WVMF.selected.contentWindow;
	var top = topWindow();
	var tab = top.MAIN.window['tabCtrl'];
	var sub = tab?.getCurrentTab()?.pageElem.contentWindow;
	//var biz = sub.WorkFrame.contentWindow;
	//console.log( 'ActiveWindow',sub,biz );
	return sub;
}

function bizTabCtrl() {
	var top = topWindow();
	var tab = top.MAIN.window['tabCtrl'];
	return tab;
}

function RaiseError(sMsg) {
	var Err = new Error();
	Err.description = sMsg;
	throw Err;
}

/**
 * 지역(업무) 공통 데이터 반환
 * Return common data for business screen
 * AS-IS 기준 FXFIG_SCR 등(FXFIG_COM, FMGRINFO 섹션 제외)의 섹션 데이터 반환 시 사용
 * Used when returning data such as AS-IS FXFIG_SCR, etc (excluding FXFIG_COM, FMGRINFO sections)
 * @param {string} sectionName 
 * @returns {object}
 */
function getBizCommData(sectionName) {
	let rtnData = null;
	
	if (sectionName) {
		const DO = ActiveWindow().BDO;
		if (DO[sectionName]) {
			rtnData = JSON.parse(JSON.stringify(DO[sectionName]));
		}
	}

	return rtnData;
}

/**
 * 지역(업무) 공통 데이터 셋팅
 * Setting common data for business screen
 * AS-IS 기준 FXFIG_SCR 등(FXFIG_COM, FMGRINFO 섹션 제외)의 섹션 데이터 셋팅 시 사용
 * Used when setting data such as AS-IS FXFIG_SCR, etc (excluding FXFIG_COM, FMGRINFO sections)
 * @param {string} sectionName 
 * @param {object} jsonData 
 */
function setBizCommData(sectionName, jsonData) {
	if(sectionName && jsonData && typeof(jsonData) == 'object') {
		const DO = ActiveWindow().BDO;
		DO[sectionName] = JSON.parse(JSON.stringify(jsonData));
	}
}

/**
 * 전역(메인) 공통 데이터 반환
 * Return common data for main screen
 * AS-IS 기준 FXFIG_COM 섹션 데이터 반환 시 사용
 * Used when returning data such as AS-IS FXFIG_COM, FMGRINFO sections
 * @param {string} sectionName 
 * @returns {object}
 */
function getMainCommData(sectionName) {
	let rtnData = null;

	if (['SysInfo', 'EtcInfo', 'OvrdInfo'].includes(sectionName)) {
		const DO = LIB().CDO;
		if (DO[sectionName]) {
			rtnData = JSON.parse(JSON.stringify(DO[sectionName]));
		}
	}

	return rtnData;
}

/**
 * 전역(메인) 공통 데이터 셋팅
 * Setting common data for main screen
 * AS-IS 기준 FXFIG_COM 섹션 데이터 셋팅 시 사용
 * Used when setting data such as AS-IS FXFIG_COM, FMGRINFO sections
 * @param {string} sectionName 
 * @param {object} jsonData 
 */
function setMainCommData(sectionName, jsonData) {
	if(['SysInfo', 'EtcInfo', 'OvrdInfo'].includes(sectionName) && jsonData && typeof(jsonData) == 'object') {
		const DO = LIB().CDO;
		DO[sectionName] = JSON.parse(JSON.stringify(jsonData));
	}
}

/*
function SET_COMM_DATA(SectionName, FieldName, Value, Index) {
	var DC = null;

	if (SectionName == "FXFIG_COM" || SectionName == "FMGRINFO")
		DC = LIB().HNDC;
	else
		DC = ActiveWindow().HNDC;

	DC.SectionName = SectionName;

	if (Index) {
		if (DC.RecordCount == Index) {
			DC.NewRecord();
		}
		else if (DC.RecordCount < Index) {
			RaiseError("Index out of bound!");
		}
		DC.RecordIndex = Index;
	}
	else {
		if (DC.RecordCount == 0) {
			DC.NewRecord();
		}
		DC.RecordIndex = 0;
	}

	// Item value setting
	try {
		DC.ItemName   = FieldName;
		DC.ItemValue  = Value;
	}
	catch (e) {
	if (e.description == "Record has not item(s)...")
	{
		DC.NewItem(FieldName, Value.toString());
	}
	else {
		throw e;
	}
	}
}

function GET_COMM_DATA(SectionName, FieldName, Index) {
	var DC = null;

	if (SectionName == "FXFIG_COM" || SectionName == "FMGRINFO")
	DC = LIB().HNDC;
	else
	DC = ActiveWindow().HNDC;

	DC.SectionName = SectionName;
	if (Index)
	DC.RecordIndex = Index;
	else
	DC.RecordIndex = 0;
	DC.ItemName = FieldName;

	return DC.ItemValue;
	}

	function DEL_SECTION(SectionName)
	{
	var DC = null;

	if (SectionName == "FXFIG_COM" || SectionName == "FMGRINFO")
	DC = LIB().HNDC;
	else
	DC = ActiveWindow().HNDC;

	DC.DelSection(SectionName);
}

function DEL_COMM_DATA(SectionName, Index) {
	var DC = null;

	if (SectionName == "FXFIG_COM" || SectionName == "FMGRINFO")
	DC = LIB().HNDC;
	else
	DC = ActiveWindow().HNDC;

	DC.SectionName = SectionName;
	if (Index)
	DC.DelRecord(Index);
	else
	DC.DelRecord(0);
}

function COUNT_COMM_DATA(SectionName) {
	var DC = null;

	if (SectionName == "FXFIG_COM" || SectionName == "FMGRINFO")
	DC = LIB().HNDC;
	else
	DC = ActiveWindow().HNDC;

	DC.SectionName = SectionName;
	return DC.RecordCount;
}
*/

function WorkErrorProc(sMsg, sUrl, sLine, sCode, errObj = {}) {
	try {
		// 반복적으로 Call 하는경우에 이전까지 쌓인 통장 프린터 데이터 출력
		top.MAIN?.tabCtrl.getCurrentTab().pageElem.contentWindow.PrintBufferProc();
	}
	catch (E) {
	}

	/*
	function getXMLText(xml, tagNM) {
		var rt = '';
		try {
			rt = xml.split('<' + tagNM + '>')[1];
			rt = rt.split('</' + tagNM + '>')[0];
		} catch (E) {
			rt = null;
		}
		return rt;
	}
	//var e = new Error();

	var ErrObjName = '';
	if (errObj.constructor.name === undefined){
		var funTxt = (errObj.constructor.toString()+'').trim();
		var funcNameRegex = /function\s([^(]{1,})\(/;
		var results = (funcNameRegex).exec(funTxt);

		ErrObjName = (results && results.length > 1) ? results[1].trim() : "";
	} else {
		ErrObjName = errObj.constructor.name;
	}
	*/
	//console.log('workErrorProc ['+ErrObjName+']',errObj);

	/*
	if (window.dialogArguments) {
		//var skipChk = sMsg.substr(0, 3);

		G_ERR_DATE = new Date();
		if ((G_ERR_DATE.getHours() == G_err_hours) && (G_ERR_DATE.getMinutes() == G_err_minutes) &&
			((G_ERR_DATE.getSeconds() - G_err_seconds) < 3)) {

		}
		else {
			if (errObj.number) {
				ShowErrorDialog(errObj.message);
			} else {
				ShowErrorDialog(errObj.description ?? (errObj.stack ?? sMsg));
			}

			G_ERR_DATE = new Date();
			G_err_hours = G_ERR_DATE.getHours();
			G_err_minutes = G_ERR_DATE.getMinutes();
			G_err_seconds = G_ERR_DATE.getSeconds();
		};
	}
	else {
		if (errObj.number) {
			ShowErrorDialog(errObj.message);
		} else {
			ShowErrorDialog(errObj.description ?? (errObj.stack ?? sMsg));
		}
	}
	*/

	if (errObj.status == 401) {
		ShowErrorDialog({
			message: errObj.message,
			stack: errObj.stack,
			bSvcErr: errObj.bSvcErr,
			errInfo: {
				globId: '',
				msg: 'Duplicate login or unauthorized request.',
				subMsg: 'Return to the login page.',
				stack: ''
			}
		}, null, null, () => {
			topWindow().MAIN.Logout();
		});
		return false;
	}

	if (errObj.number) {
		if (procError) {
			procError(errObj);
		} else {
			ShowErrorDialog(errObj.message);
		}
	} else if (errObj.bSvcErr) {
		ShowErrorDialog({
			message: errObj.message,
			stack: errObj.stack,
			bSvcErr: errObj.bSvcErr,
			errInfo: errObj.errInfo
		});
	} else {
		ShowErrorDialog(errObj.description ?? (errObj.stack ?? sMsg));
	}

	if (parent.window.StopExecute !== undefined) {
		parent.window.StopExecute = true;
	}

	return true;
}

function DialogWindowLoad() {
	//alert('DialogWindowLoad');
	/* callService로 대체
	var ivks = $wai.core.getDataServices();

	for (var i=0;i<ivks.length;i++){
		ivks[i]._evt_beforeCall = NeedParams;
		ivks[i]._evt_afterCall = ResultParams;
	}
	*/

	window['callService'] = comCallService;
	window['callServiceAsync'] = comCallServiceAsync;

	/* fDialogInit 사용 안함
	try {
		fDialogInit();
	}
	catch (e) {
		throw e;
	}
	*/

	try {
		setTimeout(() => {window.onLoadPage(true)}, 100);
	} catch (e) {}
}

//==================================================================================================================
// 비동기(Async) 처리를 위한 흐름제어 (by Hyunwoo,Hwang / 15 sep 2023)
//==================================================================================================================
const _ASyncExecuteFlow = function() {
	const self = this;
	var stack = 0;
	var callback = null;
	this.isExecFunc = false;
	this.isStandby = false;

	this.addCall = function() {
		stack++;
		self.isStandby = true;
	};
	this.endCall = function() {
		stack--;
		if (stack == 0) {
			self.isExecFunc = false;
			if (callback) {
				callback();
			}
			callback = null;
			self.isStandby = false;
		}
	};
	this.initCall = function() {
		stack = 0;
		callback = null;
		self.isExecFunc = false;
		self.isStandby = false;
	};
	this.execFuncStart = function(cbFunc){
		self.initCall();
		self.isExecFunc = true;
		self.isStandby = false;
		callback = cbFunc;
	};
	this.showStatus = function() {
		console.log('isExecFunc ->', this.isExecFunc);
		console.log('stack ->', stack);
		console.log('callback ->', callback);
	};
};

const ASyncExecFlow = new _ASyncExecuteFlow();

/**
 * @param {string} svcUrl - A string containing the URL to which the request is sent.
 * @param {object} [data] - Data to be sent to the server.
 * @param {object} [onResult] - A function to be called if the request succeeds
 * @param {object} [onError] - A function to be called if the request fails
 * @param {object} [options] - call options - A set of key/value pairs that configure the request.
 *			 				{
 *					        	'type'     : 'POST',  // An alias for method
 *					        	'async'    : true,    // Asynchronous type
 *					          	'timeout'  : 300000,  // Set a timeout (in milliseconds) for the request
 *				           		'dataType' : 'JSON',  // The type of data that you're expecting back from the server
 *				        	   	'jsonText' : false,   // Whether to process data in json string format
 *           					'headers'  : {},       // An object of additional header key/value pairs to send
 *                              'argObj'   : {}        // User-defined object when calling a service
 *					       	}
 */
function comCallService(svcUrl, data = {}, onResult, onError, options = {}) {
	if (!svcUrl) {
		return;
	}

	options.beforeCallEvent = NeedParams;
	options.afterCallEvent = ResultParams;

	defCallService(svcUrl, data, onResult, onError, options);
}

async function comCallServiceAsync(svcUrl, data = {}, onResult, onError, options = {}) {
	if (!svcUrl) {
		return;
	}

	options.beforeCallEvent = NeedParams;
	options.afterCallEvent = ResultParams;

	return await defCallServiceAsync(svcUrl, data, onResult, onError, options);
}

function callBasicService(svcUrl, data = {}, onResult, onError, options = {}) {
	if (!svcUrl) {
		return;
	}

	options.beforeCallEvent = function(inputData, callOpt) {
		const CDO = LIB().CDO;

		for (let x in CDO) {
			if (['SysInfo'].includes(x)) {
				inputData[x] = JSON.parse(JSON.stringify(CDO[x]));
			}
		}
		
		console.log(`[${callOpt.url.split('/').at(-1)}] inputData -> `, inputData);

		return true;
	};
	options.afterCallEvent = function() {
		return true;
	};

	defCallService(svcUrl, data, onResult, onError, options);
}

async function callBasicServiceAsync(svcUrl, data = {}, onResult, onError, options = {}) {
	if (!svcUrl) {
		return;
	}

	options.beforeCallEvent = function(inputData, callOpt) {
		const CDO = LIB().CDO;

		for (let x in CDO) {
			if (['SysInfo'].includes(x)) {
				inputData[x] = JSON.parse(JSON.stringify(CDO[x]));
			}
		}
		
		console.log(`[${callOpt.url.split('/').at(-1)}] inputData -> `, inputData);

		return true;
	};
	options.afterCallEvent = function() {
		return true;
	};

	return await defCallServiceAsync(svcUrl, data, onResult, onError, options);
}

function defCallService(svcUrl, data, onResult, onError, options) {
	const inputData = {
		input: data
	};

	const defOptions = {
		type: 'POST',
		async: true,
		timeout: 900000, // TO-DO: 임시 수정 (org: 300000)
		dataType: 'JSON',
		jsonText: true,
		headers: {},
		beforeCallEvent: null,
		afterCallEvent: null,
		argObj: null,
		skipProg: false
	};

	for (let x in defOptions) {
		if (options[x]) {
			defOptions[x] = options[x];
		}
	}

	defOptions.onResult = function(send, recv) {
		try {
			const outputData = recv.data ?? {};
			if (outputData.output) {
				const errorCode = outputData.output.errorCode;
				if (errorCode) {
					console.log(`[${send.callOpt.url.split('/').at(-1)}] onError --> `, recv, send);

					if (onError) {
						onError(outputData.output, defOptions.argObj);
					} else {
						const errObj = new Error();
						// let errMsg = '';
						const errOutput = outputData.output;
						if (errOutput) {
							let subMsg = (errOutput.subMessage ?? [])[0];
							// errMsg = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}\n\n${errOutput.error ?? ''}`;
							errObj.message = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}`;
							errObj.stack = errOutput.error ?? '';
							errObj.bSvcErr = true;
							errObj.errInfo = {
								globId: errOutput.globId ?? '',
								msg: errOutput.message ?? 'Service Error',
								subMsg: subMsg ?? '',
								stack: errOutput.error ?? '',
								send,
								recv
							}
						} else {
							// errMsg = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
							errObj.message = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
							errObj.stack = '';
							errObj.bSvcErr = true;
							errObj.errInfo = {
								globId: '',
								msg: errObj.message,
								subMsg: '',
								stack: '',
								send,
								recv
							}
						}
						throw errObj;
						// throw Error(errMsg);
					}
				} else {
					console.log(`[${send.callOpt.url.split('/').at(-1)}] onResult --> `, recv, send);

					if (onResult) {
						onResult(outputData.output, defOptions.argObj);
					}
					if (ASyncExecFlow.isExecFunc && waiJsonSvc.isExecFunc) {
						ASyncExecFlow.endCall();
					}
				}
			} else {
				if (ASyncExecFlow.isExecFunc && waiJsonSvc.isExecFunc) {
					ASyncExecFlow.endCall();
				}
			}
		} catch (e) {
			ASyncExecFlow.initCall();
			throw e;
		} finally {
			if (!defOptions.skipProg) {
				HideProgress();
			}
		}
	};

	defOptions.onError = function(send, recv) {
		console.log(`[${send.callOpt.url.split('/').at(-1)}] onError --> `, recv, send);

		try {
			const errOutput = recv.xhr?.responseJSON?.output;
			if (onError) {
				onError(errOutput ?? recv, defOptions.argObj);
			} else {
				const errObj = new Error();
				// let errMsg = '';
				if (errOutput) {
					let subMsg = (errOutput.subMessage ?? [])[0];
					// errMsg = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}\n\n${errOutput.error ?? ''}`;
					errObj.message = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}`;
					errObj.stack = errOutput.error ?? '';
					errObj.bSvcErr = true;
					errObj.errInfo = {
						globId: errOutput.globId ?? '',
						msg: errOutput.message ?? 'Service Error',
						subMsg: subMsg ?? '',
						stack: errOutput.error ?? '',
						send,
						recv
					}
				} else {
					// errMsg = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
					errObj.message = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
					errObj.stack = '';
					errObj.errInfo = {
						globId: '',
						msg: errObj.message,
						subMsg: '',
						stack: '',
						send,
						recv
					}
				}
				errObj.bSvcErr = true;
				errObj.status = recv.xhr?.status;
				throw errObj;
				// throw Error(errMsg);
			}
		} catch (e) {
			ASyncExecFlow.initCall();
			throw e;
		} finally {
			if (!defOptions.skipProg) {
				HideProgress();
			}
		}
	};

	defOptions.headers['X-Auth-Token'] = `Bearer ${topWindow().LIB.accessToken}`;

	const waiJsonSvc = new waiJsonInst();
	waiJsonSvc.beforeCallEvent = defOptions.beforeCallEvent;
	waiJsonSvc.afterCallEvent = defOptions.afterCallEvent;
	waiJsonSvc.onResult = defOptions.onResult;
	waiJsonSvc.onError = defOptions.onError;

	const callOptions = {
		type: defOptions.type,
		async: defOptions.async,
		timeout: defOptions.timeout,
		dataType: defOptions.dataType,
		jsonText: defOptions.jsonText,
		headers: defOptions.headers
	};

	try {
		if (!defOptions.skipProg) {
			ShowProgress();
		}
		if (ASyncExecFlow.isExecFunc) {
			ASyncExecFlow.addCall();
			waiJsonSvc.isExecFunc = true;
		}
		waiJsonSvc.urlCall(`${topWindow().LIB.serverUrl}${svcUrl}`, inputData, callOptions);
	} catch (e) {
		ASyncExecFlow.initCall();
		if (!defOptions.skipProg) {
			HideProgress();
		}
		throw e;
	}
}

function defCallServiceAsync(svcUrl, data, onResult, onError, options) {
	return new Promise((resolve, reject) => {
		const inputData = {
			input: data
		};
	
		const defOptions = {
			type: 'POST',
			async: true,
			timeout: 900000, // TO-DO: 임시 수정 (org: 300000)
			dataType: 'JSON',
			jsonText: true,
			headers: {},
			beforeCallEvent: null,
			afterCallEvent: null,
			argObj: null,
			skipProg: false
		};
	
		for (let x in defOptions) {
			if (options[x]) {
				defOptions[x] = options[x];
			}
		}
	
		defOptions.onResult = function(send, recv) {
			try {
				const outputData = recv.data ?? {};
				if (outputData.output) {
					const errorCode = outputData.output.errorCode;
					if (errorCode) {
						console.log(`[${send.callOpt.url.split('/').at(-1)}] onError --> `, recv, send);
	
						if (onError) {
							onError(outputData.output, defOptions.argObj);
							reject(outputData.output);
						} else {
							const errObj = new Error();
							// let errMsg = '';
							const errOutput = outputData.output;
							if (errOutput) {
								let subMsg = (errOutput.subMessage ?? [])[0];
								// errMsg = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}\n\n${errOutput.error ?? ''}`;
								errObj.message = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}`;
								errObj.stack = errOutput.error ?? '';
								errObj.bSvcErr = true;
								errObj.errInfo = {
									globId: errOutput.globId ?? '',
									msg: errOutput.message ?? 'Service Error',
									subMsg: subMsg ?? '',
									stack: errOutput.error ?? '',
									send,
									recv
								}
							} else {
								// errMsg = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
								errObj.message = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
								errObj.stack = '';
								errObj.bSvcErr = true;
								errObj.errInfo = {
									globId: '',
									msg: errObj.message,
									subMsg: '',
									stack: '',
									send,
									recv
								}
							}
							throw errObj;
							// throw Error(errMsg);
						}
					} else {
						console.log(`[${send.callOpt.url.split('/').at(-1)}] onResult --> `, recv, send);
	
						if (onResult) {
							onResult(outputData.output, defOptions.argObj);
						}
						resolve(outputData.output);
					}
				} else {
					resolve();
				}
			} catch (e) {
				throw e;
			} finally {
				if (!defOptions.skipProg) {
					HideProgress();
				}
			}
		};
	
		defOptions.onError = function(send, recv) {
			console.log(`[${send.callOpt.url.split('/').at(-1)}] onError --> `, recv, send);
	
			try {
				const errOutput = recv.xhr?.responseJSON?.output;
				if (onError) {
					if (errOutput) {
						onError(errOutput, defOptions.argObj);
						resolve(errOutput);
					} else {
						onError(recv, defOptions.argObj);
						reject(recv);
					}
				} else {
					const errObj = new Error();
					// let errMsg = '';
					if (errOutput) {
						let subMsg = (errOutput.subMessage ?? [])[0];
						// errMsg = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}\n\n${errOutput.error ?? ''}`;
						errObj.message = `${errOutput.message ?? 'Error'}${subMsg ? '\n' + subMsg : ''}\n\n${'[ Global ID: ' + (errOutput.globId ?? '') + ' ]'}`;
						errObj.stack = errOutput.error ?? '';
						errObj.bSvcErr = true;
						errObj.errInfo = {
							globId: errOutput.globId ?? '',
							msg: errOutput.message ?? 'Service Error',
							subMsg: subMsg ?? '',
							stack: errOutput.error ?? '',
							send,
							recv
						}
					} else {
						// errMsg = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
						errObj.message = (recv.errThrown?.message ?? recv.errThrown) || 'Error';
						errObj.stack = '';
						errObj.errInfo = {
							globId: '',
							msg: errObj.message,
							subMsg: '',
							stack: '',
							send,
							recv
						}
					}
					errObj.bSvcErr = true;
					errObj.status = recv.xhr?.status;
					throw errObj;
					// throw Error(errMsg);
				}
			} catch (e) {
				throw e;
			} finally {
				if (!defOptions.skipProg) {
					HideProgress();
				}
			}
		};
	
		defOptions.headers['X-Auth-Token'] = `Bearer ${topWindow().LIB.accessToken}`;
	
		const waiJsonSvc = new waiJsonInst();
		waiJsonSvc.beforeCallEvent = defOptions.beforeCallEvent;
		waiJsonSvc.afterCallEvent = defOptions.afterCallEvent;
		waiJsonSvc.onResult = defOptions.onResult;
		waiJsonSvc.onError = defOptions.onError;
	
		const callOptions = {
			type: defOptions.type,
			async: defOptions.async,
			timeout: defOptions.timeout,
			dataType: defOptions.dataType,
			jsonText: defOptions.jsonText,
			headers: defOptions.headers
		};
	
		try {
			if (!defOptions.skipProg) {
				ShowProgress();
			}	
			waiJsonSvc.urlCall(`${topWindow().LIB.serverUrl}${svcUrl}`, inputData, callOptions);
		} catch (e) {
			if (!defOptions.skipProg) {
				HideProgress();
			}
			throw e;
		}
	});
}

/*
function comCallServiceAsync(svcUrl, data = {}, onError, options = {}) {
	return new Promise((resolve, reject) => {
		if (!svcUrl) {
			return;
		}
	
		let progObj = null;
	
		const inputData = {
			input: data
		};
	
		const defOptions = {
			type: 'POST',
			async: true,
			timeout: 300000,
			dataType: 'JSON',
			jsonText: true,
			headers: {}
		};
	
		for (let x in defOptions) {
			if (options[x]) {
				defOptions[x] = options[x];
			}
		}
	
		defOptions.onResult = function(send, recv) {
			console.log('onResult --> ', send, recv);
	
			try {
				const outputData = recv.data ?? {};
				const errorCode = outputData.output?.errorCode;
				if (errorCode) {
					if (onError) {
						onError(outputData.output);
					} else {
						let errMsg = '';
						const errOutput = outputData.output;
						if (errOutput) {
							errMsg = `${errOutput.message ?? 'Error'}\n\n${errOutput.error ?? ''}`;
						} else {
							errMsg = (recv.errThrown?.message ?? recv.errThrown) ?? 'Error';
						}
						throw Error(errMsg);
					}
				} else {
					resolve(outputData.output);
				}
			} catch (e) {
				throw e;
			} finally {
				HideProgress(progObj);
			}
		};
	
		defOptions.onError = function(send, recv) {
			console.log('onError --> ', send, recv);
	
			try {
				if (onError) {
					onError();
				} else {
					let errMsg = '';
					const errOutput = recv.xhr?.responseJSON?.output;
					if (errOutput) {
						errMsg = `${errOutput.message ?? 'Error'}\n\n${errOutput.error ?? ''}`;
					} else {
						errMsg = (recv.errThrown?.message ?? recv.errThrown) ?? 'Error';
					}
					throw Error(errMsg);
				}
			} catch (e) {
				throw e;
			} finally {
				HideProgress(progObj);
			}
		};
	
		defOptions.headers['X-Auth-Token'] = `Bearer ${topWindow().LIB.accessToken}`;
	
		const waiJsonSvc = new waiJsonInst();
		waiJsonSvc.beforeCallEvent = NeedParams;
		waiJsonSvc.afterCallEvent = ResultParams;
		waiJsonSvc.onResult = defOptions.onResult;
		waiJsonSvc.onError = defOptions.onError;
	
		const callOptions = {
			type: defOptions.type,
			async: defOptions.async,
			timeout: defOptions.timeout,
			dataType: defOptions.dataType,
			jsonText: defOptions.jsonText,
			headers: defOptions.headers
		};
	
		try {
			progObj = ShowProgress();
			waiJsonSvc.urlCall(`${topWindow().LIB.serverUrl}${svcUrl}`, inputData, callOptions);
		} catch (e) {
			HideProgress(progObj);
			throw e;
		}
	});
}
*/

function NeedParams(inputData, callOpt) {
	let BDO = {};
	let scrInfo;

	try {
		if (ActiveWindow()) {
			BDO = ActiveWindow().BDO;
			
			if (!BDO.SysInfo) {
				BDO.SysInfo = {};
			}
			if (!BDO.EtcInfo) {
				BDO.EtcInfo = {};
			}

			scrInfo = {
				'gwam' : callOpt.url.split('/').at(-1).substr(0, 2),
				// 'geor' : callOpt.url.split('/').at(-1).substr(3, 2), // TO-BE: 사용안함
				'ibcd' : bizTabCtrl().getCurrentTab().id
			};

			BDO.SysInfo.subjCd = scrInfo.gwam;
			// BDO.SysInfo.trscCd = scrInfo.geor; // TO-BE: 사용안함
			BDO.SysInfo.scrnId = scrInfo.ibcd;
		}
	} catch(e) {
		return false;
	}

	const CDO = LIB().CDO;

	if (CDO.SysInfo !== null && scrInfo) {
		CDO.SysInfo.subjCd = scrInfo.gwam;
		// CDO.SysInfo.trscCd = scrInfo.geor; // TO-BE: 사용안함
		CDO.SysInfo.scrnId = scrInfo.ibcd;
	}

	for (let x in CDO) {
		if (!['MenuData', 'MenuGrant'].includes(x)) {
			inputData[x] = JSON.parse(JSON.stringify(CDO[x]));
		}
	}

	for (let x in BDO) {
		if (!['input'].includes(x)) {
			const isArray = Array.isArray(BDO[x]);
			if (isArray) {
				inputData[x] = JSON.parse(JSON.stringify(BDO[x]));
			} else {
				if (!inputData[x]) {
					inputData[x] = {};
				}
				for (let y in BDO[x]) {
					inputData[x][y] = JSON.parse(JSON.stringify(BDO[x][y] ?? ''));
				}
			}
		}
	}

	//delete( dsObj.commons[0].rec[0]['FXFIG_OVGB'] ); // 확인 필요..

	console.log(`[${callOpt.url.split('/').at(-1)}] inputData -> `, inputData);

	return true;
}

function ResultParams() {
	return true;
}

//-----------------------------------------------------------------------------
// Dialog Processing for INOBIS : Aug2023, HHU : START
function DArgument(argData) {
	if (!window.dialogArguments) {
		this.topWindow = window.top;
	}
	else {
		this.topWindow = window.dialogArguments.topWindow;
	}

	this.openWindow = window;
	this.Args = (argData === undefined) ? null : argData;
}

function getPopupArgument() {
	var rt = null;
	if ((window.dialogArguments === undefined)||window.dialogArguments === null) {
		var err = new Error('getPopupArgument : this screen is not popup window or dialog');
		throw err;
	}

	try {
		if (( window.dialogArguments.Args !== undefined )&&( window.dialogArguments.Args !== null )) {
			rt = window.dialogArguments.Args;
		}
	} catch(e) {
		console.error('getPopupArgument',e);
		rt = null;
	}
	return rt;
}

function openPopupWindow( htmlUrl, dialogArg, dialogOpt, callBack ) {
	var DArg = new DArgument( dialogArg );
	var DUrl = LIB().GetTransURL( htmlUrl );

	openPopup( DUrl, DArg, dialogOpt, callBack );
}

function openDialogWindow( htmlUrl, dialogArg, dialogOpt, callBack ) {
	var DArg = new DArgument( dialogArg );
	var DUrl = LIB().GetTransURL( htmlUrl );

	openDialog( DUrl, DArg, dialogOpt, callBack );
}

function getDialogOption( newOpt ) {
	var opt = {
		'status'       : false,
		'resizable'    : false,
		'scroll'       : false,
		'center'       : true,
		'width'        : 950,
		'height'       : 600
	};
	var x;

	if (newOpt !== undefined) {
		for (x in opt) {
			try {
				if (newOpt[x] !== undefined) {
					opt[x] = newOpt[x];
				}
			} catch(E) {

			}
		}
	}

	opt['dialogWidth']  = opt['width'];
	opt['dialogHeight'] = opt['height'];

	return opt;
}
// Dialog Processing for INOBIS : Aug2023, HHU : END
//-----------------------------------------------------------------------------

function GBSError(eNo,eMess,eDesc,eStack) {
	this.number = eNo;
	this.message = eMess;
	this.description = (eDesc !== undefined) ? eDesc : eMess;
	var err = new Error('GBSError');
	this.stack = (eStack !== undefined) ? eStack : err.stack;
}

// 20120614_Park_1
/* ========================================================================== */
/* CM1102(Photo) Popup                                                        */
/* ========================================================================== */
function fSearchCM1102(strCifNo, strRefNo) {
    var DArg  = new DArgument();         //Argument 사용
    DArg.Args = new Array(2);            //Argument에 배열 저장

    DArg.Args[0]  = strCifNo;
    DArg.Args[1]  = strRefNo;

    strWinSts = "status:no; resizable:no; scroll:no; center:yes; dialogHeight:430px; dialogWidth:430px;";
    openPopup(LIB().GetTransURL('cm/CM1102.html'), DArg, strWinSts);
}

function fCheckGB(init_do) {
	const BDO = topWindow().MAIN.tabCtrl.getCurrentTab().pageElem.contentWindow.BDO;
	var sts_check = 0;
	var ovgb;
	var route_gb;

	if(init_do == "A") {
		if (BDO.OvrdInfo?.ovrdDvCd != '1') {
			ovgb = 1;
		}

		if (BDO.Account?.routeGb != '1') {
			route_gb = 1;
		}
	
	    if(ovgb == 1 && route_gb == 1) {
			sts_check = 1;
		}
	} else {
	    if (init_exec == 1) {
			sts_check = 1;
		}
	}

	return sts_check;
}

/**
 * (AS-IS) Use DSO
 * (TO-BE) Use array data (replaced with G_SetCBWithData)
function G_SetCBWithDSO(objCB, objDSO, KeyFld, KeyValue, CodeFld, CodeNmFld, NeedDel)
{
	var i = 0;

	if(objCB == null) return;
	if(objDSO == null) return;

	objCB.clear();

	objDSO.recordset.moveFirst();
	while(!objDSO.recordset.EOF)
	{

		if(objDSO.recordset.fields(KeyFld).value == KeyValue)
		{
			//alert("### keyfld ["+objDSO.recordset.fields(KeyFld).value + "]");
			//alert("### KeyValue ["+KeyValue + "]");
			//alert("### aaa ["+objDSO.recordset.fields(CodeFld).value + "]");   
			objCB.addItem(
				objDSO.recordset.fields(CodeFld).value,
				objDSO.recordset.fields(CodeNmFld).value
			);
		}

		objDSO.recordset.moveNext();
	}
}
*/

function G_SetCBWithData(objCB, arrData, KeyFld, KeyValue, CodeFld, CodeNmFld) {
	if (typeof arrData == 'object' && !Array.isArray(arrData)) {
		arrData = [arrData];
	}

	const cbData = arrData
		.filter(elem => elem[KeyFld] == KeyValue)
		.map(elem => {
			return {
				[CodeFld]: elem[CodeFld],
				[CodeNmFld]: elem[CodeNmFld]
			};
		});

	objCB.setData(cbData);
}

// var ShowInfoDialog = LIB()?.ShowInfoDialog;
// var ShowInfoDialog2 = LIB()?.ShowInfoDialog2;
// var ShowErrorDialog =  LIB()?.ShowErrorDialog;
// var showInfoDialog = LIB()?.ShowInfoDialog;
// var showInfoDialog2 = LIB()?.ShowInfoDialog2;
// var showErrorDialog =  LIB()?.ShowErrorDialog;

var showInfoDialog  = ShowInfoDialog;
var showInfoDialog2 = ShowInfoDialog2;
var showErrorDialog = ShowErrorDialog;
var showConfirmDialog = ShowConfirmDialog;
var showFileListDialog = ShowFileListDialog;

/**
 * Error 팝업 호출
 * @param {string} sMsg
 * @param {string} [sUrl]
 * @param {string} [sLine]
 * @param {function} [callback]
 * @returns {void}
 */
function ShowErrorDialog(sMsg, sUrl, sLine, callback) {
	const DArg = new DArgument();
	DArg.Args = {
		ED_Title: "Error Dialog",
		ED_Message: sMsg,
		ED_URL: sUrl,
		ED_Line: sLine
	};

	if (window.showModalDialog !== undefined){
		const DlgOption = "dialogHeight:400px; dialogWidth:700px ;scroll:no;status:no;unadorned:yes";
		//window.showModalDialog("/frame/dialogError.html",DArg, DlgOption );
		openPopup("/frame/dialogError.html", DArg, DlgOption, function(){
			if (callback) {
				callback();
			}
		});
	} else {
		alert(sMsg+'\n\n'+sUrl+'\n'+sLine);
		if (callback) {
			callback();
		}
	}
}

/**
 * Information 팝업 호출
 * @param {string} sMsg
 * @param {function} [callback]
 * @returns {void}
 */
function ShowInfoDialog(sMsg, callback) {
	const DArg = new DArgument();
	DArg.Args = {
		ED_Title: "Information Dialog",
		ED_Message: sMsg
	};

	const DlgOption = "dialogHeight:400px;dialogWidth:700px;scroll:no;status:no;unadorned:yes";
	//window.showModalDialog("/frame/dialogInfo.html",DArg,DlgOption);
	openPopup("/frame/dialogInfo.html", DArg, DlgOption, function(){
		if (callback) {
			callback();
		}
	});
}

/**
 * Information 팝업 호출 (타이틀 지정)
 * @param {string} sTitle
 * @param {string} sMsg
 * @param {function} [callback]
 * @returns {void}
 */
function ShowInfoDialog2(sTitle, sMsg, callback) {
	const DArg = new DArgument();
	DArg.Args = {
		ED_Title: sTitle,
		ED_Message: sMsg
	};

	const DlgOption = "dialogHeight:400px;dialogWidth:700px;scroll:no;status:no;unadorned:yes";
	//window.showModalDialog("/frame/dialogInfo.html",DArg,DlgOption);
	openPopup("/frame/dialogInfo.html", DArg, DlgOption, function(){
		if (callback) {
			callback();
		}
	});
}

/**
 * Confirm 팝업 호출
 * @param {string} sMsg
 * @param {function} [callback] (bConfirm: boolean)
 * @returns {void}
 */
function ShowConfirmDialog(sMsg, callback) {
	const DArg = new DArgument();
	DArg.Args = {
		ED_Message: sMsg
	};

	const DlgOption = "dialogHeight:400px;dialogWidth:700px;scroll:no;status:no;unadorned:yes";
	//window.showModalDialog("/frame/dialogInfo.html",DArg,DlgOption);
	openPopup("/frame/dialogConfirm.html", DArg, DlgOption, function(bConfirm){
		if (callback) {
			callback(bConfirm);
		}
	});
}

/**
 * Call file list dialog (타이틀 지정)
 * @param {object} fileList
 * @param {function} [callback]
 * @returns {void}
 */
function ShowFileListDialog(fileList, callback) {
	const DArg = new DArgument();
	DArg.Args = {
		fileList
	};

	const DlgOption = "dialogHeight=478px;dialogWidth=480px;scroll:no;status:no;unadorned:yes";

	openPopup("/frame/dialogFileList.html", DArg, DlgOption, function(result){
		if (callback) {
			callback(result ?? '');
		}
	});
}

function ShowInfoWarnDialog(sCif, sAcct, sMed, sRef, callback) {
	// gBizDate = LIB().Util.DateToLocal(GET_COMM_DATA("FXFIG_COM","FXFIG_IBIL", 0), "YYYY/MM/DD", "S");
	gBizDate = LIB().Util.DateToLocal(getMainCommData('SysInfo').procBascDt, "YYYY/MM/DD", "S");
 
	const infoMsg = "Untuk permintaan dokumen, informasi atau transaksi yang terkait dengan nasabah mohon segera ESKALASI ke Kantor Pusat";

	if(sCif != ""){
		if(sCif.length == 8){
		   sCif = "00"+sCif;
		}
		// SqlString= "";
		// SqlString = SqlString +"SELECT 1 FROM acom_cix_base a, acom_cix_warn b "
		// SqlString = SqlString +" WHERE a.cix_no = b.cix_no "
		// SqlString = SqlString +" AND TO_DATE('"+ gBizDate +"','MM/DD/YYYY') between b.start_dt and b.end_dt" 
		// SqlString = SqlString +" AND b.sts = 0 "
		// SqlString = SqlString +" AND b.cix_no = '"+sCif+"' "
		// /*alert(SqlString);*/
		// wasSqlDsoWarn.SQL = SqlString;
		// /*alert(wasSqlDsoWarn.recordset.RecordCount);*/
		// if ( wasSqlDsoWarn.recordset.RecordCount == 0 )
		// {
		// 	return;
		// }
		// else{
		   
		// 	DArg.ED_Title   = "Information Dialog";
		// 	DArg.ED_Message = "Untuk permintaan dokumen, informasi atau transaksi yang terkait dengan nasabah mohon segera ESKALASI ke Kantor Pusat";
		// 	DlgOption = "dialogHeight:300px;dialogWidth:550px;scroll:no;status:no;unadorned:yes";
			
		// 	window.showModalDialog("/dialog_info.html",DArg,DlgOption);
		// 	return "x";
		// }
		const inputData = {
			dvCd: '27',
			param1: gBizDate,
			param2: sCif
		};

		comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
			const cnt = output.output27?.cnt ?? 0;
			if (cnt > 0) {
				ShowInfoDialog(infoMsg, callback);
			}
		});
	} else if (sAcct != "") {
		var acct15 = "";
		if (sAcct.length < 15) {
			if (sAcct.length == 10) {
				/*
				SqlString= "";
				SqlString = SqlString +"SELECT ref_no "
				SqlString = SqlString +" FROM acom_cont_base "
				SqlString = SqlString +" WHERE sub_ref_no = '"+sAcct+"'"
				wasSqlDsoWarn.SQL = SqlString;
				
				acct15 = wasSqlDsoWarn.recordset.fields("ref_no").value;
				*/
				const inputData = {
					dvCd: '59',
					param1: sAcct
				};
		
				comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
					const rtnArr = output.output59?.grid01 ?? [];
					if (rtnArr.length > 0) {
						acct15 = rtnArr[0].refNo;
					}
					cb(acct15);
				});
			} else if (sAcct.length == 11) {
				/*
				SqlString= "";
				SqlString = SqlString +"SELECT acct_no "
				SqlString = SqlString +" FROM acom_psh_vtno_base "
				SqlString = SqlString +" WHERE psd_no = '"+sAcct+"'"
				wasSqlDsoWarn.SQL = SqlString;
				
				acct15 = wasSqlDsoWarn.recordset.fields("acct_no").value;
				*/
				const inputData = {
					dvCd: '60',
					param1: sAcct
				};
		
				comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
					acct15 = output.output60?.acctNo ?? '';
					cb(acct15);
				});
			} else {
				/*
				SqlString= ""; 
				SqlString = SqlString +"SELECT chref_hnb_ref "
				SqlString = SqlString +" FROM acom_com_chref "
				SqlString = SqlString +" WHERE chref_use_ref = '"+sAcct+"'"
				SqlString = SqlString +" AND upmu_cd = 'DP' "
				wasSqlDsoWarn.SQL = SqlString;
				
				acct15 = wasSqlDsoWarn.recordset.fields("chref_hnb_ref").value;
				*/
				const inputData = {
					dvCd: '61',
					param1: sAcct
				};
		
				comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
					const rtnArr = output.output61?.grid01 ?? [];
					if (rtnArr.length > 0) {
						acct15 = rtnArr[0].refNo;
					}
					cb(acct15);
				});
			}   
		}
		else{
			cb(sAcct);
		}

		function cb(acctNo) {
			// SqlString= "";
			// SqlString = SqlString +"SELECT 1 FROM acom_cix_base a, acom_cix_warn b "
			// SqlString = SqlString +" WHERE a.cix_no = b.cix_no "
			// SqlString = SqlString +" AND TO_DATE('"+ gBizDate +"','MM/DD/YYYY') between b.start_dt and b.end_dt" 
			// SqlString = SqlString +" AND b.sts = 0 "
			// SqlString = SqlString +" AND b.cix_no in (select cix_no from acom_cont_base where ref_no = '"+acct15+"') "
			// wasSqlDsoWarn.SQL = SqlString;
			// /*alert(SqlString);
			// alert(wasSqlDsoWarn.recordset.RecordCount);*/
			// if ( wasSqlDsoWarn.recordset.RecordCount == 0 )
			// {
			// 	return;
			// }
			// else{
			
			// 	DArg.ED_Title   = "Information Dialog";
			// 	DArg.ED_Message = "Untuk permintaan dokumen, informasi atau transaksi yang terkait dengan nasabah mohon segera ESKALASI ke Kantor Pusat";
			// 	DlgOption = "dialogHeight:300px;dialogWidth:550px;scroll:no;status:no;unadorned:yes";
				
			// 	window.showModalDialog("/dialog_info.html",DArg,DlgOption);
			// 	return "x";
			// }
			const inputData = {
				dvCd: '62',
				param1: gBizDate,
				param2: acctNo
			};
			comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
				const cnt = output.output62?.cnt ?? 0;
				if (cnt > 0) {
					ShowInfoDialog(infoMsg, callback);
				}
			});
		}
	} else if(sMed != ""){
		// SqlString= "";
		// SqlString = SqlString +"SELECT 1 FROM acom_cix_base a, acom_cix_warn b,aebk_ebh_base c "
		// SqlString = SqlString +" WHERE a.cix_no = b.cix_no "
		// SqlString = SqlString +" AND a.cix_no = c.cix_no "
		// SqlString = SqlString +" AND TO_DATE('"+ gBizDate +"','MM/DD/YYYY') between b.start_dt and b.end_dt" 
		// SqlString = SqlString +" AND b.sts = 0 "
		// SqlString = SqlString +" AND c.med_no = '"+sMed+"' "
		// /*alert(SqlString);*/
		// wasSqlDsoWarn.SQL = SqlString;
		// /*alert(wasSqlDsoWarn.recordset.RecordCount);*/
		// if ( wasSqlDsoWarn.recordset.RecordCount == 0 )
		// {
		// 	return;
		// }
		// else{
		 
		// 	DArg.ED_Title   = "Information Dialog";
		// 	DArg.ED_Message = "Untuk permintaan dokumen, informasi atau transaksi yang terkait dengan nasabah mohon segera ESKALASI ke Kantor Pusat";
		// 	DlgOption = "dialogHeight:300px;dialogWidth:550px;scroll:no;status:no;unadorned:yes";
			
		// 	window.showModalDialog("/dialog_info.html",DArg,DlgOption);
		// 	return "x";
		// }
		const inputData = {
			dvCd: '63',
			param1: gBizDate,
			param2: sMed
		};
		comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
			const cnt = output.output63?.cnt ?? 0;
			if (cnt > 0) {
				ShowInfoDialog(infoMsg, callback);
			}
		});
	} else if(sRef != ""){
		//alert(topWindow().MAIN.WVMF.selectedID);
		if(sRef.substring(0, 3) == 'DEB'){
		
			// SqlString= "";
			// SqlString = SqlString +"SELECT 1 FROM acom_cix_base a, acom_cix_warn b,aebk_ebh_base c "
			// SqlString = SqlString +" WHERE a.cix_no = b.cix_no "
			// SqlString = SqlString +" AND a.cix_no = c.cix_no "
			// SqlString = SqlString +" AND TO_DATE('"+ gBizDate +"','MM/DD/YYYY') between b.start_dt and b.end_dt" 
			// SqlString = SqlString +" AND b.sts = 0 "
			// SqlString = SqlString +" AND c.ref_no = '"+sRef+"' "
			// /*alert(SqlString);*/
			// wasSqlDsoWarn.SQL = SqlString;
			// /*alert(wasSqlDsoWarn.recordset.RecordCount);*/
			// if ( wasSqlDsoWarn.recordset.RecordCount == 0 )
			// {
			// 	return;
			// }
			// else{
			 
			// 	DArg.ED_Title   = "Information Dialog";
			// 	DArg.ED_Message = "Untuk permintaan dokumen, informasi atau transaksi yang terkait dengan nasabah mohon segera ESKALASI ke Kantor Pusat";
			// 	DlgOption = "dialogHeight:300px;dialogWidth:550px;scroll:no;status:no;unadorned:yes";
				
			// 	window.showModalDialog("/dialog_info.html",DArg,DlgOption);
			// 	return "x";
			// }
			const inputData = {
				dvCd: '64',
				param1: gBizDate,
				param2: sRef
			};
			comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
				const cnt = output.output64?.cnt ?? 0;
				if (cnt > 0) {
					ShowInfoDialog(infoMsg, callback);
				}
			});
		}
		else{
			// SqlString= "";
			// SqlString = SqlString +"SELECT 1 FROM acom_cont_base a, acom_cix_warn b,acom_comh_msg c "
			// SqlString = SqlString +" WHERE a.ref_no = c.our_ref "
			// SqlString = SqlString +" AND a.cix_no = b.cix_no "
			// SqlString = SqlString +" AND TO_DATE('"+ gBizDate +"','MM/DD/YYYY') between b.start_dt and b.end_dt" 
			// SqlString = SqlString +" AND b.sts = 0 "
			// SqlString = SqlString +" AND c.our_ref = '"+sRef+"' "
			// /*alert(SqlString);*/
			// wasSqlDsoWarn.SQL = SqlString;
			// /*alert(wasSqlDsoWarn.recordset.RecordCount);*/
			// if ( wasSqlDsoWarn.recordset.RecordCount == 0 )
			// {
			// 	return;
			// }
			// else{
			 
			// 	DArg.ED_Title   = "Information Dialog";
			// 	DArg.ED_Message = "Untuk permintaan dokumen, informasi atau transaksi yang terkait dengan nasabah mohon segera ESKALASI ke Kantor Pusat \n Ref no : " + sRef;
			// 	DlgOption = "dialogHeight:300px;dialogWidth:550px;scroll:no;status:no;unadorned:yes";
				
			// 	window.showModalDialog("/dialog_info.html",DArg,DlgOption);
			// 	return "x";
			// }
			const inputData = {
				dvCd: '65',
				param1: gBizDate,
				param2: sRef
			};
			comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
				const cnt = output.output65?.cnt ?? 0;
				if (cnt > 0) {
					ShowInfoDialog(infoMsg, callback);
				}
			});
		}
	}
	//return true;
}

// waiBrowser object
var waiBrowser = LIB()?.waiBrowser;


/* ========================================================================== */
/* GBS Common Script : Ready                                                  */
/* ========================================================================== */
// var G_ERR_DATE;
// var G_err_hours;
// var G_err_minutes;
// var G_err_seconds;
var init_exec = 0;
// var sScanSts = -1; // Scan Status(1:Normal, 0:Just Scan, -1: didn't scan, Other:Error
var sScanSts = -1; // Scan Status(1:Normal, -1: didn't scan, Other:Error)
// var sEngineFileNm = "C:\\HanaBank\\App32DotNet\\AxInterop.TWAINVISUALISLib.dll";
var SKN_NG_DT = "2015/06/04";

var gBizDate;

(function (){
	// 날짜 dateFormat 셋팅
	if ($wai?.default) {
		$wai.default.dateFormat = LIB()?.CDO?.SysInfo?.dtFrmt ?? 'mmddyyyy';
		$wai.default.dateSeparator = '/';
		$wai.default.getDateFormat = 'yyyy/mm/dd';
	}
})(); 

$(document).ready(function() {
	//console.log('GBS Common Script : Ready');
	/* 변환이 필요한 소스에서 $gbsLib.genDsoByJson(), $gbsLib.genMultiDsoByJson() 직접 호출
	$gbsLib.genXMLTag();
	*/
	$gbsLib.genActions();

	procLabelInnerElem();
	procStyleTransForm();
	procGridContextMenuSetting();

	document.body['DoEvents'] = function() {
		console.warn('document.body.DoEvents 함수 사용 안함 삭제 필요');
	};

	window.onerror = WorkErrorProc;

	// openDialog에선 현 시점에 window.dialogArguments 확인 불가... -> dialog 로드 후 DialogWindowLoad 호출 처리
	if (window.dialogArguments) {
		if ($wai.debug >= 0) console.log('['+location.pathname+'] is Dialog Windows - Execute : "DialogWindowLoad()" function');

		const onLoad = document.body.onload;
		document.body.onload = function(){
			if (onLoad !== undefined) {
				if (onLoad !== null) onLoad();
			}
			DialogWindowLoad();
		};
	} else {
		if ($wai.debug >= 0) console.log('['+location.pathname+'] is BizPage in GBS Framework');
	}

	setLanguage();
});

function setLanguage() {
	var urlSearchParamsObject = new URLSearchParams(window.location.search)
	let docName = urlSearchParamsObject.get('docname');
	let lang = urlSearchParamsObject.get('lang');
	if (docName && lang) {
		let ext = 'stl';
		let page = docName.substring(0, docName.lastIndexOf("."));
		let path = `/${ext}${page}.${ext}`;
		$wai.rtl.multiLangManager.loadMultiLangDicData(path, langObj => {
			const multiLangObj = {};
			Object.keys(langObj).forEach(key => {
				const keyArr = Object.keys(langObj[key]);
				keyArr.forEach(_key => {
					if (multiLangObj[_key]) {
						multiLangObj[_key][key] = langObj[key][_key];
					} else {
						multiLangObj[_key] = {
							[key]: langObj[key][_key]
						};
					}
				});
			});
			$wai.rtl.multiLangManager.setWaiMultiLangDicData(multiLangObj);
			$wai.rtl.multiLangManager.setCurrentPageLanguage(document, lang, lang);
		});
	}

	function getCookie(name) {
		try {
			var search = name + "="
			if (document.cookie.length > 0) {
				offset = document.cookie.indexOf(search);

				if (offset != -1) {
					offset += search.length
					end = document.cookie.indexOf(";", offset)
					if (end == -1) end = document.cookie.length
					return unescape(document.cookie.substring(offset, end))
				}
			}
		}
		catch(E) {
			alert(E.message);
		}
	}
}

$(window).load(function(){
	//alert('$(window).load');
});


/* ========================================================================== */
/*  User function for Y                                                       */
/* ========================================================================== */
function procLabelInnerElem() {
	var changeTags = ['dateedit','codecombo'];
	for (var i=0;i<changeTags.length;i++) changeParentComp(changeTags[i]);

	function changeParentComp(tagName) {
		var tarElems = $(tagName);
		for (var i=0;i<tarElems.length;i++) {
			var e = tarElems[i];
			var p = e.parentElement;

			if ((p.tagName+'').toUpperCase() == 'LABEL') {
				p.setAttribute('for', '');
			}
		}
	}
}

function procStyleTransForm() {
	document.querySelectorAll('input, textarea').forEach(elem => {
		const transForm = elem.style['text-transform'];
		if (transForm) {
			if (transForm == 'uppercase') {
				elem.addEventListener('input', function() {
					this.value = this.value.toUpperCase();
				});
			} else if (transForm == 'lowercase') {
				elem.addEventListener('input', function() {
					this.value = this.value.toLowerCase();
				});
			}
		}
	});
}

function procGridContextMenuSetting() {
	document.querySelectorAll('grid').forEach(elem => {
		if (elem.compObj) {
			elem.compObj.setContextMenu(`<li style='float:none;text-align:left' onclick='HBS_ExcelLoad("${elem.compObj.id}")'>Save Excel</li>`);
		}
	});
}

/* ========================================================================== */
/*  User function for Y                                                       */
/* ========================================================================== */

var result_arr;
function CpnSearch(doc){

	/*
		document.body의 컴포넌트를 배열화 시켜 리턴
	*/

	if(doc == undefined) doc = document.body;

	doc_arr = doc;
	result_arr = [];
	var loop_arr   = [];

	for(var i=0; i<doc_arr.childElementCount; i++){
		var obj = doc_arr.children[i];
		if(obj.childElementCount == 0){
			result_arr.push(obj);
		}else{
			result_arr.push(obj);
			loop_arr.push(obj);
		}
	}	

	while(loop_arr.length > 0){
		loop_arr = CpnLoop(loop_arr);
	}

	return result_arr;
}
function CpnLoop(loop_arr){

	/*
		CpnSearch의 sub function
	*/

	var return_arr = [];

	for(var i=0; i<loop_arr.length; i++){
		var cdr = loop_arr[i];
		for(var j=0; j<cdr.childElementCount; j++){			  
			var obj = cdr.children[j];
			if(obj.childElementCount == 0 || obj.getAttribute("iswai") == "$comp$"){
				result_arr.push(obj);
			}else{
				return_arr.push(obj);
			}
		}
	}

	return return_arr;
}

function ChkCpnClassByWF(doc){

	/*
		document.body의 컴포넌트 중 class가 default(필수)일때 값 검사
	*/

	console.log(">>> ChkCpnClassByWF Start ");	

	var cpnArr = CpnSearchNonDisplay(doc);
	var result = "";
	var defArr = [];
	var obj = [];


	for(var i=0; i<cpnArr.length; i++){
		obj = [];
		if(cpnArr[i].getAttribute("iswai") != null){
			if(cpnArr[i].getAttribute("objid") != ""){
				obj = eval("WorkFrame.contentWindow." + cpnArr[i].getAttribute("objid"));
			}
		}else{
			if(cpnArr[i].getAttribute("id") != ""){
				obj = eval("WorkFrame.contentWindow." + cpnArr[i].getAttribute("id"));
			}
		}

		if(obj != undefined && obj != ""){
			if("default" == obj.class ||
			   "default" == obj.className){
				defArr.push(obj);
			}
		}
	}

	for (var i=0; i<defArr.length; i++){
		console.log(">>> mandatory check : ",defArr[i].id);

		if (!defArr[i].disabled && defArr[i].style.display != "none") {
			if (defArr[i].value === undefined || defArr[i].value === "" ||
				(defArr[i].tagName.toUpperCase() == "EDIT" && defArr[i].type.toUpperCase() == "CURRENCY" && Number(defArr[i].value) == 0))
			{
				const defElem = defArr[i].root ?? defArr[i];
				if (defElem.getAttribute('manalerttext')) {
					result = defElem.id + '||' + defElem.getAttribute('manalerttext');
				} else {
					result = defElem.id;
				}
				break;
			}
		}
	}

	console.log(">>> ChkCpnClassByWF Finish ");

	return result;
}

function CpnSearchNonDisplay(doc){

	/*
		document.body의 컴포넌트중 display가 none이 아닌 객체만 배열화 시켜 리턴
	*/

	if(doc == undefined) doc = document.body;

	doc_arr = doc;
	result_arr = [];
	var loop_arr   = [];

	for(var i=0; i<doc_arr.childElementCount; i++){
		var obj = doc_arr.children[i];
		if(obj.style.display == "none") continue;
		if(obj.childElementCount == 0 || (obj.getAttribute("iswai") == "$comp$" && obj.tagName != "TABCONTROL")){
			result_arr.push(obj);
		}else{
			loop_arr.push(obj);
		}
	}	

	while(loop_arr.length > 0){
		loop_arr = CpnLoopNonDisplay(loop_arr);
	}

	return result_arr;
}

function CpnLoopNonDisplay(loop_arr){

	/*
		CpnSearchNonDisplay의 sub function
	*/

	var return_arr = [];

	for(var i=0; i<loop_arr.length; i++){
		var cdr = loop_arr[i];
		for(var j=0; j<cdr.childElementCount; j++){		
			var obj = cdr.children[j];
			if(obj.style.display == "none") continue;
			if(obj.childElementCount == 0 || (obj.getAttribute("iswai") == "$comp$" && obj.tagName != "TABPAGE")){
				result_arr.push(obj);
			}else{
				return_arr.push(obj);
			}
		}
	}

	return return_arr;
}

function GetCpnIdsByName(name){

	/*
		함수 설명
		name = "dtpBASE_IL"

		사용 예제
		name이 dtpBASE_IL인 컴포넌트의 id값을 얻고 싶음
		var array = GetCpnIdsByName("dtpBASE_IL");

		반환 값 사용 예제
		for(var i=0; i<array.length; i++){
		    eval(array[i]).value;
		}
	*/

	var arr = CpnSearch();
	var rtnValue = [];

	for(var i=0; i<arr.length; i++){
		// html 기본 컴포넌트
		if(arr[i].getAttribute("iswai") == null){
			if(arr[i].getAttribute("name") == name){
				rtnValue.push(arr[i].id);
			}

			// wai 컴포넌트
		}else{
			if(arr[i].getAttribute("_name") == name){
				rtnValue.push(arr[i].getAttribute("objid"));
			}
		}
	}

	return rtnValue;
}

function SetCpnDisplayById(arr, dspYn){

	/*
		함수 설명
		var arr = ["dtpBASE_IL", "mskCIX_NO", "txtCUST_NM"];
		dspYn = true(보임), false(안보임)

		사용 예제
		id에 해당하는 컴포넌트의 display값을 설정
		var arr = [ "dtpBASE_IL",
					"mskCIX_NO",
					"txtCUST_NM"
				  ];
		SetCpnDisplayById(arr, true);  // 화면에 나타남
		SetCpnDisplayById(arr, false); // 화면에서 사라짐
	*/

	for(var i=0; i<arr.length; i++){
		if(dspYn) eval(arr[i]).style.display = "";
		else eval(arr[i]).style.display = "none";
	}
}

function SetCpnDisplayByIdLbl(arr, dspYn){

	/*
		함수 설명
		var arr = ["lblCIX_NO"];
		dspYn   = true(보임), false(안보임)

		사용 예제
		id,labelid 에 해당하는 컴포넌트의 display값을 설정
		var arr = [ "dtpBASE_IL",
					"mskCIX_NO",
					"txtCUST_NM"
				  ];
		SetCpnDisplayByIdLbl(arr, true);  // 화면에 나타남
		SetCpnDisplayByIdLbl(arr, false); // 화면에서 사라짐
	*/

	var cpnArr = CpnSearch();
	var rtnValue = [];

	for(var i=0; i<arr.length; i++){
		rtnValue.push(arr[i]);
		for(var j=0; j<cpnArr.length; j++){
			// html 기본 컴포넌트
			if(cpnArr[j].getAttribute("iswai") == null){
				if(cpnArr[j].getAttribute("labelid") == arr[i]){
					rtnValue.push(cpnArr[j].id);
				}
				// wai 컴포넌트
			}else{
				if(cpnArr[j].getAttribute("_labelid") == arr[i]){
					rtnValue.push(cpnArr[j].getAttribute("objid"));
				}
			}
		}
	}

	for(var i=0; i<rtnValue.length; i++){
		if(dspYn) eval(rtnValue[i]).style.display = "";
		else eval(rtnValue[i]).style.display = "none";
	}
}

function GetCpnInfoNmByCpn(obj, pro){

	/*
		함수 설명
		var obj = 컴포넌트
		var pro = 속성값 (className, value, labelid)

		사용 예제
		obj 에 해당하는 컴포넌트의 특정 속성 값을 얻음
		var info = GetCpnInfoNmByCpn(obj, "className");
	*/

	if(obj.getAttribute("iswai") == null){
		if(pro == "className") return obj.className;
		if(pro == "value")     return obj.value;
		if(pro == "id")        return obj.id;
		if(pro == "labelid")   return obj.getAttribute("labelid");
		if(pro == "type")      return obj.getAttribute("type");
		if(pro == "class")     return obj.class;
		if(pro == "title")     return obj.title;
		// wai 컴포넌트
	}else{
		if(pro == "className") return obj.getAttribute("className");
		if(pro == "value")     return eval(obj.getAttribute("objid")).value;
		if(pro == "id")        return eval(obj.getAttribute("objid")).id;
		if(pro == "labelid")   return obj.getAttribute("_labelid");
		if(pro == "type")      return obj.getAttribute("_type");
		if(pro == "class")     return obj.getAttribute("_class");
		if(pro == "title")     return obj.getAttribute("_title");
	}

	return "";
}

/* 사용 확인 필요
function fDSORcdCopy(dsoB, dsoA){

	// 함수 설명
	// var dsoA = paramInDSO;
	// var dsoB = paramInDSO1;

	// 사용 예제
	// dsoB.recordset에 dsoA.recordset 값을 복사 (연구소 권장 가이드)
	// dsoA와 dsoB의 구조는 같아야함
	// fDSORcdCopy(dsoB, dsoA);

	var len = dsoA.recordset.fieldInfo.length;
	for(var i=0; i<len; i++){
		if(dsoA.recordset.fieldInfo[i].name != dsoB.recordset.fieldInfo[i].name)
			return null;
	}

	dsoB.clear();

	var srcRecs = dsoA.recordset.getRecords();
	var tarRecs = [];

	if( srcRecs.length == 0 ) ShowInfoDialog("Data Not Found !!!");

	for (var i=0; i<srcRecs.length; i++){
		tarRecs.push(srcRecs[i]);
	}

	dsoB.recordset.setRecords(tarRecs);
	dsoB.recordset.update();

}
*/

/* 사용 확인 필요
function fDSORcdCopyApd(dsoB, dsoA, rCnt){

	// 함수 설명
	// var dsoA = paramInDSO;
	// var dsoB = paramInDSO1;
	// var rCnt = 30;

	// 사용 예제
	// dsoB.recordset에 dsoA.recordset 데이터를 rCnt수 만큼 복사(append) (연구소 권장 가이드)
	// dsoA와 dsoB의 구조는 같아야함
	// fDSORcdCopyApd(dsoB, dsoA, rCnt);

	var len = dsoA.recordset.fieldInfo.length;
	for(var i=0; i<len; i++){
		if(dsoA.recordset.fieldInfo[i].name != dsoB.recordset.fieldInfo[i].name)
			return null;
	}

	var srcRecs = dsoA.recordset.getRecords();
	var tarRecs = dsoB.recordset.getRecords();

	if( srcRecs.length == 0 ) ShowInfoDialog("Data Not Found !!!");

	for (var i=0; i<srcRecs.length; i++){
		if(rCnt != undefined){
			if(i == rCnt) break;
		}
		tarRecs.push(srcRecs[i]);
	}

	dsoB.recordset.setRecords(tarRecs);
	dsoB.recordset.update();

}
*/

/* 사용 확인 필요
function fDSORcdCopyByNm(dsoB, dsoA, hdNm){

	// 함수 설명
	// var dsoA = paramInDSO;
	// var dsoB = paramInDSO1;
	// var hdNm = "FICH00";

	// 사용 예제
	// dsoB.recordset에 dsoA.recordset 값을 복사 (필드명 비교)
	// dsoB를 초기화 하지 않고 진행
	// fDSORcdCopyByNm(dsoB, dsoA);           필드명이 일치하면 복사
	// fDSORcdCopyByNm(dsoB, dsoA, "FICH00"); 헤더명을 제외한 필드명이 일치하면 복사

	var srcRecs = dsoA.recordset.getRecords();
	var tarRecs = dsoB.recordset.getRecords();

	var srcFldInfo = dsoA.recordset.fieldInfo;
	var tarFldInfo = dsoB.recordset.fieldInfo;

	var strFldNm = [];
	var tarFldNm = [];

	var result  = [];

	if( srcRecs.length != 1 || tarRecs.length != 1 ){
		var Err = new Error();
		Err.description = "Data count is not same !!!";
		throw Err;
	}

	var dsoALen = srcFldInfo.length;
	var dsoBLen = tarFldInfo.length;

	for(var i=0; i<dsoALen; i++){
		for(var j=0; j<dsoBLen; j++){
			var fldAnm = srcFldInfo[i].name;
			var fldBnm = tarFldInfo[j].name;

			if(hdNm == undefined){
				if(fldAnm == fldBnm){
					strFldNm.push(fldAnm);
					tarFldNm.push(fldBnm);
				}
			}else{
				if(fldAnm.replace(hdNm+"_", "") == fldBnm.replace(hdNm+"_", "")){
					strFldNm.push(fldAnm);
					tarFldNm.push(fldBnm);
				}
			}
		}
	}

	for(var cnt=0; cnt<srcRecs.length; cnt++){
		var tmpRecs = tarRecs[0];

		for(var i=0; i<strFldNm.length; i++){
			tmpRecs[tarFldNm[i]] = srcRecs[cnt][strFldNm[i]];	
		}

		result.push(tmpRecs);
	}

	dsoB.recordset.setRecords(result);
	dsoB.recordset.update();

}
*/

/*
function fDSORcdCopyByNmArr(dsoB, dsoA, hdNm){

	// 함수 설명
	// var dsoA = paramInDSO;
	// var dsoB = paramInDSO1;
	// var hdNm = "FICH00";

	// 사용 예제
	// dsoB.recordset에 dsoA.recordset 값을 복사 (배열전용, 필드명 비교)
	// dsoB를 초기화 하지않고 진행(자동 append)
	// fDSORcdCopyByNmArr(dsoB, dsoA);           필드명이 일치하면 복사
	// fDSORcdCopyByNmArr(dsoB, dsoA, "FICH00"); 헤더명을 제외한 필드명이 일치하면 복사

	var srcRecs = dsoA.recordset.getRecords();
	var tarRecs = dsoB.recordset.getRecords();

	var srcFldInfo = dsoA.recordset.fieldInfo;
	var tarFldInfo = dsoB.recordset.fieldInfo;

	var strFldNm = [];
	var tarFldNm = [];

	if( srcRecs.length == 0 ){
		// 		var Err = new Error();
		// 		Err.description = "Data Not Found !!!";
		// 		throw Err;
		return;
	}

	var dsoALen = srcFldInfo.length;
	var dsoBLen = tarFldInfo.length;

	for(var i=0; i<dsoALen; i++){
		for(var j=0; j<dsoBLen; j++){
			var fldAnm = srcFldInfo[i].name;
			var fldBnm = tarFldInfo[j].name;

			if(hdNm == undefined){
				if(fldAnm == fldBnm){
					strFldNm.push(fldAnm);
					tarFldNm.push(fldBnm);
				}
			}else{
				if(fldAnm.replace(hdNm+"_", "") == fldBnm.replace(hdNm+"_", "")){
					strFldNm.push(fldAnm);
					tarFldNm.push(fldBnm);
				}
			}
		}
	}

	for(var cnt=0; cnt<srcRecs.length; cnt++){
		var tmpRecs = {};
		for(var i=0;i<dsoBLen;i++){
			tmpRecs[tarFldInfo[i].name] = '';
		}

		for(var i=0; i<strFldNm.length; i++){
			tmpRecs[tarFldNm[i]] = srcRecs[cnt][strFldNm[i]];	
		}

		tarRecs.push(tmpRecs);
	}

	dsoB.recordset.setRecords(tarRecs);
	dsoB.recordset.update();

}
*/

/* 사용 확인 필요
function fGridChkSelAll(dso, fldnm, selYn){

	// 함수 설명
	// var dso    = paramDSO;
	// var fldnm  = "FOOO_CHECK_GB"; checkBox 필드 명
	// var selYn  = true : select, false : unselect

	// 사용 예제
	// dso의 체크박스 값들을 조정한다.
	// fGridChkSelAll(paramDSO, "FOOO_CHECK_GB", true );  // dso의 체크박스 필드를 모두 select
	// fGridChkSelAll(paramDSO, "FOOO_CHECK_GB", false);  // dso의 체크박스 필드를 모두 unselect

	var arry = dso.recordset.getRecords();
	var result = [];
	for(var i=0; i<arry.length; i++){
		if(selYn){
			arry[i][fldnm] = -1;
		}else{
			arry[i][fldnm] = 0;
		}
		result.push(arry[i]);
	}

	dso.recordset.setRecords(result);
	dso.recordset.update();

}
*/

/* 사용 확인 필요
function fGridChkSelCnt(dso, fldnm){

	// 함수 설명
	// var dso    = paramDSO;
	// var fldnm  = "FOOO_CHECK_GB"; checkBox 필드 명

	// 사용 예제
	// dso의 체크박스 select, unselect count를 반환한다.
	// var result = fGridChkSelCnt(paramDSO, "FOOO_CHECK_GB");
	// result[0] : select count(integer)
	// result[1] : unselect count(integer)

	var arry = dso.recordset.getRecords();
	var result = [];

	var selCnt = 0;
	var unselCnt = 0;

	for(var i=0; i<arry.length; i++){
		if(arry[i][fldnm] == 0){
			unselCnt++;
		}else{
			selCnt++;
		}
	}

	result[0] = selCnt;
	result[1] = unselCnt;

	return result;

}
*/

/* 사용 확인 필요
function fSetVatInvoice(obj, dso){

	// 함수 설명
	// var obj    = chkMujp
	// var dso    = paramDSO;

	// 사용 예제
	// 체크박스 obj의 checked를 검사하여 값을 셋팅한다.
	// fSetVatInvoice(this,paramDSO);

	if(obj.checked){
		dso.recordset.fields("FXFIG_MUJP").value = "1";
	}else{
		dso.recordset.fields("FXFIG_MUJP").value = "0";
	}
}
*/

function GBSExcelUpload(file, callback){

	/*
		함수 설명
		엑셀 데이터를 그리드에 셋팅한다.

		업로드할 파일 오브젝트
		var file       = file object;

		업로드 후 실행할 콜백함수
		function callback(data){
			DataGrid.SetGrid(data);
		}

		사용 예제
		GBSFileUpload(file, callback);
	*/

	$wai.util.ExcelUpload(file, callback);
}

function GBSFileUpload(file_path, file){

	/*
		함수 설명
		서버에 파일을 업로드한다.

		업로드할 파일 경로
		var file_path  = ["NHGBS_VNSHR", "temp", "test.txt"];

		업로드할 파일 오브젝트
		var file       = file object;

		사용 예제
		GBSFileUpload(file_path, file);
	*/

	var cmd = "$wai.util.FileUpload(";

	for(var i=0; i<file_path.length; i++){
		cmd = cmd + "'" + file_path[i] + "',";
	}

	cmd = cmd + "file" + ")";

	eval(cmd);
	
}

function GBSFileUploadCallback(file_path, file, upcallback){

	/*
		함수 설명
		서버에 파일을 업로드한다.

		업로드할 파일 경로
		var file_path  = ["NHGBS_VNSHR", "temp", "test.txt"];

		업로드할 파일 오브젝트
		var file       = file object;

		사용 예제
		GBSFileUploadCallback(file_path, file);
	*/

	var cmd = "$wai.util.FileUploadCallback(";

	for(var i=0; i<file_path.length; i++){
		cmd = cmd + "'" + file_path[i] + "',";
	}

	cmd = cmd + "file" + "," + "upcallback" + ")";
		
	eval(cmd);
}

function GBSFileDownload(file_path, file_name){

	/*
		함수 설명
		서버에서 파일을 다운로드한다.

		다운로드할 파일 경로
		var file_path  = ["NHGBS_VNSHR", "temp", "test.txt"];

		저장할 파일명
		var file_name  = "test.txt";

		사용 예제
		GBSFileDownload(file_path, file_name);
	*/

	var cmd = "$wai.util.FileDownload(";

	for(var i=0; i<file_path.length; i++){
		cmd = cmd + "'" + file_path[i] + "',";
	}

	cmd = cmd + "'" + file_name + "')";

	eval(cmd);
}


function fGetCurTabTrCode(){
	/*
		현재 탭의 TRCODE(ex. IQ01) 반환
	*/
	var tab = bizTabCtrl();

	return tab.tabs[tab.curOnTab].data.fn;
}

function GBS_round(amt, digit){
	/*
		실수 특정 자리에서 반올림
	*/

}

function fGetConvertYear(year){
	/*
		년도를 AA ~ YY 로 변경
	*/

	var alp = [];
	var std = "16";

	var convt = "";
	var result = "";

	alp[0]  = "A";
	alp[1]  = "B";
	alp[2]  = "C";
	alp[3]  = "D";
	alp[4]  = "E";
	alp[5]  = "G";
	alp[6]  = "H";
	alp[7]  = "K";
	alp[8]  = "L";
	alp[9]  = "M";
	alp[10] = "N";
	alp[11] = "P";
	alp[12] = "Q";
	alp[13] = "R";
	alp[14] = "S";
	alp[15] = "T";
	alp[16] = "U";
	alp[17] = "V";
	alp[18] = "X";
	alp[19] = "Y";

	var term = Number(year) - 16;
	var str1 = Math.floor(Number(term) / 20);
	var str2 = term - (str1 * 20);

	convt = alp[str1] + alp[str2];	

	result = convt + "/" + year + "T";

	return result;
}

/* 사용 확인 필요
function LogForDSO(dso, rowIdx, fldIdx){

	// 함수 설명
	// var dso    = paramDSO;
	// var rowIdx = "0,1,2"; rowIdx (해당 번호에 해당하는 로우만 출력한다)
	// var fldIdx = "0,1,2"; fldIdx (해당 번호에 해당하는 필드만 출력한다)

	// 사용 예제
	// dso의 필드 정보와 데이터들을 로그에 출력 해준다.
	// LogForDSO(dso);                      // dso의 모든 로우, 필드 데이터 출력
	// LogForDSO(dso, 0, 1);                // dso의 0 로우의 1 필드 데이터 출력
	// LogForDSO(dso, "0,1", "5,6");        // dso의 0,1 로우의 5,6 필드 데이터 출력
	// LogForDSO(dso, "0,1", "");           // dso의 0,1 로우의 모든 필드 데이터 출력
	// LogForDSO(dso, "", "5,6");           // dso의 모든 로우의 5,6 필드 데이터 출력

	var dsoArr    = [];
	var rowIdxArr = [];
	var fldIdxArr = [];

	if(rowIdx != undefined && rowIdx != "")rowIdxArr = rowIdx.toString().split(",");
	if(fldIdx != undefined && fldIdx != "")fldIdxArr = fldIdx.toString().split(",");

	var fldLen = dso.recordset.fieldInfo.length;

	console.log("");
	console.log("*=============================================================================*");
	console.log("*                                   LogForDSO");
	console.log("* DSO ID           : ", dso.id);
	console.log("* Request row idx  : ", rowIdxArr.toString());
	console.log("* Request fld idx  : ", fldIdxArr.toString());
	console.log("* Record count     : ", dso.recordset.recordCount);
	console.log("* Field  count     : ", dso.recordset.fieldInfo.length);
	console.log("DSO", dso);
	console.log("*=============================================================================*");
	console.log("");

	console.log("*================================= Field Info ================================*");
	console.log("SEQ  NAME                                    TYPE                LENGTH        ");
	for(var i=0; i<fldLen; i++){
		dsoArr.push(dso.recordset.fieldInfo[i].name);

		var stab = 5 - i.toString().length; if(stab < 1) stab = 1;
		var atab = 40 - dsoArr[i].length; if(atab < 1) atab = 1;
		var btab = 20 - dso.recordset.fieldInfo[i].type.length; if(btab < 1) btab = 1;

		var finfo = i.toString();

		for(var j=0; j<stab; j++) finfo += " ";		
		finfo += dsoArr[i];		
		for(var j=0; j<atab; j++) finfo += " ";
		finfo += dso.recordset.fieldInfo[i].type;
		for(var j=0; j<btab; j++) finfo += " ";
		finfo += dso.recordset.fieldInfo[i].size;

		console.log(finfo);
	}
	console.log("");
	var rowChk = 0;
	var fldChk = 0;

	var obj = dso.recordset.getRecords();
	for(var i=0; i<obj.length; i++){
		var rowChk = 0;
		for(var j=0;j<rowIdxArr.length; j++){
			if(i == rowIdxArr[j]) rowChk = 1;
		}

		if(rowChk == 0 && rowIdxArr.length != 0) continue;

		console.log("*================================= Row Data [",i,"] ============================*");
		for(var j=0; j<fldLen; j++){
			fldChk = 0;
			for(var k=0; k<fldIdxArr.length; k++){
				if(j == fldIdxArr[k]) fldChk = 1;
			}

			if(fldChk == 0 && fldIdxArr.length != 0) continue;

			var rtab = 40 - dsoArr[j].length; if(rtab < 1) rtab = 1;
			var rdata = dsoArr[j];

			for(var z=0; z<rtab; z++){
				rdata += " ";
			}
			rdata += ": [" + eval("obj[i]." + dsoArr[j]) + "]";
			console.log(rdata);
		}
		console.log("");
	}

}
*/

function LogForManual(){

	/*
		매뉴얼 작성 전용 로그...
	*/

	console.clear();
	GetLblInTxt();
	console.log("");
	GetGridHdTxt();
}

function GetLblInTxt(){

	/*
		매뉴얼 작성 전용 로그(Label)
	*/

	var arr = CpnSearch();

	console.log("*====================================== Label ======================================*");

	for(var i=0; i<arr.length; i++){

		if(arr[i].tagName != "LABEL") continue;

		console.log(arr[i].innerText);
	}

	console.log("*===================================================================================*");

}
function GetGridHdTxt(){

	/*
		매뉴얼 작성 전용 로그(Grid)
	*/

	var arr = CpnSearch();
	var objId;

	console.log("*====================================== Grid =======================================*");

	for(var i=0; i<arr.length; i++){

		objId = "";
		objId = GetCpnInfoNmByCpn(arr[i], "id");

		if(objId == "") continue;

		var obj = eval(objId);
		if(obj.tagName != "grid") continue;

		console.log("-------------------------->",objId);
		for(var j=0; j<obj.options.columns.length; j++){
			console.log(obj.options.columns[j].text);
		}
	}

	console.log("*===================================================================================*");

}

//------------------------------------------------------------------------------------------------------------------
// "Enter" key - "TAB" key Effect script
// copyright(c) 2016.7 corebank co.,ltd.                                       Core Technical Lab. Hyunwoo,Hwang
//------------------------------------------------------------------------------------------------------------------
{
	var tabindex = 1;
	var maxtabidx = 255;
	var noTabElems = [];


	var tabSeqElems = [];

	/* AS-IS
	function getTabSeqElems() {
		var TE;
		var i,j,ti;
		tabSeqElems = [];

		for (i=1;i<=maxtabidx;i++){
			try {
				TE = $("[TabIndex='"+i+"']");
				for (j=0;j<TE.length;j++){
					let bChk = TE[j].compObj ? TE[j].compObj.disabled : TE[j].disabled;
					if (bChk) {
						continue;
					}
					tabSeqElems.push( TE[j] );
				}
			}catch(E){
				console.log('GBS.getTabSeqElems ['+i+'] : '+E.message,E);
			}
		}

		var els = null;
		try {
			els = $(':focusable');
		}catch(E){
			console.log('GBS.getTabSeqElems ":focusable" : '+E.message,E);
		}

		for (i=0;i<els.length;i++){
			ti = $(els[i]).attr('tabindex');
			if ((ti<=0)||(ti===undefined)) {
				if ((ti+'').trim()!=='-1') tabSeqElems.push( els[i] );
			}
		}
		//         console.log('tabSeqElems',tabSeqElems);
	}

	function setNextFocusElem(elem, event) {
		// console.time('setNextFocusElem');
		var i;
		var cIdx = -1;
		getTabSeqElems();

		var sElems = [];
		for (i=0;i<tabSeqElems.length;i++){
			if (!tabSeqElems[i].disabled && !tabSeqElems[i].readOnly) {
				sElems.push(tabSeqElems[i]);
			}
		}

		if (sElems.length > 0) {
			if (elem !== null){
				for (i=0;i<sElems.length;i++){
					if (sElems[i]===elem) {
						cIdx = i;
						break;
					}
				}
				if (cIdx >= 0) {
					cIdx++;
					if (cIdx > (sElems.length-1)) cIdx = 0;
				}
			} else {
				cIdx = 0;
			}
			doFocusElem(elem,sElems[cIdx], event);
		}
		//         console.timeEnd('setNextFocusElem');
	}

	function doFocusElem(cElem,tElem, event){
		if (cElem !== undefined){
			try {
				cElem.setSelectionRange(0,0);
			} catch(E) { }
		}
		//         console.log('cElem',cElem); console.log('tElem',tElem);
		if (tElem !== undefined){
			if (cElem === tElem){
				// console.log('only one obj');
				$(tElem).trigger('blur');
			}
			try {
				$(tElem).focus();
				$(tElem).select();
				
				if ((((tElem.tagName+'').trim().toUpperCase()=='INPUT')&&
					 (['BUTTON', 'IMAGE'].includes((tElem.getAttribute('type')+'').trim().toUpperCase())))
					||((tElem.tagName+'').trim().toUpperCase()=='BUTTON')){
					event.preventDefault();
					return false;
				}
			} catch(E) {
				console.error('[GBS.js] doFocusElem : ',E);
			}
			//console.log('doFocusElem : ',tElem);
		}
	}
	*/

	function getTabSeqElems() {
		var tabSeqElems = $("[tabindex]:focusable").not("[disabled],[readonly],[hidden]").toArray()
		tabSeqElems = tabSeqElems.filter((item) => {
			var ti = $(item).attr("tabindex");

			if(ti === "" || ti === "-1") {
				return false;
			} 
			
			// edit, codecombo, dateedit 등의 wai component 처리
			if(item.compObj) {
				if(item.compObj.readonly || item.compObj.disabled || item.compObj.hidden) {
					return false;
				}
			}

			return true;

		}).sort((a, b) => {
			var indexA = Number(a.tabIndex)
			var indexB = Number(b.tabIndex)
			if(indexA < 0) {
				if(indexB < 0) {
					return indexA - indexB;
				} else {
					return 1;
				}
			}
			return indexA - indexB;
		})
		return tabSeqElems;
	}

	function setNextFocusElem(elem, event) {
		// console.time('setNextFocusElem'); 
		// var cIdx = -1;
		const sElems = getTabSeqElems();
		if (sElems.length > 0) {
			const nCnt = event.shiftKey ? -1 : 1;
			let cIdx = sElems.findIndex(item => item === elem) + nCnt;
			if (event.shiftKey && sElems[cIdx]?.getAttribute('isWai')) {
				cIdx--;
			}
			// if (cIdx == -1 || cIdx == sElems.length) {
			if (cIdx == sElems.length) {
				cIdx = 0;
			} else if (cIdx < 0) {
				cIdx = sElems.length - 1;
			}
			doFocusElem(elem,sElems[cIdx], event);
		}
	}

	function doFocusElem(cElem,tElem, event){
		if (cElem) {
			try {
				cElem.setSelectionRange(0,0);
			} catch(E) { }
		}
		// console.log('cElem',cElem); console.log('tElem',tElem);
		if (tElem !== undefined){
			if (cElem === tElem){
				// console.log('only one obj');
				$(tElem).trigger('blur');
			}
			try {
				$(tElem).focus();
				$(tElem).select();
				
				if ((((tElem.tagName+'').trim().toUpperCase()=='INPUT')&&
					(['BUTTON', 'IMAGE'].includes((tElem.getAttribute('type')+'').trim().toUpperCase())))
					||((tElem.tagName+'').trim().toUpperCase()=='BUTTON')){
					event.preventDefault();
					return false;
				}
			} catch(E) {
				console.error('[GBS.js] doFocusElem : ',E);
			}
			//console.log('doFocusElem : ',tElem);
		}
	}

	$(document).keydown(function(event) {
		var keycode = (event.keyCode ? event.keyCode : event.which);
		//console.log('keydown',keycode);
		if(keycode == '9' || keycode == '13') { //onEnter
			// if (keycode == '9') {
			// 	event.preventDefault();
			// }
			var foEl = event.originalEvent.srcElement; // getFocusedElem();
			var tag  = '';
			if (keycode == '9') {
				if ($(foEl).attr('tabIndex') === undefined) {
					return true;
				} else {
					event.preventDefault();
				}
			}

			if (foEl != null) {
				try {
					tag = (foEl.tagName+'').toUpperCase();
				} catch(E) {
					tag = '';
					console.log('[GBS.js] "Enter" to "Tab" can not get TagName : ',foEl);
				}
			} else {
				setNextFocusElem(null, event);
				event.preventDefault();
				return false;
			}

			if (tag == 'TEXTAREA') {
				if (event.altKey) {
					setNextFocusElem(foEl, event);
				}
			} else if ((tag == 'BODY')||(tag == '')) {
				// setNextFocusElem(null, event);
			} else {
				setNextFocusElem(foEl, event);
			}
		}
	});
} // "Enter" Key to "Tab" Key

//------------------------------------------------------------------------------------------------------------------
// DCLib
//------------------------------------------------------------------------------------------------------------------
{
	var DocumentSCObj;
	var DocumentSCDelaySrc = "";

	function InitDocumentSCObj()
	{
	};
			
	function DocumentSC_Encrypt(pDocumentSrc)
	{
		try
		{
			DocumentSCObj.cSMacEncryptFile(pDocumentSrc, "0000004");
		}
		catch(e)
		{
			alert("error : "+e);
		}
	}

	function DocumentSC_Delay_Encrypt(pDocumentSrc,pDelayTime)
	{
		DocumentSCDelaySrc = pDocumentSrc;
		window.setTimeout("DocumentSC_Proc_Delay_Encrypt()", pDelayTime);
	}

	function DocumentSC_Proc_Delay_Encrypt()
	{
		DocumentSC_Encrypt(DocumentSCDelaySrc);
	}

	function DocumentSC_Decrypt(pDocumentSrc)
	{
		try
		{
			//DocumentSCObj.CSDecryptFile("C:\\ftp\\focus150124.pdf","C:\\ftp\\focus150124.pdf");
			DocumentSCObj.cSDecryptFile(pDocumentSrc,pDocumentSrc);
		}
		catch(e)
		{
			alert("error : "+e);
		}
	}

	function DocumentSC_Check()
	{
		try
		{
			var check = DocumentSCObj.cSCheckDSAgent();
			alert(check);
		}
		catch(e)
		{
			alert("error : "+e);
		}
	}
}

/* ============================================================================================== */
/* Set the linked value which is transferred to other menu                                        */
/* ============================================================================================== */
function SET_LINK_VALUE(pName, pValue) {
    top.MAIN.gLinkName = pName;
    top.MAIN.gLinkValue = pValue;
}

/* ============================================================================================== */
/* Get the linked value which is transferred from other menu                                      */
/* ============================================================================================== */
function GET_LINK_VALUE(pName) {
    var sValue = top.MAIN.gLinkValue;
    if(top.MAIN.gLinkName == pName)
    {
        top.MAIN.gLinkName = "";
        top.MAIN.gLinkValue = "";

        return sValue;
    };
}

/* ==============================================================================================*/
/* pScanCD : 1(Permasukan dan Permindahan)                DP21,DP41,CK31,CK41,DT11,DT13          */
/*           2(Penarikan)                                 DP31                                   */
/*           3(Pengiriman Uang)                           RT11                                   */
/*           4(Transaksi Valuta Asing)                    RT31                                   */
/*           5(ID Card photo)                             CH11                                   */
/*           6(Signature)                                 CH11                                   */
/*           7(Giro & CEK)                                CK31, CK41                             */
/*           8(Welth Transacion)                        FS11, FS13,                              */
/*           A(KARTU IDENTITAS(ID card)-including photo)  CH11                                   */
/*           B(KARTU IDENTITAS - A4(copy of ID card)                                             */
/*           C(Informasi Nasabah)                         CH11                                   */
/*           D(Informasi Nasabah Corporate)                                                      */
/*           E(Pembukaan Rekening)                        DP11                                   */
/*           F(Permintaan Autodebit)                      AT11                                   */
/*           G(Pendaftaran Customer E-Banking)            EC11                                   */
/*           H(Pendaftaran Customer E-Banking Corporate)  EC51                                   */
/*           I(Tablet Branch ID Card Other )              CG30             20160525_jo_seung_jae */
/*           J(Tablet Branch NPWP          )              CG30             20160525_jo_seung_jae */
/*           K(Tablet Branch Debit Card    )              CG30             20160525_jo_seung_jae */
/*           L(Tablet Branch Name Card     )              CG30             20160525_jo_seung_jae */
/*           M(Tablet Branch ETC Card      )              CG30             20160525_jo_seung_jae */
/*           N(Tablet Branch Agent Sign    )              CG30             20160525_jo_seung_jae */
/*           O(Welth Questioner Form       )              FS10             20191015_bayu         */
/*           Z(Free Format)                                                                      */
/* ==============================================================================================*/
function SET_SCAN_OBJ(pObjScan, pScanCD) {
    if ((pScanCD == "1")    // Permasukan dan Permindahan 입금 및 이체
    ||  (pScanCD == "2")    // Penarikan 출금
    ||  (pScanCD == "3")    // Pengiriman Uang
    ||  (pScanCD == "4")    // Transaksi Valuta Asing
    ||  (pScanCD == "A")    // Kartu Identitas
    ||  (pScanCD == "B")    // Kartu Identitas A4
    ||  (pScanCD == "C")    // Informasi Nasabah
    ||  (pScanCD == "D")    // Informasi Nasabah Corporate  /* 20140521_Muhsin */
    ||  (pScanCD == "E")    // Pembukaan Rekening
    ||  (pScanCD == "F")    // Permintaan Autodebet
    ||  (pScanCD == "G")    // Pendaftaran Customer E-Banking
    ||  (pScanCD == "H")    // Pendaftaran Customer E-Banking Corporate
    ||  (pScanCD == "I")    // Tablet ID Card Other /* 20160525_jo_seung_jae (for Tablet) */
    ||  (pScanCD == "J")    // Tablet NPWP          /* 20160525_jo_seung_jae (for Tablet) */
    ||  (pScanCD == "K")    // Tablet Debit Card    /* 20160525_jo_seung_jae (for Tablet) */
    ||  (pScanCD == "L")    // Tablet Name Card     /* 20160525_jo_seung_jae (for Tablet) */
    ||  (pScanCD == "M")    // Tablet ETC Card      /* 20160525_jo_seung_jae (for Tablet) */
    ||  (pScanCD == "N")    // Tablet Agent Sign    /* 20160525_jo_seung_jae (for Tablet) */
    ||  (pScanCD == "Q")    // BO Doc. Scan         /* 20171213_Franky (for Tablet) */
    ||  (pScanCD == "R")    // Tablet EDD Form      /* 20220106_Lionard (for Tablet) */
    ||  (pScanCD == "Z"))   // Free Format
    {
        // pObjScan = LIB().BillScan;
		pObjScan = waiBrowser.modules.scanner;

        return pObjScan;
    }
    else if ((pScanCD == "5")   // Photo - Automatically captured when scanning ID card
          || (pScanCD == "6") ) // Signature - Automatically captured when scanning Customer Information form
    {
        // pObjScan = LIB().BillScan;
		pObjScan = waiBrowser.modules.scanner;

        return pObjScan;
    }
    else
    {
        RaiseError("wrong scan type..");
    }
}

/* ==============================================================================================*/
/* FOR SCAN 20121116 cjh                                                                         */
/* pScanCD : 1  SETORAN DAN TRANSFER                                                             */
/*           2  PENARIKAN                                                                        */
/*           3  PENGIRIMAN UANG                                                                  */
/*           4  TRANSAKSI VALUTA ASING                                                           */
/*           5  FOTO                                                                             */
/*           6  SPECIMEN                                                                         */
/*           7  Giro & CEK                                                                       */
/*           A  KARTU IDENTITAS                                                                  */
/*           B  KARTU IDENTITAS - A4                                                             */
/*           C  INFORMASI NASABAH                                                                */
/*           D  INFORMASI NASABAH CORPORATE                                                      */
/*           E  PEMBUKAAN REKENING                                                               */
/*           F  PERMINTAAN AUTODEBIT                                                             */
/*           G  E-BANKING REGISTRATION                                                           */
/* pRecognize : true(recognize), false(no need to recognize)                                     */
/* ==============================================================================================*/
function PROC_SCAN(pScanCD, pRecognize, callback) {
    // if (topWindow().LIB.WINMAN1.FileExist(sEngineFileNm) == 0) return;

    // sMenuID     = topWindow().MAIN.WVMF.selectedID;
	var sMenuID = topWindow().MAIN.tabCtrl.getCurrentTab().id;
    // var sBright = 0;                                                            /* 0: Auto */

    /* Block wrong scan code */
    if (sMenuID == "DP21"
    ||  sMenuID == "DP41"
    ||  sMenuID == "DT11"
    ||  sMenuID == "DT13")
    {
        if (pScanCD != "1") RaiseError("Wrong scan code..");
    }
    else if (sMenuID == "DP31")
    {
        if (pScanCD != "1" && pScanCD != "2") RaiseError("Wrong scan code..");
    }
    else if (sMenuID == "CH11")
    {
        if (pScanCD != "A" && pScanCD != "C") RaiseError("Wrong scan code..");
    }
    else if (sMenuID == "CH12")                                               /* 20140521_Muhsin */ /*20140613_bayu10*/
    {
        if (pScanCD != "D" && pScanCD != "Z") RaiseError("Wrong scan code..");
    }
    else if (sMenuID == "EC11")
    {
        if (pScanCD != "G"                  ) RaiseError("Wrong scan code..");
    }

    // if (sMenuID == "DP11")                                                      /* 20140422_Ho_3  */
    // {
    //     sBright = 50;
    // }
    // else
    // if (sMenuID == "CH11")                                                      /* 20140422_Ho_3  */
    // {
    //     sBright = 60;
    // }

    var objScan = null;

    objScan = SET_SCAN_OBJ(objScan, pScanCD);

    // objScan.IDCardSave = (pScanCD == "A");

    // objScan.SelectScanner(0);

    //GREEN : 65  RED : 85  AUTO : 0
    // sScanSts = objScan.BillScanRecognize(pRecognize
    //                                    , GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_IP", 0)
    //                                    , GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_PORT", 0)
    //                                    , 0
    //                                    , sBright
    //                                    , pScanCD);

	objScan.ScanType = pScanCD;

	const selRslt = objScan.selectSource();

	console.log('selRslt -> ', selRslt);
	if (!selRslt) {
		RaiseError("scan canceled..");
	}

	const scanSvrIp   = getMainCommData('EtcInfo').scanSvrIp;
	const scanSvrPort = getMainCommData('EtcInfo').scanSvrPort;
	let scanRslt = -1;
	if (pScanCD == 'A') {
		scanRslt = objScan.scanRecognizeIDCard(scanSvrIp, scanSvrPort, fImageReady, fComplete);
	} else if (pScanCD == 'C') {
		scanRslt = objScan.scanRecognize(scanSvrIp, scanSvrPort, 1460, 2010, 1000, 580, fImageReady, fComplete);
	} else {
		scanRslt = objScan.scan(scanSvrIp, scanSvrPort, fImageReady, fComplete);
	}

	function fImageReady(img, code) {
		console.log('scanCallback -> ', pScanCD, '-', code);

		const binaryStr = atob(img.split(",")[1]);
		const uint8Arr = new Uint8Array(binaryStr.length);
		
		for (let i=0; i<binaryStr.length; i++) {
			uint8Arr[i] = binaryStr.charCodeAt(i);
		}
		
		if (pScanCD == 'A' && code == '5') {
			objScan.PhotoData = uint8Arr;
		} else if (pScanCD == 'C' && code == '6') {
			objScan.SpecimenData = uint8Arr;
		} else {
			objScan.ImgData.push(uint8Arr);
		}
	}

	function fComplete(imgCnt) {
		console.log('imgCnt -> ', imgCnt);
		if (imgCnt > 0) {
			sScanSts = 1;
		} else {
			sScanSts = -1;
		}
		if (callback) {
			callback();
		}
	}

	if (scanRslt < 0) {
		sScanSts = -1;
		RaiseError("scan failed..");
	}
}

function PROC_SCAN_TEMP(pScanCD = 'C', pRecognize, callback) {
	var objScan = null;

    objScan = SET_SCAN_OBJ(objScan, pScanCD);

	objScan.scanSvrIp = getMainCommData('EtcInfo').scanSvrIp;
	objScan.scanSvrPort = Number(getMainCommData('EtcInfo').scanSvrPort);

	const testImg = "data:image/jpg;base64,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";
	function imgToArr(img) {
		const binaryStr = atob(img.split(",")[1]);
		const uint8Arr = new Uint8Array(binaryStr.length);

		for (let i=0; i<binaryStr.length; i++) {
			uint8Arr[i] = binaryStr.charCodeAt(i);
		}

		return uint8Arr;
	}

	objScan.ImgData.push(imgToArr(testImg));
	sScanSts = 1; // 임시 성공 처리

	if (callback) {
		callback();
	}
}

// TO-BE: OCR function not available
function GET_SCAN_VALUE(pScanCD, pName, pOption) {
    var strVal  = "";
    var objScan = null;

    objScan = SET_SCAN_OBJ(objScan,pScanCD);

	// OCR 기능 제외
	/*
	for( var i=1; i<=objScan.GetRecogItemCount(); i++)
    {
        if(objScan.GetRecogItemName(i) == pName)
        {
            strVal = objScan.GetRecogItemValue(i);
            break;
        };
    };
	*/

    //결과값특수처리
    if(pOption == "001") //1 -> IDR 2-> USD
    {
        if(strVal == "1")
        {
            strVal = "IDR";
        }
        else if(strVal == "2")
        {
            strVal = "USD";
        }
        else
        {
            strVal = "";
        }
    }

  	// 금액 마지막 2자리 소수점처리
    else if(pOption == "002")
    {
        if((strVal != null) && (strVal != "") && (strVal.length > 2))
        {
            // strVal = strVal.substr(0,strVal.length-2) + "." + strVal.substr(strVal.length-2,2);
			strVal = strVal.substring(0,strVal.length-2) + "." + strVal.substring(strVal.length-2);
        }
        else
        {
            strVal = 0.00;
        }
    }

    return strVal;
}

function SHOW_SCAN_CODE(pScanCD, callback) {
    // if (topWindow().LIB.WINMAN1.FileExist(sEngineFileNm) == 0) return;

    var windowStatus = "help:no;status:no;resizable:no;scroll:yes;center:yes;dialogHeight:148px;dialogWidth:400px;";

    var par    = new Array(1);
    var lnkSrc = '/frame/scanChoice.html';
    par[0]     = pScanCD;
    // par[1]     = topWindow().MAIN.WVMF.selectedID;
	par[1]     = topWindow().MAIN.tabCtrl.getCurrentTab().id;

    var DARG   = new DArgument();
    DARG.Args  = par;

    // return window.showModalDialog(lnkSrc,DARG,windowStatus);
	openPopup(lnkSrc, DARG, windowStatus, callback);
}

function SAVE_SCAN_DOC_ID(callback) {
    if (sScanSts != 1) {
		if (callback) {
			callback();
		}
		return;
	}

	const EtcInfo = getBizCommData('EtcInfo');

    if (LIB().BillScan.ScanType == 0) {
        // SET_COMM_DATA("FXFIG_SCR","FXFIG_SCAN_DOC_ID1","");
        // SET_COMM_DATA("FXFIG_SCR","FXFIG_SCAN_CODE1","");
		EtcInfo.scanDocId1 = '';
		EtcInfo.scanCode1 = '';
		scanCb();
    } else {
		if(LIB().BillScan.DocID == "") {
			LIB().BillScan.GetDocID(function(docId) {
				if (docId == '') {
					RaiseError("image save fail..");
				}

				// SET_COMM_DATA("FXFIG_SCR","FXFIG_SCAN_DOC_ID1",LIB().BillScan.DocID);
				// SET_COMM_DATA("FXFIG_SCR","FXFIG_SCAN_CODE1",LIB().BillScan.ScanType);
				EtcInfo.scanDocId1 = LIB().BillScan.DocID;
				EtcInfo.scanCode1 = LIB().BillScan.ScanType;

				scanCb();
			});
        } else {
			EtcInfo.scanDocId1 = LIB().BillScan.DocID;
			EtcInfo.scanCode1 = LIB().BillScan.ScanType;

			scanCb();
		}
    }

	function scanCb() {
		EtcInfo.scanDocId2 = '';
		EtcInfo.scanCode2 = '';

		setBizCommData('EtcInfo', EtcInfo);

		if (callback) {
			callback();
		}
	}
}

function INIT_SCAN() {
    // if (topWindow().LIB.WINMAN1.FileExist(sEngineFileNm) == 0) return;

    sScanSts = -1; // -1: didn't scan

    const EtcInfo = getBizCommData('EtcInfo');
	EtcInfo.scanDocId1 = '';
	EtcInfo.scanCode1 = '';
	EtcInfo.scanDocId2 = '';
	EtcInfo.scanCode2 = '';
	EtcInfo.scanDocId3 = '';
	EtcInfo.scanCode3 = '';
	EtcInfo.scanDocId4 = '';
	EtcInfo.scanCode4 = '';
	setBizCommData('EtcInfo', EtcInfo);

	LIB().BillScan.InitScanInfo();
}

function CALL_IMG_VIEW_DOC_ID(pDoc_ID) {
	var windowStatus="help:no;status:no;resizable:yes;scroll:yes;center:yes;dialogHeight:700px;dialogWidth:1000px;";

	var par    = new Array(4);
	// lnkSrc = LIB().GetTransURL('report/ScanView.html');
	lnkSrc = '/frame/scanView.html';
	//scan_svr_ip
	// par[0]     = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_IP", 0);
	par[0]     = getMainCommData('EtcInfo').scanSvrIp;
	//scan_svr_port
	// par[1]     = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_PORT", 0);
	par[1]     = getMainCommData('EtcInfo').scanSvrPort;
	//valid_msg
	par[2]     = "";
	//scan_doc_id
	par[3]     = pDoc_ID;

	var DARG   = new DArgument();
	DARG.Args  = par;

	openPopup(lnkSrc, DARG, windowStatus);
}

function CALL_IMG_VIEW_REF_NO(pRefNo, pHisNo, pOption) {
    var windowStatus="";

    var par    = new Array(5);
    var lnkSrc = "";

    //select doc_id
    LIB().GetDocID(pRefNo, pHisNo, function(aScanDocId) {
		if(aScanDocId == null) return;
		if(aScanDocId.length == 0) return;

		//scan_svr_ip
		// par[0]     = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_IP", 0);
		par[0]     = getMainCommData('EtcInfo').scanSvrIp;
		//scan_svr_port
		// par[1]     = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_PORT", 0);
		par[1]     = getMainCommData('EtcInfo').scanSvrPort;

		LIB().GetValidInfo(pRefNo, pHisNo, function(str) {
			//valid_msg
			par[2]     = LIB().ValidToStr(str);

			//001: Multi sacn - Not use
			if(pOption == "001")
			{
				// windowStatus = "help:no;status:no;resizable:yes;scroll:yes;center:yes;dialogHeight:200px;dialogWidth:600px;";
				// lnkSrc = LIB().GetTransURL('report/ScanViewMulti.html');
				// //scan_doc_id
				// par[3] = aScanDocId[0];
				// //scan_doc_id2
				// par[4] = aScanDocId[1];
			}
			else
			{
				windowStatus = "status:no;resizable:yes;scroll:yes;center:yes;dialogHeight:700px;dialogWidth:1000px;";
				// lnkSrc = LIB().GetTransURL('report/ScanView.html');
				lnkSrc = '/frame/scanView.html';
				//scan_doc_id
				par[3] = aScanDocId[0];
			}

			var DARG   = new DArgument();
			DARG.Args  = par;

			openPopup(lnkSrc, DARG, windowStatus);
		});
	});
}

function CALL_IMG_VIEW_REF_NO2(pRefNo, pHisNo, pScanCd) {
    var windowStatus="";

    var par    = new Array(5);
    var lnkSrc = "";

    //select doc_id
    LIB().GetDocID2(pRefNo, pHisNo, pScanCd, function(aScanDocId) {
		if(aScanDocId == null) return;
		if(aScanDocId.length == 0) return;

		//scan_svr_ip
		// par[0]     = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_IP", 0);
		par[0]     = getMainCommData('EtcInfo').scanSvrIp;
		//scan_svr_port
		// par[1]     = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_PORT", 0);
		par[1]     = getMainCommData('EtcInfo').scanSvrPort;

		LIB().GetValidInfo(pRefNo, pHisNo, function(str) {
			//valid_msg
			par[2]     = LIB().ValidToStr(str);

			windowStatus = "status:no;resizable:yes;scroll:yes;center:yes;dialogHeight:700px;dialogWidth:1000px;";
			// lnkSrc = LIB().GetTransURL('report/ScanView.html');
			lnkSrc = '/frame/scanView.html';
			//scan_doc_id
			par[3] = aScanDocId[0];

			var DARG   = new DArgument();
			DARG.Args  = par;

			openPopup(lnkSrc, DARG, windowStatus);
		});
	});
}

function FIF_SET_CREDIT_RATING(pCode, pObj, callback) {
    var strType = "FITCH_IDN_RATING";

    if(pCode == "10") //Moody's
    {
        strType = "MOODYS_IDN_RATING";
    }
    else if(pCode == "11") //Standard and Poor's
    {
        strType = "STANDARD_POOR_RATING";
    }
    else if(pCode == "12") //Fitch Rating
    {
        strType = "FITCH_RATING";
    }
    else if(pCode == "13") //Pefindo
    {
        strType = "PEFINDO_RATING";
    }
    else if(pCode == "14") //Moody's Indonesia
    {
        strType = "MOODYS_IDN_RATING";
    }
    else if(pCode == "15") //Fitch Indonesia
    {
        strType = "FITCH_IDN_RATING";
    }
    else if(pCode == "MIS") //Moody's Investor Service
    {
        strType = "MIS_RATING";
    }
    else if(pCode == "SNP") //Standart and Poor's
    {
        strType = "SNP_RATING";
    }
    else if(pCode == "FIN") //Fitch Rating International
    {
        strType = "FIN_RATING";
    }
    else if(pCode == "PEF") //Pefindo
    {
        strType = "PEF_RATING";
    }
    else if(pCode == "FID") //Fitch Indonesia
    {
        strType = "FID_RATING";
    }
    else
    {
        // while(pObj.ItemCount > 0)
        // {
        //     pObj.DeleteItem(0);
        // }
		pObj.clear();
        return;
    }

    // pDsoSql.SQL = "SELECT TYPE,CODE,CODE_NM FROM ACOM_COMH_CODE WHERE TYPE='"+strType+"' ORDER BY SORT_SEQ;";
    // G_SetCBWithDSO(pObj, pDsoSql, "TYPE", strType,"CODE", "CODE_NM", false );

	const inputData = {
		dvCd: '66',
		param1: strType
	};

	comCallService('/HANABANK/V1/COM/CM/COMCMOMAINI.SVC', inputData, output => {
		const rtnArr = output.output66?.grid01 ?? [];
		G_SetCBWithData(pObj, rtnArr, "type", strType, "code", "codeNm");
		if (callback) {
			callback();
		}
	});
}

// TO-BE: OCR function not available
function GETIDCARDVALUE(pType, pScanCD) {
    var objScan = null;
    var rtn = "";

    objScan = SET_SCAN_OBJ(objScan,pScanCD);

	// OCR 기능 제외
    // rtn = objScan.GetIDCardValue(pType);

    return rtn;
}

// TO-BE: OCR function not available
function GETRECOGITEMVALUE(pType, pScanCD) {
    var objScan = null;
    var rtn = "";

    objScan = SET_SCAN_OBJ(objScan,pScanCD);

	// OCR 기능 제외
    // rtn = objScan.GetRecogItemValue(pType);
    
	return rtn;
}

// TO-BE: OCR function not available
function GETIDCARDCLASS(pScanCD) {
    var objScan = null;
    var rtn = "";

    objScan = SET_SCAN_OBJ(objScan,pScanCD);

	// OCR 기능 제외
    // rtn = objScan.GetIDCardClass();

    return rtn;
}

function UPLOADIMAGE(pFileName, pScanCD, callback) {
	let objScan = null;
	let rtnDocId = '';
    // var scan_svr_ip   = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_IP", 0);
    // var scan_svr_port = GET_COMM_DATA("FXFIG_COM", "FSYSINFO_SCAN_SVR_PORT", 0);
	let scan_svr_ip   = getMainCommData('EtcInfo').scanSvrIp;
	let scan_svr_port = getMainCommData('EtcInfo').scanSvrPort;

    objScan = SET_SCAN_OBJ(objScan,pScanCD);

	const fileByte = waiBrowser.modules.file.readByte(pFileName);
	if (fileByte < 0) {
		callback(rtnDocId);
	} else {
		objScan.getEdm([fileByte], function(edmFile) {
			console.log('edmFile -> ', edmFile);
			waiBrowser.modules.edm_sock.GetDocId(scan_svr_ip, Number(scan_svr_port), function(docId) {
				console.log('docId ---> ', docId);
				if (!docId || docId < 0) {
					callback(rtnDocId);
					return;
				}
		
				console.log('UpLoadImageByte -> ', scan_svr_ip, Number(scan_svr_port), docId, edmFile);
				waiBrowser.modules.edm_sock.UpLoadImageByte(scan_svr_ip, Number(scan_svr_port), `${docId}.edm`, new Uint8Array(edmFile), function(rtn) {
					console.log('uploadImage rtn -> ', rtn);
					if (rtn < 0) {
						rtnDocId = '';
					} else {
						rtnDocId = docId;
					}
					if (callback) {
						callback(rtnDocId);
					}
				});
			});
		});
	}
}

function INITBILLSCANRECOGNIZE(pScanCD) {
    var objScan = null;

    objScan = SET_SCAN_OBJ(objScan,pScanCD);

	// objScan.InitBillScanRecognize -> objScan.InitScanInfo
    objScan.InitScanInfo();
}

function GETDOCID(pRefNo, pHisNo, pScanCD, callback) {
    var objScan = null;

    objScan = SET_SCAN_OBJ(objScan,pScanCD);
    LIB().GetDocID(pRefNo, pHisNo, function(rtn) {
		if (callback) {
			callback(rtn);
		}
	});
}

function PHOTOSAVE(pScanCD) {
    var objScan = null;
    var rtn = "";

    objScan = SET_SCAN_OBJ(objScan, pScanCD);

	if (objScan.PhotoData) {
		// const type = objScan.ImgData.split(",")[0];
		const savePath = `/SCAN_IMG/SCAN_IMG_${new Date().getTime()}.jpg`;

		const writeRtn = waiBrowser.modules.file.writeByte(savePath, objScan.PhotoData, true);
		if (!writeRtn) {
			console.log(waiBrowser.modules.file.lastError());
		} else {
			rtn = savePath;
		}
	}

    return rtn;
}

/* 20130410_Agus_1 */
function SHOW_SPECIMEN(strCifNo, strRefNo)
{
    if(trim(strCifNo).length == 0 && trim(strRefNo).length == 0)
    {
        ShowInfoDialog("Customer CIF or Account Number is necessary!");
        return;
    }
    var DArg  = new DArgument();         //Argument 사용
    DArg.Args = new Array(3);            //Argument에 배열 저장

    DArg.Args[0]  = strCifNo;
    DArg.Args[1]  = strRefNo;
    DArg.Args[2]  = 'SPECIMEN';

    strWinSts = "status:no; resizable:no; scroll:no; center:yes; dialogHeight:610px; dialogWidth:915px;";
    openPopup(LIB().GetTransURL('iq/IQ11.html'), DArg, strWinSts);
}

/* 20130515_Cho_1 */
function SET_CBB_SCAN_CD(objScanCB, pMenuID)
{
    /*******************************
   1    SETORAN DAN TRANSFER
   2    PENARIKAN
   3    PENGIRIMAN UANG
   4    TRANSAKSI VALUTA ASING
   5    FOTO
   6    SPECIMEN
   7    Giro & CEK
   8    Welth TRANSACTION
   A    KARTU IDENTITAS
   B    KARTU IDENTITAS - A4
   C    INFORMASI NASABAH
   D    TANDA TANGAN
   E    PEMBUKAAN REKENING
   F    PERMINTAAN AUTODEBIT
   G    E-BANKING REGISTRATION
   I    RISK PROFILE COSTUMER  //Fatta 20190430 Adding Risk Profile Code
   J    SUBSCRIPTION MUTUAL FUND //Fatta 20190430 Adding Mutual Fund Transaction
   K    ADDITIONAL MUTUAL FUND  //Fatta 20190430 Adding Addtional Mutual Fund Transaction
   L    BOND TRANSACTION  //Fatta 20190430 Adding Bond Transaction
   M    BOND ADDITIONAL TRANSACTION  //Fatta 20190430 Adding Addtional bond Transaction
   N    BANCAASSURANCE //Fatta 20190430 Adding Banca Assurance Transaction
   O    Questioner Profile Welth
   P    POA DOCUMENT
   U    POI DOCUMENT
     *******************************/

  // LIB().InitCB(objScanCB,"F994");

  objScanCB.clear();

  if (pMenuID == "DP21"
  ||  pMenuID == "DP41"
  ||  pMenuID == "DT11"
  ||  pMenuID == "DT13")
  {
      objScanCB.addItem("1","SETORAN DAN TRANSFER");
  }
  else if (pMenuID == "DP31")
  {
      objScanCB.addItem("1","SETORAN DAN TRANSFER");
      objScanCB.addItem("2","PENARIKAN");
  }
  else if (pMenuID == "CH11")
  {
    objScanCB.addItem("A","KARTU IDENTITAS");
    objScanCB.addItem("C","INFORMASI NASABAH");
    // if(GET_COMM_DATA("FXFIG_SCR", "FXFIG_IBCD", 0)== "CG15")                    /* 20161201_Rizky */
	if(getBizCommData('SysInfo').scrnId == "CG15")                    /* 20161201_Rizky */
    {
        objScanCB.addItem("Z","OTHER");
    }

  }
  else if (pMenuID == "CH12")                                                       /* 20140521_Muhsin */ /*20140613_bayu9*/
  {
      objScanCB.addItem("Z","SPESIMEN");
      objScanCB.addItem("D","INFORMASI NASABAH CORPORATE");
  }
  else if (pMenuID == "EC11"
  ||       pMenuID == "EB11")               /* 20170606_Rizky */
  {
    objScanCB.addItem("G","E-BANKING REGISTRATION");
  }
  else if (pMenuID == "DP11")
  {
    objScanCB.addItem("E","PEMBUKAAN REKENING");
  }
  else if (pMenuID == "AT11")
  {
    objScanCB.addItem("F","PERMINTAAN AUTODEBI");
  }
  else if (pMenuID == "RT11")
  {
    objScanCB.addItem("3","PENGIRIMAN UANG");
  }
  else if (pMenuID == "RT31")
  {
    objScanCB.addItem("4","TRANSAKSI VALUTA ASING");
  }
  else if (pMenuID == "CK31"
       ||  pMenuID == "CK41")
  {
      objScanCB.addItem("1","SETORAN DAN TRANSFER");
      objScanCB.addItem("7","Giro & CEK");
  }
  else if (pMenuID == "EC51") /* 20130903_Daniel_2 */
  {
    objScanCB.addItem("H","CORPORATE E-BANKING REGISTRATION");
  }
  else if (pMenuID == "OT11"                    /* 20170606_Rizky */
  ||       pMenuID == "EP13"
  ||       pMenuID == "CK11")
  {
    objScanCB.addItem("Z","OTHER");
  }
  else if (pMenuID == "FS11"
  ||       pMenuID == "FS13"
  ||       pMenuID == "FS14"
  ||       pMenuID == "FS15"
  ||       pMenuID == "BD11"
  ||       pMenuID == "BD13"
  ||       pMenuID == "BD14")
  {
      objScanCB.addItem("8","Welth TRANSACTION");
  }
  else if (pMenuID == "FS10" 
  ||       pMenuID == "BC11" )
  {
      objScanCB.addItem("O","Questioner Profile & Banca Register");
  }
  else if (pMenuID == "CH31")
  {
      objScanCB.addItem("P","POA DOCUMENT");       /* ulfah  */
  }
  else if (pMenuID == "CH32")
  {
      objScanCB.addItem("U","POI DOCUMENT");       /* ulfah  */
  }
  else if (pMenuID == "CH76")
  {
      objScanCB.addItem("I","PEP DOCUMENT");       /* 20230329_CEDRIC  */
  }
  else if (pMenuID == "CX08")
  {
      objScanCB.addItem("S","SDB Attorney Form");    /* 20230918_Jefta */
  }
  else if (pMenuID == "CX11")
  {
      /*objScanCB.addItem("S","SDB Attorney Form");*/    /* 20230918_Jefta */
      objScanCB.addItem("T","SDB Opening Form");     /* 20230918_Jefta */
  }
  /*  else if (pMenuID == "FS43")
    {
      objScanCB.addItem("P","Product Guide");
    }*/
  else
  {
       alert("Wrong code");
  }
}

/* 20130611_Cho_1 */
function CALL_SPECIMENT_SCREEN(pScanList, pKeyType, pKeyValue) {
   /////////////////////////////////////////////////////////////////
   //Parameter
   /////////////////////////////////////////////////////////////////
   //1) pScanList (F994) ex) "6;5" ==> Signature + ID Card photo
   //   5 ID Card photo
   //   6 Signature
   //   A KARTU IDENTITAS(ID card) - including photo
   //   C Informasi Nasabah(고객신규)
   //
   //2) pKeyType
   //   ACCT_NO : Account Number
   //   CIX_NO  : Cix Number
   //
   //3) pKeyValue
   //   if( pKeyType == "ACCT_NO") then Account Number
   //   if( pKeyType == "CIX_NO") then Cix Number
   /////////////////////////////////////////////////////////////////
   var windowStatus="help:no;status:no;resizable:yes;scroll:yes;center:yes;dialogHeight:565px;dialogWidth:850px;";

   var par    = new Array(4);
   var lnkSrc = LIB().GetTransURL('iq/IQ1101.html');

   //Scan List
   par[0] = pScanList;
   //Key Type
   par[1] = pKeyType;
   //Key Value
   par[2] = pKeyValue;

   var DARG   = new DArgument();
   DARG.Args  = par;

   openPopup(lnkSrc, DARG, windowStatus);
}

function ClearCJUM() {
	const BDO = ActiveWindow().BDO;
	
	BDO.SysInfo.trscBrNo = org_cjum;
	BDO.SysInfo.acBrNo   = org_ajum;
	BDO.SysInfo.refNo    = '';
}

function SetJUM(brno, ref) {
	const SysInfo = getBizCommData('SysInfo');

	org_ajum = SysInfo.acBrNo;
	org_cjum = SysInfo.trscBrNo;

	const BDO = ActiveWindow().BDO;

	BDO.SysInfo.trscBrNo = brno;
	BDO.SysInfo.acBrNo   = brno;
	BDO.SysInfo.refNo    = ref;
}

var G_PROG_OBJ = {
	callCnt: 0,
	progDiv: null,
	loaderDiv: null
};

function ShowProgress() {
	const progObj = window.dialogArguments ? G_PROG_OBJ : LIB().G_PROG_OBJ;
	const doc = window.dialogArguments ? document : topWindow().MAIN.document;
	
	if (progObj.callCnt > 0 && !Array.from(doc.body.children).find(elem => elem.classList.contains('gProgressDiv'))) {
		progObj.callCnt = 0;
		progObj.progDiv = null;
		progObj.progDiv = null;
	}

	if (progObj.callCnt == 0) {
		let progDiv = doc.createElement('div');
		progDiv.classList.add('gProgressDiv');
		let loaderDiv = doc.createElement('div');
		loaderDiv.classList.add('gLoaderDiv');
		doc.body.appendChild(progDiv);
		doc.body.appendChild(loaderDiv);
		progObj.progDiv = progDiv;
		progObj.loaderDiv = loaderDiv;
	}
	progObj.callCnt++;
}

function HideProgress() {
	const progObj = window.dialogArguments ? G_PROG_OBJ : LIB().G_PROG_OBJ;

	if (progObj.callCnt > 0) {
		progObj.callCnt--;
	}
	if (progObj.callCnt == 0) {
		const doc = window.dialogArguments ? document : topWindow().MAIN.document;
		if (progObj.progDiv) {
			doc.body?.removeChild(progObj.progDiv);
			progObj.progDiv = null;
		}
		if (progObj.loaderDiv) {
			doc.body?.removeChild(progObj.loaderDiv);
			progObj.loaderDiv = null;
		}
	}
}

var G_BIZ_PROG_OBJ = {
	progDiv: null,
	loaderDiv: null
};

function showBizProgress() {
	const progObj = window.dialogArguments ? G_BIZ_PROG_OBJ : parent?.WorkFrame?.contentWindow?.G_BIZ_PROG_OBJ;

	if (progObj && !progObj.progDiv && !progObj.loaderDiv) {
		const doc = window.dialogArguments ? document : parent?.WorkFrame?.contentWindow?.document;
		if (doc) {
			let progDiv = doc.createElement('div');
			progDiv.classList.add('gProgressDiv');
			let loaderDiv = doc.createElement('div');
			loaderDiv.classList.add('gLoaderDiv');
			doc.body.appendChild(progDiv);
			doc.body.appendChild(loaderDiv);
			progObj.progDiv = progDiv;
			progObj.loaderDiv = loaderDiv;
		}
	}
}

function hideBizProgress() {
	const progObj = window.dialogArguments ? G_BIZ_PROG_OBJ : parent?.WorkFrame?.contentWindow?.G_BIZ_PROG_OBJ;

	if (progObj && progObj.progDiv && progObj.loaderDiv) {
		const doc = window.dialogArguments ? document : parent?.WorkFrame?.contentWindow?.document;
		if (doc) {
			if (progObj.progDiv) {
				doc.body.removeChild(progObj.progDiv);
				progObj.progDiv = null;
			}
			if (progObj.loaderDiv) {
				doc.body.removeChild(progObj.loaderDiv);
				progObj.loaderDiv = null;
			}
		}
	}
}

function showDivProgress(divId) {
	const doc = window.dialogArguments ? document : parent?.WorkFrame?.contentWindow?.document;
	if (doc) {
		const divElem = doc.getElementById(divId);
		if (divElem) {
			if (!divElem.classList.contains('gProgressDiv')) {
				divElem.classList.add('gProgressDiv');
				let loaderDiv = doc.createElement('div');
				loaderDiv.classList.add('gLoaderDiv');
				loaderDiv.style.position = 'absolute';
				divElem.appendChild(loaderDiv);
			}
		}
	}
}

function hideDivProgress(divId) {
	const doc = window.dialogArguments ? document : parent?.WorkFrame?.contentWindow?.document;
	if (doc) {
		const divElem = doc.getElementById(divId);
		if (divElem) {
			if (divElem.classList.contains('gProgressDiv')) {
				let progDiv = divElem.querySelector('.gLoaderDiv');
				if (progDiv) {
					divElem.removeChild(progDiv);
				}
				divElem.classList.remove('gProgressDiv');
			}
		}
	}
}

function getFileByPath(fileFullPath, fileName = 'default.xlsx') {
	const _byte = waiBrowser.modules.file.readByte(fileFullPath);
	const _blob = new Blob([_byte], { type: 'application/octet-stream' });
	const _file = new File([_blob], fileName, { type: 'application/octet-stream' });
	return _file;
}

/**
 * Error generation in ActExecute Action
 * @param {string} [type] - Popup type (info/error)
 * @param {string} [msg] - Error message
 * @param {string} [desc] - Description
 */
function executeError(type = 'info', msg = '', desc = '') {
	let errCd = 99999;
	if (type == 'info') {
		errCd = 80014;
	} else if (type == 'error') {
		errCd = 80015;
	}
	var   FE = new GBSError(errCd, msg, desc);
	throw FE;
}

var G_EXECUTE_MESSAGE = '';

/**
 * Set custom message for execute success
 * @param {string} [msg] - Custom message for execute success
 */
function setExecuteMsg(msg = '') {
	G_EXECUTE_MESSAGE = msg;
}

/**
 * Get custom message for execute success
 */
function getExecuteMsg() {
	return G_EXECUTE_MESSAGE;
}

var LoadTimeConsole = true;

function showLoadTime(msg, isEnd) {
	if (LoadTimeConsole) {
		if (isEnd) {
			console.timeEnd(msg);
		} else {
			console.time(msg);
		}
	}
}

function CHECK_CALL_SEVICE() {
	const progObj = window.dialogArguments ? G_PROG_OBJ : LIB().G_PROG_OBJ;
	return progObj.callCnt > 0 ? true : false;
}

function STR_TO_ARR(text = '', size = 1, bWordWrap = true, keyName, nAddSize, nMinArrSize = 1) {
	if (size < 1) {
		// return keyName ? [{[keyName]: text}] : [text];
		return new Array(nMinArrSize).fill(keyName ? {[keyName]: text} : text);
	}

	let rtnData = text.replaceAll('\r\n', '\n').split('\n').flatMap(elem => {
		const rtnArr = chunk(elem, size, bWordWrap);
		// if (rtnArr.length > 0) {
		// 	return keyName ? rtnArr.map(_elem => { return {[keyName]: _elem} }) : rtnArr;
		// } else {
		// 	return keyName ? [{[keyName]: ''}] : [''];
		// }
		return rtnArr.length > 0 ? rtnArr : [''];
	});

	const rtnDataCnt = rtnData.length;
	rtnData = rtnDataCnt < nMinArrSize ? rtnData.concat(new Array(nMinArrSize-rtnDataCnt).fill('')) : rtnData
	return keyName ? rtnData.map(_elem => { return {[keyName]: _elem} }) : rtnData;

	function chunk(data, size, bWordWrap) {
		const arr = [];
		
		for (let i = 0; i < data.length; i += size) {
			let _text = data.slice(i, i + size);

			const addSize = nAddSize ?? Math.floor(Array.from(_text).filter(txt => /[a-z]/.test(txt)).length * 2/3);
			// console.log('addSize --> ', addSize);
			_text = data.slice(i, i + size + addSize);
			
			// console.log(i, ' / ', data.length, ' / ', _text.length, ' / ', size + addSize, ' / ', _text);
			if (bWordWrap && _text.length == (size + addSize) && !(data.length == (size + addSize))) {
				const spaceIdx = _text.lastIndexOf(' ');
				if (spaceIdx > 0) {
					// console.log('i --> ', i);
					// console.log('size + addSize --> ', size + addSize);
					// console.log('spaceIdx --> ', spaceIdx);
					_text = data.slice(i, i + spaceIdx);
					i = i - (size + addSize - spaceIdx - 1);
				}
			}

			i = i + addSize;

			arr.push(_text);
		}
		
		return arr;
	}
}

/**
 *  waiDoc Image Viewer
 */
function imgViewerLoadImage(imgViewer, scan_svr_ip, scan_svr_port, doc_id, callback) {
	if (!imgViewer) {
		return;
	}

	imgViewer.showloading(true);
    waiBrowser.modules.edm_sock.DownLoadImageByte(scan_svr_ip, Number(scan_svr_port), `${doc_id}.edm`, function(arrayBuffer){
		imgViewer.showloading(false);
		if (arrayBuffer) {
			imgViewer.addImage(arrayBuffer);
		} else {
			console.error(`Failed to load image [DOC_ID : ${doc_id}]`);
		}
		if (callback) {
			callback();
		}
	});
}

function imgViewerLoadLocalImage(imgViewer, imgUrl) {
	if (!imgViewer) {
		return;
	}

	const _byte = waiBrowser.modules.file.readByte(imgUrl);
	if (_byte == -1) {
		ShowInfoDialog(`File not found. [${imgUrl}]`);
		return;
	 }
	const _blob = new Blob([_byte], { type: 'application/octet-stream' });
	var reader = new FileReader();
	reader.onloadend = function() {
		imgViewer.addImage(reader.result);
	}
	reader.readAsDataURL(_blob);
}

function imgViewerLoadFromUrl(imgViewer, imgUrl) {
	if (!imgViewer) {
		return;
	}
	
	toDataUrl(imgUrl, base64data => {
		imgViewer.addImage(base64data);
	});
	
	function toDataUrl(url, callback) {
		var xhr = new XMLHttpRequest();
		xhr.onload = function() {
			var reader = new FileReader();
			reader.onloadend = function() {
				callback(reader.result);
			}
			reader.readAsDataURL(xhr.response);
		};
		xhr.open('GET', url);
		xhr.responseType = 'blob';
		xhr.send();
	}
}

function imgViewerDownImage(imgViewer, scan_svr_ip, scan_svr_port, specimen_doc_id, s_can_cix_no, s_type) {

}

function loadImageURL(edmFilePath, viewerObj, callback) {
	var ajaxOpt = {
		url          : edmFilePath,
		type         : 'POST',
		dataType     : 'binary',
		processData  : false,
		responseType : 'arraybuffer',
		success: function(result){
			console.log(result); // arraybuffer data
			viewerObj.load(result);
			if (callback) callback();
		},
		error:function(a,b,c){
			console.error('error\n',a,b,c);
		}
	};
	$.ajax(ajaxOpt);
}

function loadImageData(imgData, viewerObj, callback) {
	if (Array.isArray(imgData)) {
		viewerObj.load(imgData);
		if (callback) callback();
	} else {
		let sMsg = '[Image Viewer] Image data type is Array.';
		ShowInfoDialog(sMsg, function() {});
	}
}

async function onbeforeunload() {
	try {
		topWindow().MAIN.document.body.onbeforeunload = null;
		topWindow().MAIN.fLogOut();
	} catch {
	}
}