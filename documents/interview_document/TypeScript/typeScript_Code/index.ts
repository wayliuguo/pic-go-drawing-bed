function getFirstLetter(s: string | null) {
    if (s === null) {
        return ''
    }
    return s.charAt(0)
    // return s?.charAt(0)
}