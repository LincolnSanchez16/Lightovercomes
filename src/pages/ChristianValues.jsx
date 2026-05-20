import { useEffect, useRef, useState } from 'react'
import panoBibleImage from '../assets/images/panobible.jpeg'
import {
  christianValueCategories,
  christianValuesIntro,
  christianValuesLibraryCards,
} from '../data/siteContent'

const CATEGORY_SWITCH_MS = 220

function ChristianValues() {
  const initialCategory = christianValueCategories[0]?.slug ?? ''
  const [selectedValue, setSelectedValue] = useState(null)
  const [modalImageFailed, setModalImageFailed] = useState(false)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [isCategorySwitching, setIsCategorySwitching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const cardsRef = useRef([])
  const switchTimerRef = useRef(null)
  const normalizedSearchQuery = searchQuery.trim().toLowerCase()
  const isSearching = normalizedSearchQuery.length > 0

  const activeCategoryData =
    christianValueCategories.find((category) => category.slug === activeCategory) ??
    christianValueCategories[0]

  const activeValues = christianValuesLibraryCards.filter(
    (value) => value.categorySlug === activeCategoryData.slug,
  )
  const searchResults = christianValuesLibraryCards.filter((value) =>
    value.title.toLowerCase().includes(normalizedSearchQuery),
  )
  const displayedValues = isSearching ? searchResults : activeValues

  useEffect(() => {
    return () => {
      if (switchTimerRef.current) {
        window.clearTimeout(switchTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!selectedValue) {
      return undefined
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedValue(null)
      }
    }

    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = overflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [selectedValue])

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('value-card-visible')
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.15,
        rootMargin: '0px 0px -8% 0px',
      },
    )

    cards.forEach((card) => {
      card.classList.remove('value-card-visible')
      observer.observe(card)
    })

    return () => {
      observer.disconnect()
    }
  }, [activeCategory, searchQuery])

  const handleCategorySelect = (categorySlug) => {
    if (categorySlug === activeCategory || isCategorySwitching) {
      return
    }

    setIsCategorySwitching(true)

    if (switchTimerRef.current) {
      window.clearTimeout(switchTimerRef.current)
    }

    switchTimerRef.current = window.setTimeout(() => {
      cardsRef.current = []
      setActiveCategory(categorySlug)
      window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
          setIsCategorySwitching(false)
        })
      })
    }, CATEGORY_SWITCH_MS)
  }

  return (
    <>
      <div className="values-banner">
        <img
          className="values-banner-image"
          src={panoBibleImage}
          alt=""
        />
        <div className="values-banner-overlay" />
        <div className="values-intro values-intro-hero">
          <span className="eyebrow">{christianValuesIntro.eyebrow}</span>
          <h1>{christianValuesIntro.title}</h1>
          <p>{christianValuesIntro.description}</p>
        </div>
      </div>

      <section className="values-page">
        <nav className="values-category-nav" aria-label="Christian values categories">
          <div className="values-category-nav-track">
            <div className="values-search">
              <label className="values-search-label" htmlFor="values-search-input">
                Search Values
              </label>
              <input
                id="values-search-input"
                className="values-search-input"
                type="search"
                value={searchQuery}
                placeholder="Search by title"
                onChange={(event) => {
                  cardsRef.current = []
                  setSearchQuery(event.target.value)
                }}
              />
            </div>

            {christianValueCategories.map((category) => (
              <button
                key={category.slug}
                type="button"
                className={
                  activeCategory === category.slug
                    ? 'values-category-nav-link values-category-nav-link-active'
                    : 'values-category-nav-link'
                }
                onClick={() => handleCategorySelect(category.slug)}
              >
                <span className="values-category-nav-title">{category.title}</span>
                <span className="values-category-nav-range">{category.rangeLabel}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="values-library values-library-single">
          <section className="values-category-section values-category-section-active">
            <div className="values-category-header">
              <div>
                <span className="values-category-range">
                  {isSearching ? `${searchResults.length} found` : activeCategoryData.rangeLabel}
                </span>
                <h2>{isSearching ? 'Search Results' : activeCategoryData.title}</h2>
              </div>
              <p>
                {isSearching
                  ? 'Matches are based only on value titles.'
                  : activeCategoryData.description}
              </p>
            </div>

            {displayedValues.length ? (
              <div
                className={
                  isCategorySwitching && !isSearching
                    ? 'values-grid-shell values-grid-shell-switching'
                    : 'values-grid-shell'
                }
              >
                <div
                  className="values-grid"
                  key={isSearching ? `search-${normalizedSearchQuery}` : activeCategory}
                >
                  {displayedValues.map((value, index) => (
                    <ValueCard
                      key={value.id}
                      value={value}
                      refCallback={(element) => {
                        cardsRef.current[index] = element
                      }}
                      transitionDelay={`${Math.min(index * 25, 160)}ms`}
                      onSelect={() => {
                        setModalImageFailed(false)
                        setSelectedValue(value)
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <p className="values-empty-state">No values found.</p>
            )}
          </section>
        </div>
      </section>

      {selectedValue ? (
        <div
          aria-hidden="true"
          className="value-modal-backdrop"
          onClick={() => setSelectedValue(null)}
        >
          <div
            aria-labelledby="value-modal-title"
            aria-modal="true"
            className="value-modal"
            role="dialog"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="value-modal-header">
              <span className="value-modal-label">Christian Value</span>
              <button
                aria-label={`Close ${selectedValue.title} details`}
                className="value-modal-close"
                type="button"
                onClick={() => setSelectedValue(null)}
              >
                Close
              </button>
            </div>

            {selectedValue.imageFull && !modalImageFailed ? (
              <div className="value-modal-image-frame">
                <img
                  className="value-modal-image"
                  src={selectedValue.imageFull}
                  alt={selectedValue.title}
                  decoding="async"
                  onError={() => setModalImageFailed(true)}
                />
              </div>
            ) : (
              <div className="value-modal-placeholder">
                <span className="value-modal-placeholder-index">{selectedValue.id}</span>
                <div>
                  <h2 id="value-modal-title">{selectedValue.title}</h2>
                  <p className="value-modal-placeholder-copy">
                    Content preview unavailable.
                  </p>
                </div>
              </div>
            )}

            {selectedValue.imageFull && !modalImageFailed ? (
              <h2 id="value-modal-title">{selectedValue.title}</h2>
            ) : null}

            <div className="value-modal-section">
              <span className="value-modal-section-label">Category</span>
              <p className="value-modal-description">{selectedValue.category}</p>
            </div>

            {selectedValue.verses.length ? (
              <div className="value-modal-section">
                <span className="value-modal-section-label">Scripture</span>
                <div className="value-modal-verses">
                  {selectedValue.verses.map((verse) => (
                    <span key={verse} className="value-modal-verse-pill">
                      {verse}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}

            {selectedValue.description ? (
              <div className="value-modal-section">
                <span className="value-modal-section-label">Meaning</span>
                <p className="value-modal-description">{selectedValue.description}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  )
}

function ValueCard({ value, refCallback, transitionDelay, onSelect }) {
  const [imageFailed, setImageFailed] = useState(false)
  const showImage = value.imageThumb && !imageFailed

  return (
    <button
      type="button"
      className="value-card value-card-library"
      ref={refCallback}
      style={{ transitionDelay }}
      onClick={onSelect}
    >
      {showImage ? (
        <div className="value-card-image-frame">
          <img
            className="value-card-image"
            src={value.imageThumb}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <div className="value-card-image-frame value-card-image-fallback">
          Content preview unavailable
        </div>
      )}
      <span className="value-card-index">{value.id}</span>
      <div className="value-card-body">
        <h3>{value.title}</h3>
        {value.description ? <p>{value.description}</p> : null}
      </div>
    </button>
  )
}

export default ChristianValues
