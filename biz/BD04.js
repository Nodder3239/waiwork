/**------------------------------------------------------------------------------------------------------------------
 * ※ Notes for biz developer (need to be removed after confirmation) / 업무개발자 참고사항 (확인 후 제거 필요)
 * 1. 
 *------------------------------------------------------------------------------------------------------------------*/

/**
 * A function that is called after all required functionality on the page is loaded
 * 페이지에서 필요한 모든 기능이 로드된 후 호출되는 함수
 * @param {boolean} isPopup - Whether it opened as a pop-up screen
 */
function onLoadPage(isPopup) {

    /*
     * Handling when opened as a pop-up screen
     * 팝업 화면으로 열린 경우 처리
     */
    if (isPopup) {

    }
}

/**
 * Tap change event
 * @param {object} event 
 */
function tabOnChange(event) {
	var index = event.args["index"];
	var tabTitle = event.args["tabTitle"];
	switch (index) {
        case 0:

            break;
        case 1:
            
            break;
    }
}