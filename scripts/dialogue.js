var text = document.getElementById("speech-text")
var options = document.getElementById("speech-options")

window.onload = init
document.onclick = select

function init() 
{
    write("intro")
}

function select(e)
{
    e = e ||  window.event;
    var element = e.target || e.srcElement;

    if(element.tagName != 'A')
        return false
    if (element.target)
        return true

    let node = e.target.href.replace(/.*\//, "")
    write(node)
    return false
}

function write(node)
{
    clear()

    let div = document.getElementById(node)
    let content = div.cloneNode(true)
    
    fillText(content)
    fillOptions(content)
}

function fillText(content)
{
    content.style = "";
    text.append(content)
}

function fillOptions(content)
{
    let links = content.getElementsByTagName('a');
    let linkCount = links.length

    for (var i = 0; i < linkCount; i++) {
        let link = links[0]
        options.append(link)
    }
}

function clear()
{
    text.innerHTML = ""
    options.innerHTML = ""
}