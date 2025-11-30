import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Компонент для изменения центра карты
function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

// Компонент для кастомных кнопок зума
function CustomZoomControls() {
  const map = useMap();

  const zoomIn = () => {
    map.setZoom(map.getZoom() + 1);
  };

  const zoomOut = () => {
    map.setZoom(map.getZoom() - 1);
  };

  return (
      <div className="custom-zoom-controls">
        <button className="zoom-btn zoom-in" onClick={zoomIn}>
          +
        </button>
        <button className="zoom-btn zoom-out" onClick={zoomOut}>
          −
        </button>
      </div>
  );
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

// Расширенные моковые данные с большим количеством мероприятий
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
  },
  {
    id: 9,
    title: 'Мастер-класс по керамике',
    short_title: 'Керамика',
    description: 'Учимся создавать изделия из глины',
    price: 'от 2000 руб.',
    place: {
      name: 'Студия керамики "Гончар"',
      address: 'Москва, ул. Пятницкая, 64',
      lat: 55.7390,
      lon: 37.6275
    },
    categories: [{name: 'мастер-класс'}]
  },
  {
    id: 10,
    title: 'Фестиваль уличных театров',
    short_title: 'Уличные театры',
    description: 'Театральные представления под открытым небом',
    price: 'вход свободный',
    place: {
      name: 'Парк "Зарядье"',
      address: 'Москва, ул. Варварка, 6',
      lat: 55.7510,
      lon: 37.6270
    },
    categories: [{name: 'фестиваль'}, {name: 'театр'}]
  },
  {
    id: 11,
    title: 'Выставка фотографии "Город в деталях"',
    short_title: 'Фотовыставка',
    description: 'Уникальные ракурсы городской жизни',
    price: 'от 300 руб.',
    place: {
      name: 'Мультимедиа Арт Музей',
      address: 'Москва, ул. Остоженка, 16',
      lat: 55.7408,
      lon: 37.6042
    },
    categories: [{name: 'выставка'}, {name: 'искусство'}]
  },
  {
    id: 12,
    title: 'Концерт джазовой музыки',
    short_title: 'Джазовый концерт',
    description: 'Живое исполнение классических джазовых композиций',
    price: 'от 1200 руб.',
    place: {
      name: 'Джаз-клуб "Игорь Бутман"',
      address: 'Москва, ул. Поварская, 52',
      lat: 55.7560,
      lon: 37.5935
    },
    categories: [{name: 'концерт'}]
  },
  {
    id: 13,
    title: 'Экскурсия по историческому центру',
    short_title: 'Экскурсия по центру',
    description: 'Прогулка по самым знаковым местам Москвы',
    price: 'бесплатно',
    place: {
      name: 'Площадь Революции',
      address: 'Москва, пл. Революции',
      lat: 55.7569,
      lon: 37.6210
    },
    categories: [{name: 'экскурсия'}]
  },
  {
    id: 14,
    title: 'Показ модной коллекции',
    short_title: 'Показ моды',
    description: 'Демонстрация новой коллекции российского дизайнера',
    price: 'от 1500 руб.',
    place: {
      name: 'ЦУМ',
      address: 'Москва, ул. Петровка, 2',
      lat: 55.7615,
      lon: 37.6175
    },
    categories: [{name: 'мода'}, {name: 'шоу'}]
  },
  {
    id: 15,
    title: 'Кулинарный мастер-класс',
    short_title: 'Кулинария',
    description: 'Учимся готовить блюда итальянской кухни',
    price: 'от 2500 руб.',
    place: {
      name: 'Кулинарная студия "Вкусно"',
      address: 'Москва, Ленинский пр-т, 37',
      lat: 55.6975,
      lon: 37.5732
    },
    categories: [{name: 'мастер-класс'}, {name: 'гастрономия'}]
  },
  {
    id: 16,
    title: 'Рок-фестиваль "Нашествие"',
    short_title: 'Рок-фестиваль',
    description: 'Крупнейший рок-фестиваль страны',
    price: 'от 2000 руб.',
    place: {
      name: 'Стадион "Лужники"',
      address: 'Москва, Лужнецкая наб., 24',
      lat: 55.7158,
      lon: 37.5535
    },
    categories: [{name: 'фестиваль'}, {name: 'концерт'}]
  },
  {
    id: 17,
    title: 'Выставка автомобилей ретро-класса',
    short_title: 'Ретро-автомобили',
    description: 'Коллекция редких автомобилей прошлого века',
    price: 'от 500 руб.',
    place: {
      name: 'Музей техники',
      address: 'Москва, ул. Болотная, 13',
      lat: 55.7440,
      lon: 37.6215
    },
    categories: [{name: 'выставка'}]
  },
  {
    id: 18,
    title: 'Стендап-вечер',
    short_title: 'Стендап',
    description: 'Выступления лучших комиков города',
    price: 'от 800 руб.',
    place: {
      name: 'Comedy Club',
      address: 'Москва, ул. Тверская, 18',
      lat: 55.7630,
      lon: 37.6080
    },
    categories: [{name: 'шоу'}, {name: 'юмор'}]
  },
  {
    id: 19,
    title: 'Йога в парке',
    short_title: 'Йога',
    description: 'Утренние занятия йогой на свежем воздухе',
    price: 'бесплатно',
    place: {
      name: 'Парк "Сокольники"',
      address: 'Москва, ул. Сокольнический Вал, 1',
      lat: 55.7925,
      lon: 37.6785
    },
    categories: [{name: 'спорт'}, {name: 'оздоровление'}]
  },
  {
    id: 20,
    title: 'Кинофестиваль независимого кино',
    short_title: 'Кинофестиваль',
    description: 'Показы лучших работ независимых режиссеров',
    price: 'от 400 руб.',
    place: {
      name: 'Кинотеатр "Иллюзион"',
      address: 'Москва, ул. Котельническая наб., 1/15',
      lat: 55.7470,
      lon: 37.6420
    },
    categories: [{name: 'кино'}, {name: 'фестиваль'}]
  }
];

