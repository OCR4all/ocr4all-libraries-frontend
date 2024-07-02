import chroma from 'chroma-js';

export const getColor = (color) => chroma(color);

export const getPalette = (color) => {
  const colors = chroma.scale(['white', color, 'black']);
  const palette = [];

  // Create 50
  palette.push(colors(0.05).hex());

  // Create 100-900
  for (let i = 0.1; i < 1.0; i += 0.1) {
    palette.push(colors(i).hex());
  }
  return palette;
};

export const isValid = (color) => chroma.valid(color);

export const getCodeString = (color, name = 'myColor') => {
  const palette = getPalette(color);
  const json = {
    theme: {
      extend: {
        colors: {
          [name]: {
            50: palette[0],
            100: palette[1],
            200: palette[2],
            300: palette[3],
            400: palette[4],
            500: palette[5],
            600: palette[6],
            700: palette[7],
            800: palette[8],
            900: palette[9],
          },
        },
      },
    },
  };
  return `module.exports = ${JSON.stringify(json, null, 2)}`;
};
