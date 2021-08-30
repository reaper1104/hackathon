function view() {
    console.log("hello");
    fetch('/teacherclasses')
    .then(res=> res.json())
    .then(data => {
        console.log('hi');
        console.log(data);
        var i=0;
        var x = 0;
        var output = `<div class="box">
        <button class="button is-warning is-light is-large is-fullwidth"  id="center"  onclick="location.href='/homepage'">Create</button>
    </div>`;
        for(; i<data.length; i++) {
            x += 1;
            output += `
            <li id = "${x}_class">
                <div class="box">
                    <a onclick='dashboard(this)' id="${data[i].CODE}" class='${x}'>'${data[i].SUBJECT}'</a>
                    <p>'${data[i].NAME}'</p>
                    <p>'${data[i].CODE}'</p>
                </div>
            <li>`;
        }
    
        document.getElementById('hellomf').innerHTML = output;

    })
    .catch(err => console.log(err));
}


async function dashboard(elem) {
    console.log(typeof(elem.id));
    const code = elem.id.toString();        
    const ide = {id: code};

    const response = await fetch('/auth/assignmentpage', {
        method: 'POST',
        mode: "same-origin",
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(ide)
        })
// no-cors, *cors, same-origin
        .then(data => {
            console.log("push hard");
            console.log('Success:', data);
        })
        .catch((error) => {
            console.log("push hard so");
            console.error('Error:', error);
        });

        window.location = '/teacher/assignment';
}

