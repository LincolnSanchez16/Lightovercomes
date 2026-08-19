import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import valuesResourceImage from '../assets/images/lightochero.jpeg'
import panoBibleImage from '../assets/images/panobible.jpeg'
import {
  christianValueCategories,
  christianValuesIntro,
  christianValuesLibraryCards,
} from '../data/siteContent'
import ResourceClaimDialog from '../components/resources/ResourceClaimDialog'

const CATEGORY_SWITCH_MS = 220

function ChristianValues() {
  const initialCategory = christianValueCategories[0]?.slug ?? ''
  const [selectedValue, setSelectedValue] = useState(null)
  const [modalImageAttempt, setModalImageAttempt] = useState(0)
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [isCategorySwitching, setIsCategorySwitching] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [canScrollCategoriesLeft, setCanScrollCategoriesLeft] = useState(false)
  const [canScrollCategoriesRight, setCanScrollCategoriesRight] = useState(true)
  const [isResourceClaimOpen, setIsResourceClaimOpen] = useState(false)
  const cardsRef = useRef([])
  const categoryNavRef = useRef(null)
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
  const modalImageSources = selectedValue
    ? Array.from(new Set([selectedValue.imageFull, selectedValue.imageThumb].filter(Boolean)))
    : []
  const closeResourceClaim = useCallback(() => setIsResourceClaimOpen(false), [])

  useEffect(() => {
    const categoryNav = categoryNavRef.current

    if (!categoryNav) {
      return undefined
    }

    const updateScrollControls = () => {
      const maxScrollLeft = categoryNav.scrollWidth - categoryNav.clientWidth
      setCanScrollCategoriesLeft(categoryNav.scrollLeft > 8)
      setCanScrollCategoriesRight(categoryNav.scrollLeft < maxScrollLeft - 8)
    }

    updateScrollControls()
    categoryNav.addEventListener('scroll', updateScrollControls, { passive: true })
    window.addEventListener('resize', updateScrollControls)

    return () => {
      categoryNav.removeEventListener('scroll', updateScrollControls)
      window.removeEventListener('resize', updateScrollControls)
    }
  }, [])

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

  const scrollCategories = (direction) => {
    const categoryNav = categoryNavRef.current

    if (!categoryNav) {
      return
    }

    categoryNav.scrollBy({
      left: direction * Math.max(categoryNav.clientWidth * 0.72, 280),
      behavior: 'smooth',
    })
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
        </div>
      </div>

      <section className="values-page">
        <div className="values-category-shell">
          <nav className="values-category-nav" aria-label="Christian values categories">
            <div className="values-category-nav-header">
              <span>Explore Christian Life Values</span>
              <div className="values-category-nav-controls" aria-label="Browse value categories">
                <button
                  type="button"
                  aria-label="Previous value categories"
                  disabled={!canScrollCategoriesLeft}
                  onClick={() => scrollCategories(-1)}
                >
                  <ChevronLeft aria-hidden="true" />
                </button>
                <button
                  type="button"
                  aria-label="Next value categories"
                  disabled={!canScrollCategoriesRight}
                  onClick={() => scrollCategories(1)}
                >
                  <ChevronRight aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="values-category-nav-track" ref={categoryNavRef}>
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
        </div>

        <div className="values-library values-library-single">
          <section className="values-category-section values-category-section-active">
            <div className="values-category-header">
              <div className="values-category-header-copy">
                <span className="values-category-range">
                  {isSearching ? `${searchResults.length} found` : activeCategoryData.rangeLabel}
                </span>
                <h2>{isSearching ? 'Search Results' : activeCategoryData.title}</h2>
                <p>
                  {isSearching
                    ? 'Matches are based only on value titles.'
                    : activeCategoryData.description}
                </p>
              </div>

              <aside className="values-resource-cta" aria-labelledby="values-resource-cta-title">
                <h2 id="values-resource-cta-title">Get the full free resource.</h2>
                <button type="button" onClick={() => setIsResourceClaimOpen(true)}>
                  Claim this resource
                </button>
              </aside>
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
                        setModalImageAttempt(0)
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

        <aside
          className="values-resource-footer-cta"
          aria-labelledby="values-resource-footer-cta-title"
        >
          <div className="values-resource-footer-cta-media" aria-hidden="true">
            <img src={valuesResourceImage} alt="" />
            <div className="values-resource-footer-cta-overlay" />
          </div>
          <div className="values-resource-footer-cta-inner">
            <h2 id="values-resource-footer-cta-title">Get the full free resource.</h2>
            <button type="button" onClick={() => setIsResourceClaimOpen(true)}>
              Claim this resource
            </button>
          </div>
        </aside>
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

            {modalImageSources[modalImageAttempt] ? (
              <div className="value-modal-image-frame">
                <img
                  className="value-modal-image"
                  src={modalImageSources[modalImageAttempt]}
                  alt={selectedValue.title}
                  decoding="async"
                  onError={() => setModalImageAttempt((attempt) => attempt + 1)}
                />
              </div>
            ) : (
              <div className="value-modal-placeholder">
                <span className="value-modal-placeholder-index">{selectedValue.id}</span>
                <div>
                  <h2 id="value-modal-title">{selectedValue.title}</h2>
                  <p className="value-modal-placeholder-copy">
                    Explore this Christian life value through its Scripture and meaning below.
                  </p>
                </div>
              </div>
            )}

            {modalImageSources[modalImageAttempt] ? (
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

      <ResourceClaimDialog
        isOpen={isResourceClaimOpen}
        onClose={closeResourceClaim}
      />
    </>
  )
}

function ValueCard({ value, refCallback, transitionDelay, onSelect }) {
  const [imageAttempt, setImageAttempt] = useState(0)
  const imageSources = Array.from(
    new Set([value.imageThumb, value.imageFull].filter(Boolean)),
  )
  const imageSrc = imageSources[imageAttempt]

  return (
    <button
      type="button"
      className="value-card value-card-library"
      ref={refCallback}
      style={{ transitionDelay }}
      onClick={onSelect}
    >
      {imageSrc ? (
        <div className="value-card-image-frame">
          <img
            className="value-card-image"
            src={imageSrc}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setImageAttempt((attempt) => attempt + 1)}
          />
        </div>
      ) : (
        <div className="value-card-image-frame value-card-image-fallback">
          <span>Christian Life Value</span>
          <strong>{value.title}</strong>
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
