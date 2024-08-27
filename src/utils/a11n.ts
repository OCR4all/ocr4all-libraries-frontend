export function setFontSize(size: string) {
    localStorage.setItem("ocr4all/frontend/a11n/font-size", size)
    document.documentElement.style.setProperty(
        "--base-font-size",
        size,
    );
}

export function setFontSizeFromStorage() {
    const size = localStorage.getItem("ocr4all/frontend/a11n/font-size")
    document.documentElement.style.setProperty(
        "--base-font-size",
        size,
    );
}