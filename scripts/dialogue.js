var text = document.getElementById("speech-text")
var options = document.getElementById("speech-options")

var curWrite
var isWriting = false
var skip = false

window.onload = init
document.onclick = function(e) {
    if (isWriting)
    {
        skip = true
        return false
    }

    return select(e)
}

function init() 
{
    curWrite = write("intro")
}

function select(e)
{
    var element = e.target || e.srcElement;

    if(element.tagName != 'A')
        return false
    if (element.target)
        return true

    let id = e.target.href.replace(/.*\//, "")
    curWrite = write(id)
    return false
}

async function write(id)
{
    skip = false
    isWriting = true
    clear()

    let div = document.getElementById(id)
    let content = div.cloneNode(true)
    
    fillOptions(content)
    await fillText(content)
    isWriting = false
}

async function fillText(content)
{    
    var nodes = content.childNodes;
    for(var i = 0; i < nodes.length; i++)
    { 
        if (skip)
            break

        const node = nodes[i]                       
        switch(node.nodeName) 
        {
            case '#text': 
                const newText = node.nodeValue
                for (let c = 0; c < newText.length; c++) 
                {
                    text.append(newText[c])
                    await sleep(10)
                }
                break
            case 'BR': 
                const linebreak = document.createElement("br");
                text.appendChild(linebreak);
                break
        }
    }

    content.style = ""
    text.innerHTML = ""
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