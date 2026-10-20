// Pure helpers: build, parse and validate the Privatus Analytics tracker tag.
// No Framer imports here so the logic is unit-testable in plain Node.

export const TRACKER_HOST = "privatusstats.com"
export const TRACKER_SRC = `https://${TRACKER_HOST}/js/pa.js`
export const SITE_ID_PATTERN = /^pa_[A-Za-z0-9]+$/

export const MODULES = [
    { id: "engage", label: "Time on page and scroll depth" },
    { id: "auto", label: "Outbound links, downloads, forms and 404s" },
    { id: "vitals", label: "Web Vitals" },
    { id: "clicks", label: "Click maps" },
    { id: "ask", label: "On-site surveys" },
] as const

export type ModuleId = (typeof MODULES)[number]["id"]

export const DEFAULT_MODULES: ModuleId[] = MODULES.map(m => m.id)

export interface Settings {
    siteId: string
    modules: ModuleId[]
}

export function normalizeSiteId(input: string): string {
    return input.trim()
}

/** Returns an error message, or null when the id looks right. */
export function validateSiteId(input: string): string | null {
    const value = normalizeSiteId(input)
    if (value === "") return "Enter your site ID."
    if (/^<script/i.test(value) || value.includes("data-site")) {
        return "Paste only the site ID, not the whole snippet."
    }
    if (!SITE_ID_PATTERN.test(value)) {
        return "A site ID starts with pa_ followed by letters and numbers, for example pa_7Q2K9XH3AB."
    }
    return null
}

function escapeAttr(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/"/g, "&quot;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
}

function orderedModules(modules: readonly string[]): ModuleId[] {
    return MODULES.map(m => m.id).filter(id => modules.includes(id))
}

/** The exact tag installed at the end of the head. Throws on an invalid site id. */
export function buildSnippet(settings: Settings): string {
    const error = validateSiteId(settings.siteId)
    if (error) throw new Error(error)
    const siteId = escapeAttr(normalizeSiteId(settings.siteId))
    const modules = orderedModules(settings.modules).join(",")
    return `<script defer src="${TRACKER_SRC}" data-site="${siteId}" data-modules="${modules}"></script>`
}

function attr(html: string, name: string): string | null {
    const match = html.match(new RegExp(`\\s${name}="([^"]*)"`))
    return match ? match[1] : null
}

/** Reads settings back from HTML this plugin installed. Null when it is not ours. */
export function parseSnippet(html: string | null | undefined): Settings | null {
    if (!html) return null
    if (!html.includes(`${TRACKER_HOST}/js/pa.js`)) return null
    const siteId = attr(html, "data-site")
    if (!siteId || !SITE_ID_PATTERN.test(siteId)) return null
    const modules = (attr(html, "data-modules") ?? "")
        .split(",")
        .map(m => m.trim())
        .filter(Boolean)
    return { siteId, modules: orderedModules(modules) }
}
