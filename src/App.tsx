import { framer, useIsAllowedTo, type CustomCode } from "@framer/plugin"
import { useEffect, useState } from "react"
import "./App.css"
import {
    buildSnippet,
    DEFAULT_MODULES,
    MODULES,
    parseSnippet,
    validateSiteId,
    type ModuleId,
} from "./tracker.ts"

const LOCATION = "headEnd" as const
const DOCS_URL = "https://privatusanalytics.com/docs/install/framer"
const SIGNUP_URL = "https://privatusanalytics.com/users/sign_up?ref=framer"

void framer.showUI({ position: "top right", width: 320, height: 460 })

function useCustomCode(): CustomCode | null {
    const [code, setCode] = useState<CustomCode | null>(null)
    useEffect(() => framer.subscribeToCustomCode(setCode), [])
    return code
}

export function App() {
    const customCode = useCustomCode()
    const allowed = useIsAllowedTo("setCustomCode")
    const slot = customCode?.[LOCATION]
    const installed = parseSnippet(slot?.html)
    const disabledByUser = Boolean(slot?.disabled)

    const [siteId, setSiteId] = useState("")
    const [modules, setModules] = useState<ModuleId[]>(DEFAULT_MODULES)
    const [touched, setTouched] = useState(false)
    const [busy, setBusy] = useState(false)
    const [message, setMessage] = useState<string | null>(null)
    const [loaded, setLoaded] = useState(false)

    // Fill the form from what is already installed, once.
    useEffect(() => {
        if (customCode && !loaded) {
            setLoaded(true)
            if (installed) {
                setSiteId(installed.siteId)
                setModules(installed.modules)
            }
        }
    }, [customCode, loaded, installed])

    const error = validateSiteId(siteId)
    const showError = touched && error

    const toggle = (id: ModuleId) =>
        setModules(current => (current.includes(id) ? current.filter(m => m !== id) : [...current, id]))

    async function save() {
        setTouched(true)
        if (error) return
        setBusy(true)
        setMessage(null)
        try {
            await framer.setCustomCode({ html: buildSnippet({ siteId, modules }), location: LOCATION })
            setMessage("Saved. Publish your site to start counting visits.")
        } catch (e) {
            setMessage(e instanceof Error ? e.message : "Could not save. Try again.")
        } finally {
            setBusy(false)
        }
    }

    async function remove() {
        setBusy(true)
        setMessage(null)
        try {
            await framer.setCustomCode({ html: null, location: LOCATION })
            setMessage("Removed. Publish your site to stop counting visits.")
        } catch (e) {
            setMessage(e instanceof Error ? e.message : "Could not remove. Try again.")
        } finally {
            setBusy(false)
        }
    }

    const status = !customCode
        ? { tone: "muted", text: "Checking..." }
        : disabledByUser
          ? {
                tone: "warn",
                text: "Plugin custom code is turned off in your site settings. Turn it back on under Site Settings, General, Plugin custom code. A plugin cannot do this for you.",
            }
          : installed
            ? { tone: "ok", text: `Installed for ${installed.siteId}. Publish to apply changes.` }
            : { tone: "muted", text: "Not installed yet." }

    return (
        <main>
            <header>
                <img src="/icon.svg" alt="" width={28} height={28} />
                <div>
                    <h1>Privatus Analytics</h1>
                    <p className="sub">Cookieless web analytics.</p>
                </div>
            </header>

            <div className={`status ${status.tone}`} role="status">
                {status.text}
            </div>

            <label className="field">
                <span>Site ID</span>
                <input
                    type="text"
                    placeholder="pa_7Q2K9XH3AB"
                    value={siteId}
                    spellCheck={false}
                    autoComplete="off"
                    onChange={e => setSiteId(e.target.value)}
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

            <div className="actions">
                <button className="framer-button-primary" onClick={save} disabled={busy || !allowed}>
                    {installed ? "Update" : "Install"}
                </button>
                {installed ? (
                    <button onClick={remove} disabled={busy || !allowed}>
                        Remove
                    </button>
                ) : null}
            </div>

            {!allowed ? <small className="error">You do not have permission to edit custom code in this project.</small> : null}
            {message ? <small className="note">{message}</small> : null}

            <footer>
                Framer custom code needs a paid site plan. Your framer.app preview domain is not counted unless you
                add it to your site's domains. Only the Privatus Analytics tracker tag is added, to the end of the head.{" "}
                <a href={DOCS_URL} target="_blank" rel="noreferrer">
                    Setup guide
                </a>
            </footer>
        </main>
    )
}
