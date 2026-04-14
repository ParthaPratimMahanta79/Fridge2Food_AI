import { useState, useEffect } from 'react'
import './App.css'

const XP_PER_LEVEL = 100

function App() {
  const [ingredients, setIngredients] = useState([])
  const [input, setInput] = useState('')
  const [xp, setXp] = useState(0)
  const [recipes, setRecipes] = useState(null)
  const [loading, setLoading] = useState(false)

  const level = Math.floor(xp / XP_PER_LEVEL) + 1
  const xpProgress = xp % XP_PER_LEVEL

  const questTarget = 3
  const questDone = ingredients.length >= questTarget

  function addIngredient() {
    const trimmed = input.trim()
    if (!trimmed) return
    const newItems = trimmed.split(',').map(s => s.trim()).filter(Boolean)
    setIngredients(prev => {
      const merged = [...new Set([...prev, ...newItems])]
      return merged
    })
    setXp(prev => prev + newItems.length * 10)
    setInput('')
  }

  function removeIngredient(item) {
    setIngredients(prev => prev.filter(i => i !== item))
  }

async function discoverRecipes() {
  if (ingredients.length < questTarget) return
  setLoading(true)
  setRecipes(null)
  try {
    const response = await fetch('https://fridge2food-ai.onrender.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients: ingredients.join(', ') })
    })
    const data = await response.json()
    // your backend returns { options: [{ dish, steps }] }
    const mapped = data.options.map(o => ({
      name: o.dish,
      description: o.steps.slice(0, 2).join(' → '),
      time: '',
      difficulty: ''
    }))
    setRecipes(mapped)
    setXp(prev => prev + 30)
  } catch (e) {
    setRecipes([{ name: 'Error', description: 'Could not load recipes. Try again.', time: '', difficulty: '' }])
  }
  setLoading(false)
}

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-left">
          <div className="avatar">A</div>
          <span className="app-name">Fridge2Food AI</span>
        </div>
        <div className="xp-bar-wrapper">
          <span className="level-label">LVL {level}</span>
          <div className="xp-track">
            <div className="xp-fill" style={{ width: `${xpProgress}%` }} />
          </div>
          <span className="xp-label">{xp} XP</span>
        </div>
      </header>

      <main className="main">
        <div className="hero-icon">
          <PanIcon />
        </div>

        <h1 className="hero-title">What's in your fridge?</h1>
        <p className="hero-sub">Add ingredients. Unlock recipes. Level up your cooking.</p>

        <div className={`quest-banner ${questDone ? 'done' : ''}`}>
          <span className="quest-badge">ACTIVE QUEST</span>
          {questDone
            ? <span>Quest complete! Hit Discover Recipes below.</span>
            : <span>Add <strong>{questTarget - ingredients.length}</strong> more ingredient{questTarget - ingredients.length !== 1 ? 's' : ''} to unlock AI recipe generation</span>
          }
        </div>

        <div className="inventory-card">
          <p className="inventory-label">INGREDIENTS INVENTORY</p>
          <div className="input-row">
            <input
              className="ingredient-input"
              placeholder="chicken, garlic, lemon..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addIngredient()}
            />
            <button className="add-btn" onClick={addIngredient}>+ Add</button>
          </div>

          {ingredients.length > 0 && (
            <div className="tags">
              {ingredients.map(item => (
                <span key={item} className="tag">
                  {item}
                  <button className="tag-remove" onClick={() => removeIngredient(item)}>×</button>
                </span>
              ))}
            </div>
          )}
        </div>

        <button
          className={`discover-btn ${!questDone ? 'locked' : ''}`}
          onClick={discoverRecipes}
          disabled={!questDone || loading}
        >
          {loading ? 'Finding recipes...' : 'Discover Recipes'}
        </button>

        {recipes && (
          <div className="recipes">
            {recipes.map((r, i) => (
              <div key={i} className="recipe-card">
                <div className="recipe-top">
                  <span className="recipe-name">{r.name}</span>
                  <div className="recipe-meta">
                    {r.time && <span className="meta-pill">{r.time}</span>}
                    {r.difficulty && <span className="meta-pill">{r.difficulty}</span>}
                  </div>
                </div>
                <p className="recipe-desc">{r.description}</p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

function PanIcon() {
  return (
    <svg viewBox="0 0 80 80" width="80" height="80" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="38" cy="46" rx="26" ry="14" fill="#2a2a2a" stroke="#444" strokeWidth="2"/>
      <rect x="62" y="42" width="14" height="6" rx="3" fill="#333" stroke="#444" strokeWidth="1.5"/>
      <ellipse cx="38" cy="44" rx="22" ry="10" fill="#1a1a1a"/>
      <ellipse cx="38" cy="43" rx="16" ry="6" fill="#111" opacity="0.6"/>
      <g className="steam">
        <path d="M30 36 Q28 30 30 24 Q32 18 30 12" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" className="steam1"/>
        <path d="M38 34 Q36 28 38 22 Q40 16 38 10" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" className="steam2"/>
        <path d="M46 36 Q44 30 46 24 Q48 18 46 12" stroke="#555" strokeWidth="2" fill="none" strokeLinecap="round" className="steam3"/>
      </g>
    </svg>
  )
}

export default App