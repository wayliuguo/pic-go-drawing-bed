type MyRecord<K extends keyof any, T> = {
    [P in K]: T
}

interface PageInfo {
    title: string;
}
type Page = "home" | "about" | "contact"
type pageRecord = Record<Page, PageInfo>
/* type pageRecord = {
    home: PageInfo;
    about: PageInfo;
    contact: PageInfo;
} */
const x: Record<Page, PageInfo> = {
    about: {
        title: "about"
    },
    home: {
        title: "home"
    },
    contact: {
        title: "contact"
    }
}