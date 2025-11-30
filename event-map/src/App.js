import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import './App.css';

// Фикс для стандартных маркеров в leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Кастомная оранжевая иконка для маркера
const orangeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <path fill="#ff6b35" stroke="#fff" stroke-width="2" d="M16 2C10.477 2 6 6.477 6 12c0 8 10 18 10 18s10-10 10-18c0-5.523-4.477-10-10-10z"/>
      <circle cx="16" cy="12" r="4" fill="#fff"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

// Компонент для изменения центра карты
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Компонент для скрытия атрибуции карты
function HideAttribution() {
  const map = useMap();

  useEffect(() => {
    const style = document.createElement('style');
    style.innerHTML = `
      .leaflet-control-attribution {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, [map]);

  return null;
}

const App = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([55.7558, 37.6173]);
  const [loading, setLoading] = useState(true);
  const [showAlphaMessage, setShowAlphaMessage] = useState(false);
  const [startY, setStartY] = useState(0);
  const [currentTranslateY, setCurrentTranslateY] = useState(0);
  const mobilePanelRef = useRef(null);

  const categories = [
    'концерт', 'выставка', 'театр', 'кино', 'фестиваль',
    'спорт', 'детям', 'экскурсия', 'вечеринка', 'лекция',
    'мастер-класс', 'шоу', 'гастрономия', 'мода', 'искусство'
  ];

  // Загрузка мероприятий
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        // Используем расширенные моковые данные
        setEvents(extendedMockEvents);
        setFilteredEvents(extendedMockEvents);
      } catch (error) {
        console.error('Ошибка загрузки мероприятий:', error);
        setEvents(extendedMockEvents);
        setFilteredEvents(extendedMockEvents);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Обработчики для свайпа на мобильных устройствах
  useEffect(() => {
    const panel = mobilePanelRef.current;
    if (!panel) return;

    const handleTouchStart = (e) => {
      setStartY(e.touches[0].clientY);
    };

    const handleTouchMove = (e) => {
      if (!isMobileMenuOpen) return;

      const currentY = e.touches[0].clientY;
      const diff = startY - currentY;

      // Разрешаем только скролл вверх (отрицательные значения)
      if (diff > 0) {
        setCurrentTranslateY(-Math.min(diff, 100));
      }
    };

    const handleTouchEnd = (e) => {
      if (currentTranslateY < -50) {
        // Закрываем панель при достаточно сильном свайпе вверх
        setIsMobileMenuOpen(false);
      }
      setCurrentTranslateY(0);
    };

    panel.addEventListener('touchstart', handleTouchStart);
    panel.addEventListener('touchmove', handleTouchMove);
    panel.addEventListener('touchend', handleTouchEnd);

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart);
      panel.removeEventListener('touchmove', handleTouchMove);
      panel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen, startY, currentTranslateY]);

  // Фильтрация мероприятий
  useEffect(() => {
    let filtered = events;

    if (searchQuery) {
      filtered = filtered.filter(event =>
          event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.short_title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          event.place?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter(event =>
          selectedCategories.some(cat =>
              event.title?.toLowerCase().includes(cat.toLowerCase()) ||
              event.description?.toLowerCase().includes(cat.toLowerCase()) ||
              event.short_title?.toLowerCase().includes(cat.toLowerCase()) ||
              event.categories?.some(category =>
                  category.name?.toLowerCase().includes(cat.toLowerCase())
              )
          )
      );
    }

    setFilteredEvents(filtered);
  }, [searchQuery, selectedCategories, events]);

  const handleCategoryToggle = (category) => {
    setSelectedCategories(prev =>
        prev.includes(category)
            ? prev.filter(c => c !== category)
            : [...prev, category]
    );
  };

  const handleEventClick = (event) => {
    if (event.place && event.place.lat && event.place.lon) {
      setMapCenter([event.place.lat, event.place.lon]);
    }
    if (window.innerWidth <= 768) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleDetailsClick = () => {
    setShowAlphaMessage(true);
  };

  // Расширенные моковые данные
  const extendedMockEvents = [
    {
      id: 1,
      title: 'Концерт симфонического оркестра',
      short_title: 'Симфонический концерт',
      description: 'Прекрасная классическая музыка в исполнении лучших музыкантов',
      price: 'от 1000 руб.',
      place: {
        name: 'Концертный зал Чайковского',
        address: 'Москва, ул. Тверская, 31',
        lat: 55.7602,
        lon: 37.6085
      },
      categories: [{name: 'концерт'}]
    },
    {
      id: 2,
      title: 'Выставка современного искусства',
      short_title: 'Современное искусство',
      description: 'Работы молодых российских художников',
      price: 'бесплатно',
      place: {
        name: 'Галерея современного искусства',
        address: 'Москва, ул. Пречистенка, 19',
        lat: 55.7402,
        lon: 37.5985
      },
      categories: [{name: 'выставка'}]
    },
    {
      id: 3,
      title: 'Фестиваль уличной еды',
      short_title: 'Фестиваль еды',
      description: 'Лучшие фудтраки города в одном месте',
      price: 'вход свободный',
      place: {
        name: 'Парк Горького',
        address: 'Москва, ул. Крымский Вал, 9',
        lat: 55.7312,
        lon: 37.6055
      },
      categories: [{name: 'фестиваль'}, {name: 'гастрономия'}]
    },
    {
      id: 4,
      title: 'Спектакль "Чайка"',
      short_title: 'Чайка',
      description: 'Классическая постановка по пьесе Чехова',
      price: 'от 1500 руб.',
      place: {
        name: 'МХТ им. Чехова',
        address: 'Москва, Камергерский пер., 3',
        lat: 55.7605,
        lon: 37.6138
      },
      categories: [{name: 'театр'}]
    },
    {
      id: 5,
      title: 'Футбольный матч ЦСКА - Спартак',
      short_title: 'Футбол ЦСКА - Спартак',
      description: 'Напряженная игра между принципиальными соперниками',
      price: 'от 800 руб.',
      place: {
        name: 'ВЭБ Арена',
        address: 'Москва, ул. 3-я Песчаная, 2А',
        lat: 55.7984,
        lon: 37.5168
      },
      categories: [{name: 'спорт'}]
    },
    {
      id: 6,
      title: 'Детский кукольный театр',
      short_title: 'Кукольный театр',
      description: 'Волшебные представления для детей',
      price: 'от 500 руб.',
      place: {
        name: 'Театр кукол им. Образцова',
        address: 'Москва, ул. Садовая-Самотечная, 3',
        lat: 55.7732,
        lon: 37.6145
      },
      categories: [{name: 'детям'}, {name: 'театр'}]
    },
    {
      id: 7,
      title: 'Ночная вечеринка в клубе',
      short_title: 'Ночная вечеринка',
      description: 'Лучшие диджеи и атмосферная музыка',
      price: 'от 1000 руб.',
      place: {
        name: 'Клуб "Арма"',
        address: 'Москва, Пресненская наб., 8',
        lat: 55.7490,
        lon: 37.5395
      },
      categories: [{name: 'вечеринка'}]
    },
    {
      id: 8,
      title: 'Лекция о современном искусстве',
      short_title: 'Лекция об искусстве',
      description: 'Искусствовед рассказывает о современных трендах',
      price: 'бесплатно',
      place: {
        name: 'Центр современного искусства "Винзавод"',
        address: 'Москва, 4-й Сыромятнический пер., 1/8',
        lat: 55.7465,
        lon: 37.6542
      },
      categories: [{name: 'лекция'}, {name: 'искусство'}]
    }
  ];

  return (
      <div className="app">
        {/* Карта */}
        <div className="map-container">
          <MapContainer
              center={mapCenter}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              zoomControl={true}
              scrollWheelZoom={true}
              touchZoom={true}
              doubleClickZoom={true}
              dragging={true}
          >
            <ChangeView center={mapCenter} />
            <HideAttribution />
            <TileLayer
                url="https://api.maptiler.com/maps/basic/{z}/{x}/{y}.png?key=get_your_own_OpIi9ZULNHzrESv6T2vL"
                attribution=''
                className="maptiler-basic-map"
            />
            {filteredEvents.map(event => (
                event.place && event.place.lat && event.place.lon && (
                    <Marker
                        key={event.id}
                        position={[event.place.lat, event.place.lon]}
                        icon={orangeIcon}
                        eventHandlers={{
                          click: () => handleEventClick(event),
                        }}
                    >
                      <Popup className="custom-popup">
                        <div className="popup-content">
                          <h3>{event.title}</h3>
                          <p className="popup-description">{event.description}</p>
                          <div className="popup-details">
                            <span className="popup-price">{event.price}</span>
                            <span className="popup-location">{event.place.name}</span>
                          </div>
                          <p className="popup-address">{event.place.address}</p>
                          <button
                              className="event-link-button"
                              onClick={handleDetailsClick}
                          >
                            Подробнее
                          </button>
                        </div>
                      </Popup>
                    </Marker>
                )
            ))}
          </MapContainer>
        </div>

        {/* Десктоп версия - боковые панели */}
        <div className="desktop-panels">
          <div className="panel search-panel glass-panel">
            <div className="search-box">
              <input
                  type="text"
                  placeholder="Поиск мероприятий..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
              />
            </div>
            <div className="categories">
              <div className="categories-grid">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                        onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </button>
                ))}
              </div>
            </div>
          </div>

          <div className="panel events-panel glass-panel">
            <div className="events-header">
              <h3>Мероприятия ({filteredEvents.length})</h3>
              <div className="selected-categories">
                {selectedCategories.length > 0 && (
                    <span>Выбрано: {selectedCategories.join(', ')}</span>
                )}
              </div>
            </div>
            <div className="events-list">
              {loading ? (
                  <div className="loading">Загрузка мероприятий...</div>
              ) : filteredEvents.length === 0 ? (
                  <div className="no-events">
                    <p>Мероприятия не найдены</p>
                    <button
                        className="reset-filters"
                        onClick={() => {
                          setSearchQuery('');
                          setSelectedCategories([]);
                        }}
                    >
                      Сбросить фильтры
                    </button>
                  </div>
              ) : (
                  filteredEvents.map(event => (
                      <div
                          key={event.id}
                          className="event-card"
                          onClick={() => handleEventClick(event)}
                      >
                        <h4>{event.title}</h4>
                        <p className="event-description">{event.description}</p>
                        <div className="event-details">
                          <span className="event-price">{event.price}</span>
                          <span className="event-location">{event.place?.name}</span>
                        </div>
                        <button
                            className="event-link"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDetailsClick();
                            }}
                        >
                          Подробнее
                        </button>
                      </div>
                  ))
              )}
            </div>
          </div>
        </div>

        {/* Мобильная версия - нижняя панель */}
        <div className="mobile-panel" ref={mobilePanelRef}>
          <div
              className="mobile-handle glass-panel"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="handle-bar"></div>
          </div>

          <div
              className={`mobile-content glass-panel ${isMobileMenuOpen ? 'open' : ''}`}
              style={{ transform: `translateY(${currentTranslateY}px)` }}
          >
            <div className="mobile-search">
              <input
                  type="text"
                  placeholder="Поиск мероприятий..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="mobile-categories">
              <div className="categories-scroll">
                {categories.map(category => (
                    <button
                        key={category}
                        className={`category-btn ${selectedCategories.includes(category) ? 'active' : ''}`}
                        onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </button>
                ))}
              </div>
            </div>

            <div className="mobile-events">
              <div className="mobile-events-header">
                <h3>Мероприятия ({filteredEvents.length})</h3>
              </div>
              <div className="events-scroll">
                {loading ? (
                    <div className="loading">Загрузка мероприятий...</div>
                ) : filteredEvents.length === 0 ? (
                    <div className="no-events">
                      <p>Мероприятия не найдены</p>
                      <button
                          className="reset-filters"
                          onClick={() => {
                            setSearchQuery('');
                            setSelectedCategories([]);
                          }}
                      >
                        Сбросить фильтры
                      </button>
                    </div>
                ) : (
                    filteredEvents.map(event => (
                        <div
                            key={event.id}
                            className="event-card"
                            onClick={() => handleEventClick(event)}
                        >
                          <h4>{event.title}</h4>
                          <p className="event-location">{event.place?.name}</p>
                          <span className="event-price">{event.price}</span>
                          <button
                              className="event-link"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDetailsClick();
                              }}
                          >
                            Подробнее
                          </button>
                        </div>
                    ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Модальное окно альфа-тестирования */}
        {showAlphaMessage && (
            <div className="alpha-modal-overlay">
              <div className="alpha-modal glass-panel">
                <div className="alpha-modal-content">
                  <h3>Альфа-тестирование</h3>
                  <p>Данные будут доступны позже</p>
                  <button
                      className="alpha-modal-close"
                      onClick={() => setShowAlphaMessage(false)}
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default App;