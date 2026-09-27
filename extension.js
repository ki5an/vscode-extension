const vscode = require("vscode");
const fs = require("fs");
const path = require("path");

function activate(context) {
    const cssFile = path.join(context.extensionPath, "code.css");

    if (!fs.existsSync(cssFile)) {
        vscode.window.showErrorMessage("code.css not found.");
        return;
    }

    const css = fs.readFileSync(cssFile, "utf8");

    const workbenchCSS = path.join(
        vscode.env.appRoot,
        "out",
        "vs",
        "workbench",
        "workbench.desktop.main.css"
    );

    try {
        let existingCSS = fs.readFileSync(workbenchCSS, "utf8");

        const marker = "/* VSCode Explorer Spacing */";

        // Remove previous injection
        const markerIndex = existingCSS.indexOf(marker);

        if (markerIndex !== -1) {
            existingCSS = existingCSS.substring(0, markerIndex);
        }

        existingCSS += `\n\n${marker}\n${css}\n`;

        fs.writeFileSync(workbenchCSS, existingCSS, "utf8");

        vscode.window.showInformationMessage(
            "Explorer CSS applied. Restart VS Code."
        );
    } catch (error) {
        vscode.window.showErrorMessage(
            "Unable to modify VS Code workbench CSS."
        );

        console.error(error);
    }
}

function deactivate() {}

module.exports = {
    activate,
    deactivate
};