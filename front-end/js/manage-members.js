const pageSize = 3;
let page = 3;

getMembers();
function getMembers(query=`${$('#txt-search').val()}`){

/*Initiate a XMLHttpRequest object */
const http = new XMLHttpRequest();


/**/
http.addEventListener('readystatechange',()=>{
    //console.log('Working');
    if(http.readyState === http.DONE){
        $('#loader').hide();
        if(http.status === 200){
            
            const totalMembers =+http.getResponseHeader('X-Total-Count');
            initpagination(totalMembers);
            const members = JSON.parse(http.response);
            

            if(members.length === 0){
                 $('#tbl-members').addClass('empty');
            }else{
                $('#tbl-members').removeClass('empty');
            }
            $('#tbl-members tbody tr').remove();
            members.forEach(member => {
                const rowHtml = `
                <tr tabindex="0">
                    <td>${member.id}</td>
                    <td>${member.name}</td>
                    <td>${member.address}</td>
                    <td>${member.contact}</td>
                </tr>
                `;
                $('#tbl-members tbody').append(rowHtml);
            });
            
        }else{
            $('#toast').show();
        }
    }
    
});

/*Open the request*/
// http.open('GET', 'https://2fa53667-85a6-43d8-8233-1ded58b7d536.mock.pstmn.io/members', true);
http.open('GET', `http://localhost:8080/lms/api/members?size=${pageSize}&page=${page}&q=${query}`, true);

/*Send the request*/
http.send();
}

function initpagination(totalMembers){
    const totalPaged = Math.ceil(totalMembers / pageSize);

    if(totalPaged === 1){
        $("#pagination").addClass('d-none');
    }else{
        $("#pagination").removeClass('d-none');
    }

    let html = '';
    for(let i = 1; i <= totalPaged; i++){
        html += `<li class="page-item ${i ===page?'active': ''}"><a class="page-link" href="#">${i}</a></li>`
    }
     html = `
        <li class="page-item ${page === 1? 'disabled': ''}"><a class="page-link" href="#">Previous</a></li>
        ${html}
        <li class="page-item ${page === totalPaged? 'disabled': ''}"><a class="page-link" href="#">Next</a></li>
    `;

    $('#pagination > .pagination').html(html);
}


$('#pagination > .pagination').click((eventData)=>{
    const elm = eventData.target;
    if(elm && elm.tagName === 'A'){
        const activePage =  $(elm).text();
        if(activePage === 'Next'){
            page++;
            getMembers();
        }else if(activePage == 'Previous'){
            page--;
            getMembers();
        }else{
            if(page !== activePage){
                page = +activePage;
                getMembers();

            }
            
        }
    }
});

$('#txt-search').on('input', ()=>{
    page = 1;
    getMembers();
});

$('#tbl-members tbody').keyup((eventData) =>{
    if(eventData.which === 38){
        //console.log('Up');
        const elm = document.activeElement.previousElementSibling;
        if(elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }else if(eventData.which === 40){
        //console.log('down');
        const elm = document.activeElement.nextElementSibling;
        if(elm instanceof HTMLTableRowElement){
            elm.focus();
        }
    }
});

$(document).keydown((eventData)=>{
    if(eventData.ctrlKey && eventData.key === '/'){
        $("#txt-search").focus();
    }
});