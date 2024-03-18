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
 * Handling common button events connected to the actionManager of the work screen opened by SubEntry
 * SubEntry로 열리는 업무화면의 actionManager에 연결된 공통 버튼 이벤트 처리
 * @param {string} actName - Common button connection name (ActEntry, ActCancel, ActExecute, etc.) of the work common screen (SubEntry)
 */
function executeAction(actName) {
    switch(actName) {
        case 'ActEntry' : // Entry
            break;
        case 'ActCancel' : // Cancel
            break;
        case 'ActSimulation' : // Simulation
            break;
        case 'ActMsgInqry' : // Message Inquiry
            break;
        case 'ActMstInqry' : // Account Inquiry
            break;
        case 'ActExecute' : // Execute
            break;
        case 'ActCancelJob' : // Clear
            break;
        case 'ActCNFInquiry' : // CNF Inquiry
            break;
        case 'ActCustContact' : // Customer Contact
            break;
        case 'ActCompass' : // Compass Process
            break;
        case 'ActFXInfo' : // FX Information
            break;
        case 'ActScan' : // Scan
            break;
        case 'ActTrxBy' : // Trx By
            break;
        case 'ActDoc' : // Document
            break;
    }
}

