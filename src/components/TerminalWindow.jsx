export default function TerminalWindow({ title, children, className = '' }) {
  return (
    <div className={`terminal-window ${className}`.trim()}>
      <div className="terminal-bar">
        <div className="window-dots" aria-hidden="true">
          <span className="window-dot red" />
          <span className="window-dot yellow" />
          <span className="window-dot green-dot" />
        </div>
        <div className="terminal-title">
          <span className="terminal-title__prompt">abbos@dev:</span>
          <span>{title}</span>
        </div>
        <div className="terminal-runtime" aria-hidden="true">
          <span>UTF-8</span>
          <i />
          <span>ONLINE</span>
        </div>
      </div>
      {children}
    </div>
  )
}
