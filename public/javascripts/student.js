function view() {
    console.log("hello");
    fetch('/studentclasses')
    .then(res=> res.json())
    .then(data => {
        console.log('hi');
        console.log(data);
        var i=0;
        var x = 0;
        var output = `<div class="box">
        <button class="button is-warning is-light is-large is-fullwidth"  id="center"  onclick="location.href='/student/joinclass'">Join Class</button>
    </div>`;
        for(; i<data.length; i++) {
            x += 1;
            output += `
                <div class="box">
                <ul>
                    <li><a onclick='dashboard(this)' id="${data[i].CODE}" class='button is-success is-light is-large is-fullwidth'>'${data[i].SUBJECT}'</a></li>
                    <li><p class="button is-warning is-light is-large is-fullwidth" id="marg">'${data[i].NAME}'</p></li>
                    <li><p class="button is-danger is-light is-large is-fullwidth" id="marg">'${data[i].CODE}'</p></li>
                </ul>
                </div>`;
        }
    
        document.getElementById('hellomf').innerHTML = output;

    })
    .catch(err => console.log(err));
}


function dashboard(elem) {
    console.log(typeof(elem.id));
    const code = elem.id.toString();        
    const ide = {id: code};
    localStorage.setItem("code", code);
//    const response = await fetch('/auth/studentassignmentpage', {
//        method: 'POST',
//        headers: {
//            'Content-Type': 'application/json'
//            // 'Content-Type': 'application/x-www-form-urlencoded',
//        },
//        body: JSON.stringify(ide)
//        })
//// no-cors, *cors, same-origin
//        .then(data => {
//            console.log("push hard");
//            console.log('Success:', data);
//            console.log("push hard");
//
//        })
//        .catch((error) => {
//            console.log("push hard so");
//            console.error('Error:', error);
//        });
//        console.log("whats up bro? ");
//
    fetch('/auth/studentassignmentpage?' + new URLSearchParams({
        id: code,
    }))
    .then(response => response.json())
    .then(data => {
        
         window.location = '/student/assignment';

    })
    .catch(err => console.log(err));
}

