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
            
                <div class="box">
                    <ul>
                        <li><a  class="button is-success is-light is-large is-fullwidth" id="marg" href="#">'${data[i].code}'</a></li>
                        <li><p class="button is-warning is-light is-large is-fullwidth" id="marg">'${data[i].name}'</p></li>
                        <li><p class="button is-danger is-light is-large is-fullwidth" id="marg">'${data[i].subject}'</p></li>
                    </ul>
                </div>`;
        }
    
        document.getElementById('hellomf').innerHTML = output;

    })
    .catch(err => console.log(err));
}