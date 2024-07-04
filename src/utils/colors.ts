import chroma from 'chroma-js';
import { updatePrimaryPalette } from '@primevue/themes';

export const getColor = (color) => chroma(color);

export const getPalette = (color) => {
    const colors = chroma.scale(['white', color, 'black']);
    const palette = [];

    // Create 0
    palette.push(chroma('#fff'));

    // Create 50
    palette.push(colors(0.05));

    // Create 100-900
    for (let i = 0.1; i < 0.9; i += 0.1) {
        palette.push(colors(i));
    }

    // Create 950
    palette.push(colors(0.95));

    return palette;
};

export const setPrimaryColors = (palette) => {
    localStorage.setItem("ocr4all/frontend/colors/primary", JSON.stringify({
        0: palette[0].hex(),
        50: palette[1].hex(),
        100: palette[2].hex(),
        200: palette[3].hex(),
        300: palette[4].hex(),
        400: palette[5].hex(),
        500: palette[6].hex(),
        600: palette[7].hex(),
        700: palette[8].hex(),
        800: palette[9].hex(),
        900: palette[10].hex(),
        950: palette[11].hex()
    }))

    updatePrimaryPalette({
        50: palette[1].hex(),
        100: palette[2].hex(),
        200: palette[3].hex(),
        300: palette[4].hex(),
        400: palette[5].hex(),
        500: palette[6].hex(),
        600: palette[7].hex(),
        700: palette[8].hex(),
        800: palette[9].hex(),
        900: palette[10].hex(),
        950: palette[11].hex()
    });
    document.documentElement.style.setProperty('--main-0', palette[0].rgb().join(" "));
    document.documentElement.style.setProperty('--main-50', palette[1].rgb().join(" "));
    document.documentElement.style.setProperty('--main-100', palette[2].rgb().join(" "));
    document.documentElement.style.setProperty('--main-200', palette[3].rgb().join(" "));
    document.documentElement.style.setProperty('--main-300', palette[4].rgb().join(" "));
    document.documentElement.style.setProperty('--main-400', palette[5].rgb().join(" "));
    document.documentElement.style.setProperty('--main-500', palette[6].rgb().join(" "));
    document.documentElement.style.setProperty('--main-600', palette[7].rgb().join(" "));
    document.documentElement.style.setProperty('--main-700', palette[8].rgb().join(" "));
    document.documentElement.style.setProperty('--main-800', palette[9].rgb().join(" "));
    document.documentElement.style.setProperty('--main-900', palette[10].rgb().join(" "));
    document.documentElement.style.setProperty('--main-950', palette[11].rgb().join(" "));
}

export const setPrimaryColorsFromStorage = () => {
    const palette = JSON.parse(localStorage.getItem("ocr4all/frontend/colors/primary"))

    if(palette){
        updatePrimaryPalette({
            50: palette["50"],
            100: palette["100"],
            200: palette["200"],
            300: palette["300"],
            400: palette["400"],
            500: palette["500"],
            600: palette["600"],
            700: palette["700"],
            800: palette["800"],
            900: palette["900"],
            950: palette["950"]
        });
        document.documentElement.style.setProperty('--main-0', chroma(palette["0"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-50', chroma(palette["50"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-100', chroma(palette["100"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-200', chroma(palette["200"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-300', chroma(palette["300"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-400', chroma(palette["400"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-500', chroma(palette["500"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-600', chroma(palette["600"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-700', chroma(palette["700"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-800', chroma(palette["800"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-900', chroma(palette["900"]).rgb().join(" "));
        document.documentElement.style.setProperty('--main-950', chroma(palette["950"]).rgb().join(" "));
    }
}

// {
//     0: chroma("rgb(255,255,255)"),
//     50: chroma("rgb(238,242,255)"),
//     100: chroma("rgb(225,232,254)"),
//     200: chroma("rgb(200,212,253)"),
//     300: chroma("rgb(167,183,250)"),
//     400: chroma("rgb(131,145,246)"),
//     500: chroma("rgb(102,108,238)"),
//     600: chroma("rgb(78,73,226)"),
//     700: chroma("rgb(53,49,157)"),
//     800: chroma("rgb(36,33,107)"),
//     900: chroma("rgb(30,28,74)"),
//     950: chroma("rgb(23,21,55)")
// }

