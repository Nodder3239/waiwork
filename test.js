

function button1Click(event) {
    
    var query = $("#input1").val();
    var target = $("#select1").val();
    if(query !== "") {
        $.ajax({           
            type: 'GET',
            url: 'https://dapi.kakao.com/v3/search/book',
            dataType: 'JSON',
            headers: {
                'Authorization': 'KakaoAK 3a5d62229ba826ad50eb8bb89260d422'
            },
            data: {
                'target': target,
                'query': query,
                'size' : 20,
            },
            success: function(response) {
                console.log(response);
                grid1.setData(response.documents);
            },
            error: function(xhr, status, error) {
                console.error(xhr.responseText);
            }
        });
    } else {
        alert("검색어를 입력하세요.");
    }
    
}