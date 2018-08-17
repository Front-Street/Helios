const observableDiff = require("deep-diff").observableDiff;
const output = document.querySelector(".state-output");
let counter = 0;
chrome.devtools.panels.create(
  "Apollo State Debugger",
  "time_travel.png",
  "devtools.html",
  function(panel) {
    output.innerHTML += ``;
  }
);
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.msg === "state_changed") {
    let lhs = request.data.state[0];
    let rhs = request.data.state[1];
    var entries = [];
    var additions = [];
    var edits = [];
    var deletions = [];
    observableDiff(lhs, rhs, change => {
      switch (change.kind) {
        case "N":
          additions.push(`<p class="change"><span class="addition">Added:</span> ${
            change.path[change.path.length - 1]
          }
        : <em> ${JSON.stringify(change.rhs)}
        </em> </p>`);
          break;
        case "D":
          deletions.push(`<p><span class="deletion">Removed:</span> ${
            change.path[change.path.length - 1]
          } <del>
        : <em>${JSON.stringify(change.lhs)}
        </em></del> </p>`);
          break;
        case "E":
          edits.push(`<p><span class="edit">Edited:</span> ${
            change.path[change.path.length - 1]
          }: <del><em>${JSON.stringify(
            change.lhs
          )}</em></del>   <strong>&rarr;</strong> ${
            change.path[change.path.length - 1]
          }
        : <em>${JSON.stringify(change.rhs)}
        </em> </p>`);
          break;
        case "A": // Don't output anything for the array case
          // output.innerHTML += `Change within array`;
          break;
      }
    });
    if (additions.length > 0)
      entries.push(`<dd><details> <summary class="change-type">Additions</summary> ${additions.join(
        ""
      )}
    </details></dd>`);
    if (edits.length > 0)
      entries.push(`<dd><details> <summary class="change-type">Edits</summary> ${edits.join(
        ""
      )}
    </details></dd>`);
    if (deletions.length > 0)
      entries.push(`<dd><details> <summary class="change-type">Deletions</summary> ${deletions.join(
        ""
      )}
    </details></dd>`);

    // Write html output here
    const log = `<dl><details> <summary class="mutation">${counter}
    </summary> <dt>${entries.join("")}
    </dt> </details></dl>`;
    output.innerHTML += log;
    counter += 1;
  }
});
