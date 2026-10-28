import { framer } from "@framer/plugin"
import { useRef, useState } from "react"
import "./App.css"
import { buildSnippet, DEFAULT_MODULES, MODULES, validateSiteId, type ModuleId } from "./tracker.ts"

const DOCS_URL = "https://privatusanalytics.com/docs/install/framer"
const SIGNUP_URL = "https://privatusanalytics.com/users/sign_up?ref=framer"

void framer.showUI({ position: "top right", width: 320, height: 560 })

// This plugin never changes the project and never sends anything anywhere.
// It builds the tag, copies it, and shows where to paste it in Site Settings.
export function App() {
    const [siteId, setSiteId] = useState("")
    const [modules, setModules] = useState<ModuleId[]>(DEFAULT_MODULES)
    const [touched, setTouched] = useState(false)
    const [copied, setCopied] = useState(false)
    const snippetRef = useRef<HTMLTextAreaElement>(null)

    const error = validateSiteId(siteId)
    const showError = touched && error
    const snippet = error ? "" : buildSnippet({ siteId, modules })

    const toggle = (id: ModuleId) => {
        setCopied(false)
        setModules(current => (current.includes(id) ? current.filter(m => m !== id) : [...current, id]))
    }

    async function copy() {
        setTouched(true)
        if (error) return
        try {
            await navigator.clipboard.writeText(snippet)
        } catch {
            // Clipboard can be blocked inside the plugin window: select the text so Cmd+C works.
            snippetRef.current?.select()
            document.execCommand("copy")
        }
        setCopied(true)
        framer.notify("Snippet copied. Paste it in Site Settings, Custom Code.", { variant: "success" })
    }

    return (
        <main>
            <header>
                <img src="/icon.svg" alt="" width={28} height={28} />
                <div>
                    <h1>Privatus Analytics</h1>
                    <p className="sub">Cookieless web analytics.</p>
                </div>
            </header>

            <label className="field">
                <span>Site ID</span>
                <input
                    type="text"
                    placeholder="pa_7Q2K9XH3AB"
                    value={siteId}
                    spellCheck={false}
                    autoComplete="off"
                    onChange={e => {
                        setCopied(false)
                        setSiteId(e.target.value)
                    }}
                    onBlur={() => setTouched(true)}
                    aria-invalid={Boolean(showError)}
                />
                {showError ? <small className="error">{error}</small> : null}
                <small className="hint">
                    Find it in Privatus Analytics under Site settings. It is not a secret.{" "}
                    <a href={SIGNUP_URL} target="_blank" rel="noreferrer">
                        Need an account?
                    </a>
                </small>
            </label>

            <fieldset>
                <legend>Measure</legend>
                {MODULES.map(m => (
                    <label key={m.id} className="check">
                        <input type="checkbox" checked={modules.includes(m.id)} onChange={() => toggle(m.id)} />
                        <span>{m.label}</span>
                    </label>
                ))}
            </fieldset>

            <textarea
                ref={snippetRef}
                className="snippet"
                readOnly
                rows={4}
                value={snippet}
                placeholder="Your snippet shows here once the site ID is right."
                aria-label="Snippet"
            />

            <button className="framer-button-primary" onClick={copy}>
                {copied ? "Copied" : "Copy snippet"}
            </button>

            <ol className="steps">
                <li>Open Site Settings, then General.</li>
                <li>Under Custom Code, paste the snippet in "End of &lt;head&gt; tag".</li>
                <li>Save, then publish your site.</li>
            </ol>

            <footer>
                This plugin does not change your project or send any data. You paste the snippet yourself. Framer custom
                code needs a paid site plan.{" "}
                <a href={DOCS_URL} target="_blank" rel="noreferrer">
                    Setup guide
                </a>
            </footer>
        </main>
    )
}
