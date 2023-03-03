function createPrettierArea(id, promptDiv) {
  let prettierLabel = document.createElement("label")
  prettierLabel.className = "block w-full"
  prettierLabel.style = "padding-top:0.625rem"

  let textarea = promptDiv.querySelector("textarea")
  let height =
    textarea.offsetHeight +
    parseInt(
      window.getComputedStyle(textarea).getPropertyValue("border-top-width")
    ) +
    parseInt(
      window.getComputedStyle(textarea).getPropertyValue("border-bottom-width")
    )

  let prettierDiv = document.createElement("div")
  prettierDiv.id = id
  prettierDiv.innerHTML = "Prompt"
  prettierDiv.className =
    "block gr-box gr-input w-full gr-text-input prettier-prompt"
  prettierDiv.style = "color:#6b7280;min-height:" + height + "px;"
  prettierLabel.appendChild(prettierDiv)
  promptDiv.appendChild(prettierLabel)
}

/* function formattingPrompt(promptDiv, prettierDiv) {
  let promptValue = promptDiv.querySelector("textarea").value

  if (promptValue.length < 1) return

  let lines = promptValue.split("\n")
  let formattedLines = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let splitText = line.split(",").map((item) => item.trim())

    //format rules
    let formattedText = splitText
      .map((item) => {
        const regex = /(\([^()]+\))|(\{[^{}]+\})/g
        const matches = item.match(regex)
        if (matches) {
          matches.forEach((match) => {
            const replaced = match.replace(/[\(\){}]/g, "")
            const className = match.startsWith("(") ? "red" : "green"
            const tag = `<span class="${className}">${replaced}</span>`
            item = item.replace(match, tag)
          })
        }
        return item
      })
      .join("<span>, </span>")

    //finished formatting
    formattedLines.push(formattedText)
  }

  //   prettierDiv.style = "color:#ffffff;"
  prettierDiv.style.setProperty("color", "#ffffff")
  prettierDiv.innerHTML = formattedLines.join("<br>")
} */
function formattingPrompt(promptDiv, prettierDiv) {
  let promptValue = promptDiv.querySelector("textarea").value

  if (promptValue.length < 1) return

  let lines = promptValue.split("\n")
  let formattedLines = []

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i]
    let splitText = line.split(",").map((item) => item.trim())

    //format rules
    let formattedText = splitText
      .map((item) => {
        const regex = /(\([^()]+\))|(\{[^{}]+\})|(\[[^\[\]]+\])|(<[^<>]+>)/g
        const matches = item.match(regex)
        if (matches) {
          matches.forEach((match) => {
            if (match.startsWith("(")) {
              const replaced = match.replace(/[\(\)]/g, "")
              const className = "red"
              const tag = `<span class="${className}">${replaced}</span>`
              item = item.replace(match, tag)
            } else if (match.startsWith("[")) {
              const replaced = match.replace(/[\[\]]/g, "")
              const className = `red_${replaced.split("(").length - 1}`
              const tag = `<span class="${className}">${replaced}</span>`
              item = item.replace(match, tag)
            } else if (match.startsWith("<")) {
              const replaced = match.replace(/[<>]/g, "")
              const className = "error"
              const tag = `<span class="${className}">${replaced}</span>`
              item = item.replace(match, tag)
            } else if (!match.includes(":")) {
              const replaced = match.replace(/[\{\}]/g, "")
              const className = "green"
              const tag = `<span class="${className}">${replaced}</span>`
              item = item.replace(match, tag)
            } else {
              const replaced = match.replace(/[\{\}]/g, "")
              const className = `red_${replaced.split("(").length - 1}`
              const tag = `<span class="${className}">${replaced}</span>`
              item = item.replace(match, tag)
            }
          })
        }
        return item
      })
      .join("<span>, </span>")

    //finished formatting
    formattedLines.push(formattedText)
  }
  prettierDiv.style = "color:#ffffff;"
  prettierDiv.style.setProperty("color", "#ffffff")
  prettierDiv.innerHTML = formattedLines.join("<br>")
}

let lastExecutionTime = 0
const executionInterval = 500

onUiUpdate(() => {
  //t2i/i2i prompt/negpromt element
  const t2iPrompt = gradioApp().querySelector("#txt2img_prompt")
  const t2iNegPrompt = gradioApp().querySelector("#txt2img_neg_prompt")
  const i2iPrompt = gradioApp().querySelector("#img2img_prompt")
  const i2iNegPrompt = gradioApp().querySelector("#img2img_neg_prompt")
  //t2i/i2i prettier prompt/negpromt element
  const t2iPrettierArea = gradioApp().querySelector("#t2iPrettierArea")
  const t2iNegPrettierArea = gradioApp().querySelector("#t2iNegPrettierArea")
  const i2iPrettierArea = gradioApp().querySelector("#i2iPrettierArea")
  const i2iNegPrettierArea = gradioApp().querySelector("#i2iNegPrettierArea")

  //set timer for save
  let now = Date.now()
  if (now - lastExecutionTime < executionInterval) {
    return
  } else {
    //execute formatting
    if (t2iPrompt) formattingPrompt(t2iPrompt, t2iPrettierArea)
    if (t2iNegPrompt) formattingPrompt(t2iNegPrompt, t2iNegPrettierArea)
    if (i2iPrompt) formattingPrompt(i2iPrompt, i2iPrettierArea)
    if (i2iNegPrompt) formattingPrompt(i2iNegPrompt, i2iNegPrettierArea)
    lastExecutionTime = now
  }
  //create prettier prompt area
  if (!t2iPrompt || t2iPrettierArea) return
  createPrettierArea("t2iPrettierArea", t2iPrompt)
  if (!t2iNegPrompt || t2iNegPrettierArea) return
  createPrettierArea("t2iNegPrettierArea", t2iNegPrompt)
  if (!i2iPrompt || i2iPrettierArea) return
  createPrettierArea("i2iPrettierArea", i2iPrompt)
  if (!i2iNegPrompt || i2iNegPrettierArea) return
  createPrettierArea("i2iNegPrettierArea", i2iNegPrompt)
})
