let onstartwrite = new CustomEvent("startwrite")
let onendwrite = new CustomEvent("endwrite")

var iframe
var text
var options 

var curWrite
var isWriting = false
var skip = false

const TEXT_WAIT_MS = 10

jQuery(document).ready(function() {
    iframe  = $('#speechbubble').get(0)
    text    = iframe.contentWindow.document.getElementById("speech-text")
    options = iframe.contentWindow.document.getElementById("speech-options")
    
    iframe.contentWindow.document.onclick = onclick
    curWrite = write("intro")
});

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

    if (element.tagName != 'A')
        return false

    if (element.classList.contains("inline"))
        return true

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
    
    await fillText(content)
    fillOptions(content)
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
                        await wait(TEXT_WAIT_MS)
                    text.append(newText[c])
                }
                break
            case 'A':
            {
                if (!node.classList.contains("inline"))
                    break 

                const link = document.createElement('a');
                link.href = node.href;
                link.className = node.className;

                text.append(" ")
                text.appendChild(link);

                const linkText = node.textContent;

                for (let c = 0; c < linkText.length; c++)
                {
                    if (c > 0)
                        await wait(TEXT_WAIT_MS);

                    link.append(linkText[c]);
                }
                text.append(" ")

                break;
            }
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
    let links = [...content.querySelectorAll('a:not(.inline)')];
    let linkCount = links.length

    for (var i = 0; i < linkCount; i++) 
    {
        let link = links[i]
        options.append(link)
    }
}

function clear()
{
    text.innerHTML = ""
    options.innerHTML = ""
}
