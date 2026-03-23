var showcasing = false
var showcaseFrame = document.getElementById("showcase-frame");
var showcase
var showcaseCloseButton
var showcaseDoc
var thumbnail
var rowRole
var rowTeam
var rowDuration
var rowTools
var role
var teamSize
var duration
var tools
var description
var tagsContainer
var linksContainer

hideGame()
jQuery(document).ready(function() {
    showcase = $('#showcase').get(0)

    function grabElements() {
        if (!showcase || !showcase.contentWindow || !showcase.contentWindow.document) 
            return false

        showcaseDoc = showcase.contentWindow.document
        thumbnail = showcaseDoc.getElementById("showcase-thumbnail")
        rowRole = showcaseDoc.getElementById("showcase-row-role")
        rowTeam = showcaseDoc.getElementById("showcase-row-team")
        rowDuration = showcaseDoc.getElementById("showcase-row-duration")
        rowTools = showcaseDoc.getElementById("showcase-row-tools")
        role = showcaseDoc.getElementById("showcase-role")
        teamSize = showcaseDoc.getElementById("showcase-team-size")
        duration = showcaseDoc.getElementById("showcase-duration")
        tools = showcaseDoc.getElementById("showcase-tools")
        description = showcaseDoc.getElementById("showcase-description")
        tagsContainer = showcaseDoc.getElementById("showcase-tags")
        linksContainer = showcaseDoc.getElementById("showcase-links")
        showcaseCloseButton = showcaseDoc.getElementById('showcase-close-btn')
    
        showcaseCloseButton.addEventListener('click', function() {
            hideGame()
        });

        return true
    }

    if (!grabElements()) {
        showcase.addEventListener('load', function() {
            grabElements()
            clearShowcase()
        })
    } else {
        clearShowcase()
    }
})


function clearShowcase()
{
    // if (thumbnail) {
    //     thumbnail.src = ""
    //     thumbnail.style.display = "none"
    // }
    if (rowRole) rowRole.style.display = "none"
    if (rowTeam) rowTeam.style.display = "none"
    if (rowDuration) rowDuration.style.display = "none"
    if (rowTools) rowTools.style.display = "none"
    if (role) role.innerText = ""
    if (teamSize) teamSize.innerText = ""
    if (duration) duration.innerText = ""
    if (tools) tools.innerText = ""
    if (description) description.innerText = ""
    if (tagsContainer) {
        tagsContainer.innerText = ""
        tagsContainer.style.display = "none"
    }
    if (linksContainer) {
        linksContainer.innerHTML = ""
        linksContainer.style.display = "none"
    }
}

function showGame(game)
{
    // alert("SHOW GAME: " + game.name)
    hideSpeech()
    showcaseFrame.style = "display: block;"
    showcasing = true
    clearShowcase()
    fillShowcase(game)
}

function hideGame()
{
    showcaseFrame.style = "display: none;"
}

function fillShowcase(game)
{
    if (!game) 
        return

    if (thumbnail) {
        // if (game.imgPath) {
        //     thumbnail.src = game.imgPath
        // } else {
        //     thumbnail.src = ""
        //     thumbnail.style.display = "none"
        // }
    }

    var hasRole = !!game.role
    if (role) role.innerText = game.role || ""
    if (rowRole) rowRole.style.display = hasRole ? "flex" : "none"

    var hasTeam = game.teamSize !== undefined && game.teamSize !== null && game.teamSize !== ""
    if (teamSize) teamSize.innerText = hasTeam ? game.teamSize : ""
    if (rowTeam) rowTeam.style.display = hasTeam ? "flex" : "none"

    var durationText = game.duration || ""
    if (duration) duration.innerText = durationText
    if (rowDuration) rowDuration.style.display = durationText ? "flex" : "none"

    var toolsText = Array.isArray(game.tools) ? game.tools.join(', ') : (game.tools || game.engine || "")
    if (tools) tools.innerText = toolsText
    if (rowTools) rowTools.style.display = toolsText ? "flex" : "none"

    var descriptionText = game.description || game.summary || ""
    if (description) description.innerText = descriptionText
    description.style.display = descriptionText ? "flex" : "none"

    if (tagsContainer) {
        tagsContainer.innerHTML = ''
        if (Array.isArray(game.tags) && game.tags.length > 0) {
            game.tags.forEach(tag => {
                var spanTag = showcaseDoc.createElement('span')
                spanTag.className = 'showcase-tag'
                spanTag.innerText = tag
                tagsContainer.appendChild(spanTag)
            })
            tagsContainer.style.display = 'flex'
        } else {
            tagsContainer.style.display = 'none'
        }
    }

    linksContainer.innerHTML = ""
    var linkItems = []
    if (Array.isArray(game.links) && game.links.length > 0) {
        linkItems = game.links
    }

    if (linkItems.length === 0) {
        linksContainer.style.display = "none"
    } else {
        linksContainer.style.display = "flex"
        linkItems.forEach(item => {
            var a = showcaseDoc.createElement('a')
            a.className = "showcase-link"
            a.href = item.url || item
            a.target = "_blank"
            a.rel = "noopener noreferrer"
            a.innerText = item.text || item.url || item
            linksContainer.appendChild(a)
        })
    }
}
