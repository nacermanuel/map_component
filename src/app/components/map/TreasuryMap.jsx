import React, { useState, useEffect, useMemo } from 'react';
import './TreasuryMap.css'


const TreasuryMap = () => {
  const mapCenterTitle = 'assets/interactive-map/the-treasury-tech-landscape-title.png';
  const mapBackgroundImage = 'assets/interactive-map/background.webp'

  const categories = {
    'category-1': 'FIDP (Financial Instrument Dealing Platform)',
    'category-2': 'FDF (Financial Data Feeding)',
    'category-3': 'CMA (Currency Management Automation)',
    'category-4': 'Integrators',
    'category-5': 'OTS (Other Treasury Solutions)',
    'category-6': 'TRMS (Treasury Risk Management System)',
    'category-7': 'ERP (Enterprise Resource Planing)',
    'category-8': 'Outsourcing',
    'category-9': 'ETL (Extract Transform Load)',
    'category-10': 'FSC (Financial Supply Chain)',
    'category-11': 'CFF (Cash-Flow Forecasting)',
    'category-12': 'eBAM (electronic Bank Account Management)',
    'category-13': 'BSG (Bank Single gateway)',
    'category-14': 'TR (Treasury Reporting)',
  }

  const [mapData, setMapData] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [selectCategoryOpen, setSelectCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scaleMobileIcons, setScaleMobileIcons] = useState(1);

  const [filtersConfig, setFiltersConfig]= useState({
    keywords: {
      open: false,
      title: 'Keywords',
      placeholder: 'Type keyword',
      allFilters: [],
      selectedFilters: [],
    },
    subcategories: {
      open: false,
      title: 'Sub-Category',
      placeholder: 'Select sub-category',
      allFilters: [],
      selectedFilters: [],
    },
    headequarterLocation: {
      open: false,
      title: 'Headquarter location',
      placeholder: 'Select headquarter location',
      allFilters: [],
      selectedFilters: [],
    },
    activeIn: {
      open: false,
      title: 'Active in',
      placeholder: 'Select active',
      allFilters: [],
      selectedFilters: [],
    },
  });

  const [resettingFrontLogos, setResettingFrontLogos] = useState(false);

  // Your fetchDataFromAPI implementation
  const fetchDataFromAPI = async () => {
    
    const apiUrl = 'https://treasurymapbackend-production.up.railway.app/api/v1/mapdata';
    //const apiUrl = 'data.json';

    return fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        setMapData(data);
        //console.log(data);
        return data;
      })
      .catch(error => {
        console.error('Error fetching data from API:', error);
      });
  };

  const calculateScaleMobileLogos = () => {
    const width = window.innerWidth;
    if (width >= 640) {
      return setScaleMobileIcons(1);
    }
    setScaleMobileIcons(width/640);
  };

  const toggleMobileFilters = () => {
    setMobileOpen((prevMobileOpen) => !prevMobileOpen);
  };  

  const buildFilters = (data) => {
    const filters = {};
    
    Object.keys(filtersConfig).forEach((filterKey) => {
      filters[filterKey] = [];
    });
    data?.forEach((category) => {
      
      category.logos.forEach((logo) => {
        Object.keys(filters).forEach((filterKey) => {
          // Concatenate values for each filter type
          filters[filterKey] = filters[filterKey].concat(logo[filterKey]);
        });
      });
    });

    // Convert to unique and sorted arrays
    Object.keys(filters).forEach((filterKey) => {
      const uniqueValues = [...new Set(filters[filterKey])].sort();
      setFiltersConfig(prevConfig => ({
        ...prevConfig,
        [filterKey]: {
          ...prevConfig[filterKey],
          allFilters: uniqueValues
        }
      }));
    });
  };

  const toggleSelectCategory = () => {
    setSelectCategoryOpen((open) => !open);
  };

  const selectCategory = (key) => {
    if (selectCategoryOpen) {
      toggleSelectCategory();
    }
    setSelectedCategory((prevSelectedCategory) =>
      prevSelectedCategory === key ? '' : key
    );
  };

  const toggleSelectFilters = (filterKey) => {
    setFiltersConfig((prevConfig) => ({
      ...prevConfig,
      [filterKey]: {
        ...prevConfig[filterKey],
        open: !prevConfig[filterKey].open
      }
    }));
  };

  const selectFilter = (key, filter) => {
    setFiltersConfig((prevConfig) => {
      const currentFilters = prevConfig[key];
      if (currentFilters.open) {
        toggleSelectFilters(key);
      }
  
      if (currentFilters.selectedFilters.includes(filter)) {
        const updatedFilters = currentFilters.selectedFilters.filter((selectedFilter) => selectedFilter !== filter);
  
        return {
          ...prevConfig,
          [key]: {
            ...currentFilters,
            selectedFilters: updatedFilters
          }
        };
      }
  
      return {
        ...prevConfig,
        [key]: {
          ...currentFilters,
          selectedFilters: [...currentFilters.selectedFilters, filter]
        }
      };
    });
  };
  
  const clearFilters = (filterKey) => {
    setFiltersConfig((prevConfig) => ({
      ...prevConfig,
      [filterKey]: {
        ...prevConfig[filterKey],
        selectedFilters: []
      }
    }));
  };

  const clearAllFilters = () => {
    setSelectedCategory('');
    setFiltersConfig((prevConfig) => {
      const updatedConfig = { ...prevConfig };
      Object.keys(updatedConfig).forEach((key) => {
        updatedConfig[key].selectedFilters = [];
      });
      return updatedConfig;
    });
  };


  // ESTA FUNCION ES LLAMADA VARIAS VECES DE FORMA ESTATICA 
  // ESTA FUNCION renderCategoryLogos TOMA COMO PARAMETROS "CATEGORY" Y "LOGOCOUNT"
  // PARAMETRO "CATEGORY" ES ENVIADO DE FORMA ESTATICA DESDE EL HTML ESCRITO Y SE ENCARGA DE ESPECIFICAR EL CLASS DE EL DIV PARA 
  // SEGUN ESO DISTRIBUIR LOS LOGOS EN EL ESPACIO PORQUE 
  // EL PARAMETRO "logoCount" ES DEFINIDO MANUALMENTE, LITERALMENTE ES UN NUMERO ESCRITO. ESTE NUMERO UNICAMENTE SIRVE PARA 
  // QUE SEPA CUANTAS ITERACIONES TIENE QUE HACER EL MAP 
  // EL MAP GENERA UN INDEX EN CADA ITERACION Y ES ESE INDEX EL QUE COLOCA EN LA PLANTILLA DE TEXTO DENTRO DE LAS BACKTICKS

  //ESTO QUIERE DECIR QUE PARA QUE ESTE CODIGO FUNCIONE, TIENES QUE TENER CONTROLADO EL NOMBRE CON EL QUE ES ALMACENADO EL LOGO, 
  //DONDE SE MARCA EL NUMERO DE LA CATEGORIA Y EL NUMERO DE LOGO DENTRO DE ESA CATEGORIA

  const renderCategoryLogos = (category, logoCount) => (
    <div className={`category-static ${category}`}>
      {Array.from({ length: logoCount }).map((_, index) => (
        <div key={index}>
          <a href="http://www.example.com" target="_blank">
            <div className="category-logo-wrapper">
              <img
                src={`assets/interactive-map/static-map-logos/${category}-logo-${index + 1}.png`}
                alt="Logo"
              />
            </div>
          </a>
        </div>
      ))}
    </div>
  );
  
  const filteredLogos = useMemo(() => {
    const selectedCategoryKey = selectedCategory;
    const selectedFilters = Object.values(filtersConfig)
      .map((filter) => filter.selectedFilters)
      .flat();
  
    const noCategorySelected = !selectedCategoryKey;
  
    if (noCategorySelected && selectedFilters.length === 0) {
      return [];
    }
  
    const filteredCategories = mapData.filter((category) => {
      // Filter based on selected category
      const matchesCategory = noCategorySelected || category.categoryKey === selectedCategoryKey;
  
      // Filter based on selected filters
      const matchesFilters =
        selectedFilters.length === 0 ||
        category.logos.some((logo) =>
          selectedFilters.every((filter) =>
            logo.keywords.includes(filter) ||
            logo.subcategories.includes(filter) ||
            logo.headequarterLocation.includes(filter) ||
            logo.activeIn.includes(filter)
          )
        );
  
      return matchesCategory && matchesFilters;
    });
  
    // Extract logos from filtered categories
    const logos = filteredCategories.flatMap((category) => category.logos);
  
    return logos;
  }, [selectedCategory, filtersConfig, mapData]);

  const frontMapOpen = useMemo(() => {
    return selectedCategory || filteredLogos.length;
  }, [selectedCategory, filteredLogos]);
  

  useEffect(() => {
    const startMap = async () => {
      const data = await fetchDataFromAPI();
      buildFilters(data);
      setTimeout(() => {
        setLoaded(true);
      }, 100);
    };

    startMap();

    window.addEventListener('resize', calculateScaleMobileLogos);

    return () => {
      window.removeEventListener('resize', calculateScaleMobileLogos);
    };
  }, []);

  useEffect(() => {
    if (filteredLogos.length && !resettingFrontLogos) {
      setResettingFrontLogos(true);
      setTimeout(() => {
        setResettingFrontLogos(false);
      }, 120);
    }
  }, [filteredLogos]);

  return (
    <div className="wrapper">
      <div id="interactive-map">
        <div className={`interactive-map-wrapper ${loaded ? 'loaded' : ''}`} style={{ backgroundImage: `url(${mapBackgroundImage})` }}>
          <div className={`interactive-map-inner ${frontMapOpen ? 'front-open' : ''}`}>
            <div className="map-title-wrapper">
              <img className="map-title" src={mapCenterTitle} alt="" />
            </div>
            <div className="map-static-logos">
              <div className="dividers">
                {Array.from({ length: 15 }).map((_, index) => (
                  <div key={index}><span></span></div>
                ))}
              </div>

              {/*  "MANUALMENTE" COLOCA CADA UNA DE LAS CATEGORIAS PATA QUE EJECUTE LA FUNCION RENDERCATEGORYLOGOS*/}

              {renderCategoryLogos('category-1', 11)}
              {renderCategoryLogos('category-2', 5)}
              {renderCategoryLogos('category-3', 5)}
              {renderCategoryLogos('category-4', 9)}
              {renderCategoryLogos('category-5', 13)}
              {renderCategoryLogos('category-6', 17)}
              {renderCategoryLogos('category-7', 8)}
              {renderCategoryLogos('category-8', 7)}
              {renderCategoryLogos('category-9', 5)}
              {renderCategoryLogos('category-10', 8)}
              {renderCategoryLogos('category-11', 6)}
              {renderCategoryLogos('category-12', 4)}
              {renderCategoryLogos('category-13', 15)}
              {renderCategoryLogos('category-14', 6)}
            </div>
            <div className={`front-category-logos ${resettingFrontLogos ? 'resetting' : ''}`}>
              {mapData.map((category, i) => (
                <div
                  key={category.id}
                  className={`category-title category-title-${category.id + 1} ${selectedCategory === `category-${i + 1}` ? 'selected' : ''}`}
                >
                  <div className="category-title-inner">
                    <div className="category-title-image">
                      <img src={category.categoryImage} onClick={() => selectCategory(`category-${i + 1}`)} />
                    </div>
                  </div>
                  <div className="mobile-back-icons">
                    {Array.from({ length: 6 }).map((_, index) => (
                      <div key={index}>
                        {category.logos[index - 1]?.image && <img src={category.logos[index - 1]?.image} alt="Logo" />}
                      </div>
                    ))}
                  </div>
                  <div className="category-title-see-all" onClick={() => selectCategory(`category-${i + 1}`)}>
                    See all
                  </div>
                </div>
              ))}
              <div className={`category-logos ${frontMapOpen ? 'open' : ''}`} style={{ transform: `scale(${scaleMobileIcons})` }}>
                <div className={`category-logos-inner ${filteredLogos.length > 10 ? 'more-than-10' : ''}`}>
                  {filteredLogos.map((logo, index) => (
                    <div key={index} className="category-logo">
                      <div className="category-logo-inner">
                        <a href={logo.url}>
                          <div style={{ backgroundImage: `url(${logo.image})` }}></div>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={`menu-mobile ${mobileOpen ? 'open' : ''}`}>
              <h2>Filter by</h2>
              <div onClick={toggleMobileFilters}>{ mobileOpen ? 'X' : '+' }</div>
            </div>
          </div>
          <div className={`map-outline ${!!selectedCategory ? 'visible' : ''}`} onClick={selectCategory}></div>
        </div>
        <div className={`interactive-map-filter ${mobileOpen ? 'mobile-open' : ''}`}>
          <div className="interactive-map-filter-inner">

            <div className="category-filters-wrapper">
              <p>{filtersConfig['keywords'].title}</p>
              <div className="category-filters">
                <span className="category-filters-placeholder" onClick={() => toggleSelectFilters('keywords')}>
                  {filtersConfig['keywords'].placeholder}
                </span>
                <div className={`filters-selection-list ${filtersConfig['keywords'].open ? 'open' : ''}`}>
                  {Object.keys(filtersConfig['keywords'].allFilters).map((key) => (
                    <div
                      key={key}
                      onClick={() => selectFilter('keywords', filtersConfig['keywords'].allFilters[key])}
                      className={filtersConfig['keywords'].selectedFilters.includes(filtersConfig['keywords'].allFilters[key]) ? 'selected' : ''}>
                      {filtersConfig['keywords'].allFilters[key]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig['keywords'].selectedFilters.map((filter) => (
                    <div key={filter} className="current-filters-list-item">
                      {filter}
                      <div onClick={() => selectFilter('keywords', filter)}>x</div>
                    </div>
                  ))}
                </div>
                {filtersConfig['keywords'].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters('keywords')}>Clear</span>
                )}
              </div>
            </div>

            <div className="category-selection-wrapper">
              <p>Category</p>
              <div className="category-selection">
                <div className="category-selection-active" onClick={toggleSelectCategory}>
                  <span className="selected">{selectedCategory ? categories[selectedCategory] : null}</span>
                  <span>{!selectedCategory && 'Select category'}</span>
                </div>
                <div className={`category-selection-list ${selectCategoryOpen ? 'open' : ''}`}>
                  {Object.keys(categories).map((key) => (
                    <div
                      key={key}
                      className={selectedCategory === key ? 'selected' : ''}
                      onClick={() => selectCategory(key)}>
                      {categories[key]}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="category-filters-wrapper">
              <p>{filtersConfig['subcategories'].title}</p>
              <div className="category-filters">
                <span className="category-filters-placeholder" onClick={() => toggleSelectFilters('subcategories')}>
                  {filtersConfig['subcategories'].placeholder}
                </span>
                <div className={`filters-selection-list ${filtersConfig['subcategories'].open ? 'open' : ''}`}>
                  {Object.keys(filtersConfig['subcategories'].allFilters).map((key) => (
                    <div
                      key={key}
                      onClick={() => selectFilter('subcategories', filtersConfig['subcategories'].allFilters[key])}
                      className={filtersConfig['subcategories'].selectedFilters.includes(filtersConfig['subcategories'].allFilters[key]) ? 'selected' : ''}>
                      {filtersConfig['subcategories'].allFilters[key]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig['subcategories'].selectedFilters.map((filter) => (
                    <div key={filter} className="current-filters-list-item">
                      {filter}
                      <div onClick={() => selectFilter('subcategories', filter)}>x</div>
                    </div>
                  ))}
                </div>
                {filtersConfig['subcategories'].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters('subcategories')}>Clear</span>
                )}
              </div>
            </div>

            <div className="category-filters-wrapper">
              <p>{filtersConfig['headequarterLocation'].title}</p>
              <div className="category-filters">
                <span className="category-filters-placeholder" onClick={() => toggleSelectFilters('headequarterLocation')}>
                  {filtersConfig['headequarterLocation'].placeholder}
                </span>
                <div className={`filters-selection-list ${filtersConfig['headequarterLocation'].open ? 'open' : ''}`}>
                  {Object.keys(filtersConfig['headequarterLocation'].allFilters).map((key) => (
                    <div
                      key={key}
                      onClick={() => selectFilter('headequarterLocation', filtersConfig['headequarterLocation'].allFilters[key])}
                      className={filtersConfig['headequarterLocation'].selectedFilters.includes(filtersConfig['headequarterLocation'].allFilters[key]) ? 'selected' : ''}>
                      {filtersConfig['headequarterLocation'].allFilters[key]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig['headequarterLocation'].selectedFilters.map((filter) => (
                    <div key={filter} className="current-filters-list-item">
                      {filter}
                      <div onClick={() => selectFilter('headequarterLocation', filter)}>x</div>
                    </div>
                  ))}
                </div>
                {filtersConfig['headequarterLocation'].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters('headequarterLocation')}>Clear</span>
                )}
              </div>
            </div>

            <div className="category-filters-wrapper">
              <p>{filtersConfig['activeIn'].title}</p>
              <div className="category-filters">
                <span className="category-filters-placeholder" onClick={() => toggleSelectFilters('activeIn')}>
                  {filtersConfig['activeIn'].placeholder}
                </span>
                <div className={`filters-selection-list ${filtersConfig['activeIn'].open ? 'open' : ''}`}>
                  {Object.keys(filtersConfig['activeIn'].allFilters).map((key) => (
                    <div
                      key={key}
                      onClick={() => selectFilter('activeIn', filtersConfig['activeIn'].allFilters[key])}
                      className={filtersConfig['activeIn'].selectedFilters.includes(filtersConfig['activeIn'].allFilters[key]) ? 'selected' : ''}>
                      {filtersConfig['activeIn'].allFilters[key]}
                    </div>
                  ))}
                </div>
              </div>
              <div className="current-filters-list">
                <div className="current-filters-list-wrapper">
                  {filtersConfig['activeIn'].selectedFilters.map((filter) => (
                    <div key={filter} className="current-filters-list-item">
                      {filter}
                      <div onClick={() => selectFilter('activeIn', filter)}>x</div>
                    </div>
                  ))}
                </div>
                {filtersConfig['activeIn'].selectedFilters.length >= 2 && (
                  <span onClick={() => clearFilters('activeIn')}>Clear</span>
                )}
              </div>
            </div>
          </div>
          <div className="clear-filters-mobile">
            <div onClick={clearAllFilters}>Clear filters</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TreasuryMap;
