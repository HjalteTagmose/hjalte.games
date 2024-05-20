let onstartwrite = new CustomEvent("startwrite")
let onendwrite = new CustomEvent("endwrite")

var iframe
var text
var options 

var curWrite
var isWriting = false
var skip = false

jQuery(document).ready(function() {
    setTimeout(init, 500);
});

function init() 
{
    iframe  = $('#speechbubble').get(0)
    text    = iframe.contentWindow.document.getElementById("speech-text")
    options = iframe.contentWindow.document.getElementById("speech-options")
    
    iframe.contentWindow.document.onclick = onclick
    curWrite = write("intro")
}

function onclick(e)
{
    if (isWriting)
    {  
        skip = true
        return false
    }

    return select(e)
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
    dispatchEvent(onstartwrite)
    clear() 

    let div = iframe.contentWindow.document.getElementById(id)
    let content = div.cloneNode(true)
    
    showOptions(false)
    fillOptions(content)
    await fillText(content)
    showOptions(true)
    dispatchEvent(onendwrite)
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
                let newText = node.nodeValue.trim()
                if (!newText)
                    continue

                for (let c = 0; c < newText.length; c++) 
                {
                    if (c > 0)
                        await wait(10)
                    text.append(newText[c])
                }
                break
            case 'BR': 
                const linebreak = document.createElement("br")
                text.appendChild(linebreak)
                break
        }
    }

    content.style = ""
    text.innerHTML = ""
    text.append(content)

    async function wait(ms)
    {
        for (let i = 0; i < ms; i++) 
        {
            if (skip)
                break 
            await sleep(1)
        }
    }
}

function fillOptions(content)
{
    let links = content.getElementsByTagName('a');
    let linkCount = links.length

    for (var i = 0; i < linkCount; i++) 
    {
        let link = links[0]
        options.append(link)
    }
}

function clear()
{
    text.innerHTML = ""
    options.innerHTML = ""
}

function showOptions(on)
{
    options.style = on ? "" : "display: none;";
}