function view() {
    console.log("hello");
    fetch('/teacherclasses')
    .then(res=> res.json())
    .then(data => {
        console.log('hi');
        console.log(data);
        var i=0;
        var x = 0;
        var output = ``;
        for(; i<data.length; i++) {
            x += 1;
            output += `
                <div class="column">
                <div class="box">
                  <p class="title is-underlined">${data[i].NAME}</p>
                  <br>
                  <p><a onclick='dashboard(this)' id="${data[i].CODE}" class="subtitle">${data[i].SUBJECT}</a></p>
                </div>
                </div>`;
        }

        document.getElementById('hellomf').innerHTML = output;

    })
    .catch(err => console.log(err));
}


async function dashboard(elem) {
    console.log(typeof(elem.id));
    const code = elem.id.toString();

    const ide = {id: code};
    localStorage.setItem("code", code);

    fetch('/auth/assignmentpage?' + new URLSearchParams({
        id: code,
    }))
    .then(response => response.json())
    .then(data => {

         window.location = '/teacher/assignment';

    })
    .catch(err => console.log(err));
}
