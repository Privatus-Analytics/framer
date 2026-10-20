import { describe, expect, it } from "vitest"
import { buildSnippet, DEFAULT_MODULES, parseSnippet, validateSiteId } from "./tracker.ts"

describe("validateSiteId", () => {
    it("accepts a normal id, trimming whitespace", () => {
        expect(validateSiteId("pa_7Q2K9XH3AB")).toBeNull()
        expect(validateSiteId("  pa_7Q2K9XH3AB \n")).toBeNull()
    })
    it("rejects empty, wrong prefix and bad characters", () => {
        expect(validateSiteId("")).not.toBeNull()
        expect(validateSiteId("7Q2K9XH3AB")).not.toBeNull()
        expect(validateSiteId("pa_")).not.toBeNull()
        expect(validateSiteId('pa_x" onload="x')).not.toBeNull()
        expect(validateSiteId("pa_abc def")).not.toBeNull()
    })
    it("tells people who paste the whole snippet", () => {
        expect(validateSiteId('<script defer data-site="pa_ABC"></script>')).toMatch(/only the site ID/)
    })
})

describe("buildSnippet", () => {
    it("builds the documented tag", () => {
        expect(buildSnippet({ siteId: "pa_ABC123", modules: DEFAULT_MODULES })).toBe(
            '<script defer src="https://privatusstats.com/js/pa.js" data-site="pa_ABC123" data-modules="engage,auto,vitals,clicks,ask"></script>'
        )
    })
    it("keeps module order stable and drops unknown modules", () => {
        const html = buildSnippet({ siteId: "pa_ABC123", modules: ["clicks", "engage", "bogus" as never] })
        expect(html).toContain('data-modules="engage,clicks"')
    })
    it("emits an empty modules attribute when none are chosen", () => {
        expect(buildSnippet({ siteId: "pa_ABC123", modules: [] })).toContain('data-modules=""')
    })
    it("throws for an invalid id", () => {
        expect(() => buildSnippet({ siteId: "nope", modules: [] })).toThrow()
    })
})

describe("parseSnippet", () => {
    it("round-trips", () => {
        const settings = { siteId: "pa_ABC123", modules: ["engage" as const, "vitals" as const] }
        expect(parseSnippet(buildSnippet(settings))).toEqual(settings)
    })
    it("ignores other HTML and empty values", () => {
        expect(parseSnippet(null)).toBeNull()
        expect(parseSnippet("")).toBeNull()
        expect(parseSnippet('<script src="https://example.com/a.js" data-site="pa_ABC"></script>')).toBeNull()
    })
})
