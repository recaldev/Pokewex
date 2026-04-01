import '../styles/Header.css'

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        <div className="header-logo">
          <span className="header-pokeball" aria-hidden="true">
            <span className="pokeball-top" />
            <span className="pokeball-middle" />
            <span className="pokeball-bottom" />
          </span>
          <span className="header-title">Pokédex</span>
        </div>
      </div>
    </header>
  )
}
