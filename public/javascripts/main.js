function getclasscode() {
    fetch('/createclass')
    .then(res => res.json())
    .then(data => {
        console.log(data);
        
        var output = `<button class="button is-medium is-fullwidth onclick="myfunction()">Get Classcode</button>
            <div id="myresult">${ data[0].classcode }</div>
            `;
        document.getElementById("classcode").innerHTML = output;
    })
}