const App = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mapCenter, setMapCenter] = useState([55.7558, 37.6173]);
  const [loading, setLoading] = useState(true);
  const [showAlphaMessage, setShowAlphaMessage] = useState(false);
  const [panelHeight, setPanelHeight] = useState(70);
  const [isClient, setIsClient] = useState(false);
  const [orangeIcon, setOrangeIcon] = useState(null);

  const mobilePanelRef = useRef(null);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const categories = [
    'концерт', 'выставка', 'театр', 'кино', 'фестиваль',
    'спорт', 'детям', 'экскурсия', 'вечеринка', 'лекция',
    'мастер-класс', 'шоу', 'гастрономия', 'мода', 'искусство'
  ];

  // Определяем, что код выполняется на клиенте и инициализируем Leaflet
  useEffect(() => {
    setIsClient(true);

    // Инициализируем Leaflet только на клиенте
    if (typeof window !== 'undefined') {
      const L = require('leaflet');

      // Фикс для стандартных маркеров в leaflet
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
        iconUrl: require('leaflet/dist/images/marker-icon.png'),
        shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
      });

      // Создаем кастомную оранжевую иконку для маркера
      const customIcon = new L.Icon({
        iconUrl: 'data:image/svg+xml;base64,' + btoa(`
          <svg width="28" height="28" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ff6b35" stroke="#fff" stroke-width="2" d="M16 2C10.477 2 6 6.477 6 12c0 8 10 18 10 18s10-10 10-18c0-5.523-4.477-10-10-10z"/>
            <circle cx="16" cy="12" r="4" fill="#fff"/>
          </svg>
        `),
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28]
      });

      setOrangeIcon(customIcon);
    }
  }, []);

  // Загрузка мероприятий
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
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
      startYRef.current = e.touches[0].clientY;
      startHeightRef.current = panelHeight;
      e.preventDefault();
    };

    const handleTouchMove = (e) => {
      if (!isMobileMenuOpen) return;

      const currentY = e.touches[0].clientY;
      const diff = startYRef.current - currentY;
      const newHeight = Math.min(Math.max(startHeightRef.current + diff, 70), window.innerHeight - 40);

      setPanelHeight(newHeight);
      e.preventDefault();
    };

    const handleTouchEnd = (e) => {
      if (panelHeight < 100) {
        setIsMobileMenuOpen(false);
        setPanelHeight(70);
      } else if (panelHeight > window.innerHeight * 0.6) {
        setPanelHeight(window.innerHeight - 40);
      }
    };

    panel.addEventListener('touchstart', handleTouchStart, { passive: false });
    panel.addEventListener('touchmove', handleTouchMove, { passive: false });
    panel.addEventListener('touchend', handleTouchEnd);

    return () => {
      panel.removeEventListener('touchstart', handleTouchStart);
      panel.removeEventListener('touchmove', handleTouchMove);
      panel.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobileMenuOpen, panelHeight]);

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
      setPanelHeight(70);
    }
  };

  const handleDetailsClick = () => {
    setShowAlphaMessage(true);
  };

  const toggleMobileMenu = () => {
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
      setPanelHeight(70);
    } else {
      setIsMobileMenuOpen(true);
      setPanelHeight(Math.min(window.innerHeight * 0.6, 400));
    }
  };

  return (
      <div className="app">
        {/* Карта */}
        <div className="map-container">
          {isClient && (
              <MapContainer
                  center={mapCenter}
                  zoom={13}
                  style={{ height: '100%', width: '100%' }}
                  zoomControl={false}
                  scrollWheelZoom={true}
                  touchZoom={true}
                  doubleClickZoom={true}
                  dragging={true}
              >
                <ChangeView center={mapCenter} />
                <HideAttribution />
                <CustomZoomControls />
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    className="minimal-map-tiles"
                />
                {filteredEvents.map(event => (
                    event.place && event.place.lat && event.place.lon && orangeIcon && (
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
          )}
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

        {/* Адаптированная мобильная версия для маленьких экранов */}
        <div
            className={`mobile-panel ${isMobileMenuOpen ? 'open' : ''}`}
            ref={mobilePanelRef}
            style={{ height: `${panelHeight}px` }}
        >
          <div className="mobile-header glass-panel">
            <div className="mobile-handle" onClick={toggleMobileMenu}>
              <div className="handle-bar"></div>
            </div>
            <div className="mobile-search">
              <input
                  type="text"
                  placeholder="Поиск мероприятий..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="mobile-content">
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