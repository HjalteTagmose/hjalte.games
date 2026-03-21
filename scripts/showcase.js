var showcasing = false
var showcaseFrame = document.getElementById("showcase-frame");
var showcase
var showcaseDoc
var title
var thumbnail
var rowRole
var rowTeam
var rowDuration
var rowTechnology
var rowPlatforms
var rowTags
var role
var teamSize
var duration
var technology
var platforms
var tags
var description
var linksContainer

hideGame()
jQuery(document).ready(function() {
    showcase = $('#showcase').get(0)

    function grabElements() {
        if (!showcase || !showcase.contentWindow || !showcase.contentWindow.document) return false
        showcaseDoc = showcase.contentWindow.document
        title = showcaseDoc.getElementById("showcase-title")
        thumbnail = showcaseDoc.getElementById("showcase-thumbnail")
        rowRole = showcaseDoc.getElementById("showcase-row-role")
        rowTeam = showcaseDoc.getElementById("showcase-row-team")
        rowDuration = showcaseDoc.getElementById("showcase-row-duration")
        rowTechnology = showcaseDoc.getElementById("showcase-row-technology")
        rowPlatforms = showcaseDoc.getElementById("showcase-row-platforms")
        rowTags = showcaseDoc.getElementById("showcase-row-tags")
        role = showcaseDoc.getElementById("showcase-role")
        teamSize = showcaseDoc.getElementById("showcase-team-size")
        duration = showcaseDoc.getElementById("showcase-duration")
        technology = showcaseDoc.getElementById("showcase-technology")
        platforms = showcaseDoc.getElementById("showcase-platforms")
        tags = showcaseDoc.getElementById("showcase-tags")
        description = showcaseDoc.getElementById("showcase-description")
        linksContainer = showcaseDoc.getElementById("showcase-links")
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
    if (!title) return
    title.innerText = ""
    if (thumbnail) {
        thumbnail.src = ""
        thumbnail.style.display = "none"
    }
    if (rowRole) rowRole.style.display = "none"
    if (rowTeam) rowTeam.style.display = "none"
    if (rowDuration) rowDuration.style.display = "none"
    if (rowTechnology) rowTechnology.style.display = "none"
    if (rowPlatforms) rowPlatforms.style.display = "none"
    if (rowTags) rowTags.style.display = "none"
    if (role) role.innerText = ""
    if (teamSize) teamSize.innerText = ""
    if (duration) duration.innerText = ""
    if (technology) technology.innerText = ""
    if (platforms) platforms.innerText = ""
    if (tags) tags.innerText = ""
    if (description) description.innerText = ""
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
    if (!game || !title) 
        return

    title.innerText = game.name || "Untitled"

    if (thumbnail) {
        if (game.imgPath) {
            thumbnail.src = game.imgPath
            thumbnail.style.display = "block"
        } else {
            thumbnail.src = ""
            thumbnail.style.display = "none"
        }
        thumbnail.alt = (game.name ? game.name + " thumbnail" : "game thumbnail")
    }

    var hasRole = !!game.role
    if (role) role.innerText = game.role || ""
    if (rowRole) rowRole.style.display = hasRole ? "block" : "none"

    var hasTeam = game.teamSize !== undefined && game.teamSize !== null && game.teamSize !== ""
    if (teamSize) teamSize.innerText = hasTeam ? game.teamSize : ""
    if (rowTeam) rowTeam.style.display = hasTeam ? "block" : "none"

    var durationText = game.duration || game.date || ""
    if (duration) duration.innerText = durationText
    if (rowDuration) rowDuration.style.display = durationText ? "block" : "none"

    var technologyText = Array.isArray(game.technology) ? game.technology.join(', ') : (game.technology || game.engine || "")
    if (technology) technology.innerText = technologyText
    if (rowTechnology) rowTechnology.style.display = technologyText ? "block" : "none"

    var platformsText = Array.isArray(game.platforms) ? game.platforms.join(', ') : (game.platforms || "")
    if (platforms) platforms.innerText = platformsText
    if (rowPlatforms) rowPlatforms.style.display = platformsText ? "block" : "none"

    var tagsText = Array.isArray(game.tags) ? game.tags.filter(t => t.toLowerCase() !== 'all').join(', ') : (game.tags || "")
    if (tags) tags.innerText = tagsText
    if (rowTags) rowTags.style.display = tagsText ? "block" : "none"

    var descriptionText = game.description || game.summary || ""
    if (description) description.innerText = descriptionText
    description.style.display = descriptionText ? "block" : "none"

    linksContainer.innerHTML = ""
    var linkItems = []
    if (Array.isArray(game.links) && game.links.length > 0) {
        linkItems = game.links
    } else if (game.link) {
        linkItems = [{ text: "Game Link", url: game.link }]
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