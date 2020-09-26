"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path = require("path");
const vscode_theme_generator_1 = require("vscode-theme-generator");
const Vibrant = require("node-vibrant");
function generateThemesFromImage(image, location, cb) {
    let vibrant;
    let lightVibrant;
    let darkVibrant;
    let muted;
    let lightMuted;
    let darkMuted;
    const defaultColor = '#000000'; //'#d0d0d0';
    Vibrant.from(image).getPalette((err, palette) => {
        if (err && cb) {
            cb(err, undefined);
        }
        vibrant = palette.Vibrant ? palette.Vibrant.getHex() : defaultColor;
        lightVibrant = palette.LightVibrant ? palette.LightVibrant.getHex() : defaultColor;
        darkVibrant = palette.DarkVibrant ? palette.DarkVibrant.getHex() : defaultColor;
        muted = palette.Muted ? palette.Muted.getHex() : defaultColor;
        lightMuted = palette.LightMuted ? palette.LightMuted.getHex() : defaultColor;
        darkMuted = palette.DarkMuted ? palette.DarkMuted.getHex() : defaultColor;
        let colorSet = {
            base: {
                background: '#ffffff',
                foreground: lightMuted || defaultColor,
                color1: muted || defaultColor,
                color2: vibrant || defaultColor,
                color3: vibrant || defaultColor,
                color4: lightVibrant || defaultColor //lightVibrant
            }
        };
        let themeName = 'Themey';
        vscode_theme_generator_1.generateTheme(themeName, colorSet, path.join(__dirname, '..', 'themes', 'themey.json'));
        themeName + ' Alt';
        colorSet.base.background = darkMuted;
        colorSet.base.foreground = lightMuted;
        colorSet.base.color1 = muted;
        colorSet.base.color2 = vibrant;
        colorSet.base.color3 = muted;
        colorSet.base.color4 = vibrant;
        vscode_theme_generator_1.generateTheme(themeName, colorSet, path.join(__dirname, '..', 'themes', 'themey-alt.json'));
        if (cb) {
            cb(undefined, "Successfully created themes.");
        }
    });
}
exports.generateThemesFromImage = generateThemesFromImage;
//# sourceMappingURL=themeGenerator.js.map