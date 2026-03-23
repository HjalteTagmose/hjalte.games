const showcaseFrame = document.getElementById("showcase-frame");
let showcasing = false;

const el = {};
let showcase, showcaseDoc;

init();

function init() {
    showcase = document.getElementById("showcase");

    function grabElements() {
        if (!showcase?.contentWindow?.document) return false;

        showcaseDoc = showcase.contentWindow.document;

        el.thumbnail = showcaseDoc.getElementById("showcase-thumbnail");

        el.rowRole = showcaseDoc.getElementById("showcase-row-role");
        el.rowTeam = showcaseDoc.getElementById("showcase-row-team");
        el.rowDuration = showcaseDoc.getElementById("showcase-row-duration");
        el.rowTools = showcaseDoc.getElementById("showcase-row-tools");

        el.role = showcaseDoc.getElementById("showcase-role");
        el.teamSize = showcaseDoc.getElementById("showcase-team-size");
        el.duration = showcaseDoc.getElementById("showcase-duration");
        el.tools = showcaseDoc.getElementById("showcase-tools");
        el.description = showcaseDoc.getElementById("showcase-description");

        el.tags = showcaseDoc.getElementById("showcase-tags");
        el.links = showcaseDoc.getElementById("showcase-links");

        const closeBtn = showcaseDoc.getElementById("showcase-close-btn");
        if (closeBtn && !closeBtn._bound) {
            closeBtn.addEventListener("click", hideGame);
            closeBtn._bound = true;
        }

        return true;
    }

    if (!grabElements()) {
        showcase.addEventListener("load", () => {
            grabElements();
            resetContainers();
        });
    } else {
        resetContainers();
    }

    hideGame();
}

function setField(value, textEl, rowEl) {
    const has = !!value;
    if (textEl) textEl.textContent = has ? value : "";
    if (rowEl) rowEl.style.display = has ? "flex" : "none";
}

function setThumbnail(src) {
    if (!el.thumbnail) return;

    if (src) {
        el.thumbnail.src = src;
        el.thumbnail.style.display = "block";
    } else {
        el.thumbnail.src = "";
        el.thumbnail.style.display = "none";
    }
}

function resetContainers() {
    if (el.tags) {
        el.tags.innerHTML = "";
        el.tags.style.display = "none";
    }
    if (el.links) {
        el.links.innerHTML = "";
        el.links.style.display = "none";
    }
}

function showGame(game) {
    if (!game) return;

    hideSpeech?.();

    showcasing = true;
    showcaseFrame.style.display = "block";

    fillShowcase(game);
}

function hideGame() {
    showcasing = false;
    showcaseFrame.style.display = "none";
}

function fillShowcase(game) {
    setThumbnail(game.imgPath);
    setField(game.role, el.role, el.rowRole);
    setField(game.teamSize, el.teamSize, el.rowTeam); 
    setField(game.duration, el.duration, el.rowDuration);

    const toolsText = Array.isArray(game.tools)
        ? game.tools.join(", ")
        : (game.tools || game.engine || "");
    setField(toolsText, el.tools, el.rowTools);

    const desc = game.description || game.summary || "";
    if (el.description) {
        el.description.textContent = desc;
        el.description.style.display = desc ? "flex" : "none";
    }

    // tags
    if (el.tags) {
        el.tags.innerHTML = "";

        if (Array.isArray(game.tags) && game.tags.length) {
            const frag = showcaseDoc.createDocumentFragment();

            for (const tag of game.tags) {
                const span = showcaseDoc.createElement("span");
                span.className = "showcase-tag";
                span.textContent = tag;
                frag.appendChild(span);
            }

            el.tags.appendChild(frag);
            el.tags.style.display = "flex";
        } else {
            el.tags.style.display = "none";
        }
    }

    // links
    if (el.links) {
        el.links.innerHTML = "";

        const items = Array.isArray(game.links) ? game.links : [];

        if (items.length) {
            const frag = showcaseDoc.createDocumentFragment();

            for (const item of items) {
                const url = item.url || item;
                const text = item.text || url;

                const a = showcaseDoc.createElement("a");
                a.className = "showcase-link";
                a.href = url;
                a.target = "_blank";
                a.rel = "noopener noreferrer";
                a.textContent = text;

                frag.appendChild(a);
            }

            el.links.appendChild(frag);
            el.links.style.display = "flex";
        } else {
            el.links.style.display = "none";
        }
    }
}