function view() {

    fetch('/teacherclasses')
    .then(res=> res.json())
    .then(data => {
    
        console.log(data);
        var i=0;
        var x = 0;
        var output = '';
        for(; i<data.length; i++) {
            x += 1;
            output += `
            <li>
                <div class="box">
                    //<a href="#">'${data[i].code}'</a>
                    //<p>'${data[i].name}'</p>
                    //<p>'${data[i].subject}'</p>
                    <p>hello motherfucker</p>
                    <p>hello motherfucker2</p>
                    <p>hello motherfucker3</p>

                </div>
            <li>`;
        }
    
        document.getElementById('hellomf').innerHTML = output;

    })
    .catch(err => console.log(err));
}