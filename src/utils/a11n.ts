interface IEntry {
    name: string,
    value: string
}

export function setFont(entry: IEntry) {
    useStorage("ocr4all/frontend/a11n/font", entry)
    document.documentElement.style.setProperty(
        "--font-family",
        entry.value,
    );
}

export function setFontFromStorage() {
    const size = useStorage("ocr4all/frontend/a11n/font", {
        name: "Regular",
        value: "Inter var"
    })
    document.documentElement.style.setProperty(
        "--font-family",
        size.value.value,
    );
}

export function setFontSize(entry: IEntry) {
    useStorage("ocr4all/frontend/a11n/font-size", entry)
    document.documentElement.style.setProperty(
        "--base-font-size",
        entry.value,
    );
}

export function setFontSizeFromStorage() {
    const size = useStorage("ocr4all/frontend/a11n/font-size", {
        name: "Medium",
        value: "14px",
    })
    document.documentElement.style.setProperty(
        "--base-font-size",
        size.value.value,
    );
}

export function setGrayscale(entry: IEntry) {
    useStorage("ocr4all/frontend/a11n/grayscale", entry)
    document.documentElement.style.setProperty(
      "--grayscale-filter",
      entry.value,
    );
}

export function setGrayscaleFromStorage() {
    const size = useStorage("ocr4all/frontend/a11n/grayscale",
      {
          name: "Deactivated",
          value: "grayscale(0)"
      })
    document.documentElement.style.setProperty(
      "--grayscale-filter",
      size.value.value,
    );
}
