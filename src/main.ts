import './style.css';
import { select, selectAll } from 'd3-selection';
import { geoNaturalEarth1, geoMercator, geoEquirectangular, geoOrthographic, geoPath, geoInterpolate } from 'd3-geo';
import { scaleThreshold, scaleLinear, scaleBand } from 'd3-scale';
import { line, curveBasis } from 'd3-shape'; 
import { zoom, zoomIdentity } from 'd3-zoom';
import { drag } from 'd3-drag'; 
import 'd3-transition'; 

console.log("🚀 Polygon script started!");

const geoToIsoMap: Record<string, string> = {
    "USA": "US", "GBR": "GB", "RUS": "RU", "CHN": "CN", "IND": "IN", "BRA": "BR", "ZAF": "ZA", "COD": "CD", "COG": "CG", "TZA": "TZ", "CZE": "CZ", "KOR": "KR", "PRK": "KP", "IRN": "IR", "SYR": "SY", "VEN": "VE", "BOL": "BO", "TWN": "TW", "VNM": "VN", "DEU": "DE", "FRA": "FR", "ITA": "IT", "ESP": "ES", "CAN": "CA", "AUS": "AU", "JPN": "JP", "MEX": "MX", "IDN": "ID", "NGA": "NG", "EGY": "EG", "TUR": "TR", "UKR": "UA", "POL": "PL", "ARG": "AR", "SAU": "SA", "ESH": "EH", "CAF": "CF", "SOM": "SO", "SOL": "SO", "ERI": "ER", "LBR": "LR", "SLE": "SL", "GNB": "GW", "GMB": "GM", "DJI": "DJ", "GNQ": "GQ", "BDI": "BI", "RWA": "RW", "SSD": "SS", "SDN": "SD", "MRT": "MR", "NER": "NE", "TCD": "TD", "MLI": "ML", "BFA": "BF", "CIV": "CI", "GHA": "GH", "TGO": "TG", "BEN": "BJ", "CMR": "CM", "GAB": "GA", "AGO": "AO", "ZMB": "ZM", "MWI": "MW", "MOZ": "MZ", "MDG": "MG", "KEN": "KE", "UGA": "UG", "ETH": "ET", "YEM": "YE", "OMN": "OM", "ARE": "AE", "QAT": "QA", "KWT": "KW", "IRQ": "IQ", "JOR": "JO", "LBN": "LB", "ISR": "IL", "PSE": "PS", "LBY": "LY", "TUN": "TN", "DZA": "DZ", "MAR": "MA", "SRB": "RS", "MKD": "MK", "XKX": "XK", "BIH": "BA", "HRV": "HR", "SVN": "SI", "SVK": "SK", "EST": "EE", "LVA": "LV", "LTU": "LT", "BLR": "BY", "MDA": "MD", "ALB": "AL", "GRC": "GR", "BGR": "BG", "ROU": "RO", "HUN": "HU", "AUT": "AT", "CHE": "CH", "BEL": "BE", "NLD": "NL", "DNK": "DK", "NOR": "NO", "SWE": "SE", "FIN": "FI", "ISL": "IS", "IRL": "IE", "PRT": "PT", "AND": "AD", "MCO": "MC", "SMR": "SM", "VAT": "VA", "MLT": "MT", "CYP": "CY", "LUX": "LU"
};

const nameOverrides: Record<string, string> = {
    "w. sahara": "western sahara", "central african rep.": "central african republic", "dem. rep. congo": "congo (dem. rep.)", "republic of the congo": "congo", "s. sudan": "south sudan", "eq. guinea": "equatorial guinea", "côte d'ivoire": "côte d'ivoire", "cote d'ivoire": "côte d'ivoire", "macedonia": "north macedonia", "swaziland": "eswatini", "czech rep.": "czechia", "united republic of tanzania": "tanzania", "republic of serbia": "serbia", "somaliland": "somalia", "som.": "somalia"
};

const languageData: Record<string, string> = {
    "AF": "Pashto, Dari", "AL": "Albanian", "DZ": "Arabic, Berber", "AD": "Catalan", "AO": "Portuguese", "AG": "English", "AR": "Spanish", "AM": "Armenian", "AU": "English", "AT": "German", "AZ": "Azerbaijani",
    "BS": "English", "BH": "Arabic", "BD": "Bengali", "BB": "English", "BY": "Belarusian, Russian", "BE": "Dutch, French, German", "BZ": "English", "BJ": "French", "BT": "Dzongkha", "BO": "Spanish, Quechua, Aymara", "BA": "Bosnian, Croatian, Serbian", "BW": "English, Tswana", "BR": "Portuguese", "BN": "Malay", "BG": "Bulgarian", "BF": "French", "BI": "Kirundi, French",
    "KH": "Khmer", "CM": "French, English", "CA": "English, French", "CV": "Portuguese", "CF": "French, Sango", "TD": "French, Arabic", "CL": "Spanish", "CN": "Mandarin", "CO": "Spanish", "KM": "Comorian, Arabic, French", "CG": "French", "CD": "French", "CR": "Spanish", "CI": "French", "HR": "Croatian", "CU": "Spanish", "CY": "Greek, Turkish", "CZ": "Czech",
    "DK": "Danish", "DJ": "French, Arabic", "DM": "English", "DO": "Spanish", "EC": "Spanish", "EG": "Arabic", "SV": "Spanish", "GQ": "Spanish, French", "ER": "Tigrinya, Arabic, English", "EE": "Estonian", "SZ": "Swazi, English", "ET": "Amharic, Oromo",
    "FJ": "English, Fijian", "FI": "Finnish, Swedish", "FR": "French", "GA": "French", "GM": "English", "GE": "Georgian", "DE": "German", "GH": "English", "GR": "Greek", "GD": "English", "GT": "Spanish", "GN": "French", "GW": "Portuguese", "GY": "English", "HT": "Haitian Creole, French", "HN": "Spanish", "HU": "Hungarian",
    "IS": "Icelandic", "IN": "Hindi, English", "ID": "Indonesian", "IR": "Persian", "IQ": "Arabic, Kurdish", "IE": "Irish, English", "IL": "Hebrew, Arabic", "IT": "Italian",
    "JM": "English", "JP": "Japanese", "JO": "Arabic", "KZ": "Kazakh, Russian", "KE": "Swahili, English", "KI": "Gilbertese", "KW": "Arabic", "KG": "Kyrgyz, Russian", "LA": "Lao", "LV": "Latvian", "LB": "Arabic", "LS": "Sesotho, English", "LR": "English", "LY": "Arabic", "LI": "German", "LT": "Lithuanian", "LU": "Luxembourgish, French, German",
    "MG": "Malagasy, French", "MW": "English, Chichewa", "MY": "Malay", "MV": "Dhivehi", "ML": "French", "MT": "Maltese, English", "MH": "Marshallese, English", "MR": "Arabic", "MU": "English, French", "MX": "Spanish", "FM": "English", "MD": "Romanian", "MC": "French", "MN": "Mongolian", "ME": "Montenegrin", "MA": "Arabic, Berber", "MZ": "Portuguese", "MM": "Burmese",
    "NA": "English", "NR": "Nauruan, English", "NP": "Nepali", "NL": "Dutch", "NZ": "English, Maori", "NI": "Spanish", "NE": "French", "NG": "English", "KP": "Korean", "MK": "Macedonian", "NO": "Norwegian", "OM": "Arabic",
    "PK": "Urdu, English", "PW": "Palauan, English", "PA": "Spanish", "PG": "English, Tok Pisin", "PY": "Spanish, Guarani", "PE": "Spanish, Quechua", "PH": "Filipino, English", "PL": "Polish", "PT": "Portuguese", "QA": "Arabic", "RO": "Romanian", "RU": "Russian", "RW": "Kinyarwanda, French, English",
    "KN": "English", "LC": "English", "VC": "English", "WS": "Samoan, English", "SM": "Italian", "ST": "Portuguese", "SA": "Arabic", "SN": "French", "RS": "Serbian", "SC": "Seychellois Creole, English, French", "SL": "English", "SG": "English, Malay, Mandarin, Tamil", "SK": "Slovak", "SI": "Slovene", "SB": "English", "SO": "Somali, Arabic", "ZA": "Zulu, Xhosa, Afrikaans, English", "KR": "Korean", "SS": "English", "ES": "Spanish", "LK": "Sinhala, Tamil", "SD": "Arabic, English", "SR": "Dutch", "SE": "Swedish", "CH": "German, French, Italian, Romansh", "SY": "Arabic",
    "TW": "Mandarin", "TJ": "Tajik", "TZ": "Swahili, English", "TH": "Thai", "TL": "Tetum, Portuguese", "TG": "French", "TO": "Tongan, English", "TT": "English", "TN": "Arabic", "TR": "Turkish", "TM": "Turkmen", "TV": "Tuvaluan, English",
    "UG": "English, Swahili", "UA": "Ukrainian", "AE": "Arabic", "GB": "English", "US": "English", "UY": "Spanish", "UZ": "Uzbek",
    "VU": "Bislama, English, French", "VA": "Italian, Latin", "VE": "Spanish", "VN": "Vietnamese", "YE": "Arabic", "ZM": "English", "ZW": "English, Shona, Ndebele"
};

type Religion = { name: string; percent: number };
const extraData: Record<string, { civ: string, rel: Religion[] }> = {
    "IN": { civ: "3300 BC (Indus Valley)", rel: [{name: "Hinduism", percent: 79}, {name: "Islam", percent: 14}, {name: "Christianity", percent: 2}] },
    "CN": { civ: "2100 BC (Xia Dynasty)", rel: [{name: "Folk", percent: 21}, {name: "Buddhism", percent: 18}, {name: "Christianity", percent: 5}] },
    "US": { civ: "1776 (Modern)", rel: [{name: "Christianity", percent: 63}, {name: "Unaffiliated", percent: 29}, {name: "Judaism", percent: 2}] },
    "ID": { civ: "1293 (Majapahit)", rel: [{name: "Islam", percent: 87}, {name: "Christianity", percent: 10}, {name: "Hinduism", percent: 1.7}] },
    "PK": { civ: "1947 (Modern)", rel: [{name: "Islam", percent: 96}, {name: "Hinduism", percent: 2}, {name: "Christianity", percent: 1.5}] },
    "NG": { civ: "1960 (Modern)", rel: [{name: "Islam", percent: 53}, {name: "Christianity", percent: 45}, {name: "Traditional", percent: 1}] },
    "BR": { civ: "1500 (Colonization)", rel: [{name: "Christianity", percent: 83}, {name: "Unaffiliated", percent: 10}, {name: "Spiritism", percent: 2}] },
    "BD": { civ: "1971 (Modern)", rel: [{name: "Islam", percent: 91}, {name: "Hinduism", percent: 8}, {name: "Buddhism", percent: 0.6}] },
    "RU": { civ: "862 AD (Kievan Rus)", rel: [{name: "Christianity", percent: 71}, {name: "Unaffiliated", percent: 15}, {name: "Islam", percent: 10}] },
    "MX": { civ: "1821 (Modern)", rel: [{name: "Christianity", percent: 78}, {name: "Unaffiliated", percent: 10}, {name: "Other", percent: 2}] },
    "ET": { civ: "1270 (Ethiopian Empire)", rel: [{name: "Christianity", percent: 67}, {name: "Islam", percent: 31}, {name: "Traditional", percent: 2}] },
    "JP": { civ: "660 BC (Mythological)", rel: [{name: "Shinto/Buddhism", percent: 70}, {name: "Unaffiliated", percent: 28}, {name: "Christianity", percent: 1.5}] },
    "PH": { civ: "1565 (Spanish Era)", rel: [{name: "Christianity", percent: 92}, {name: "Islam", percent: 5}, {name: "Other", percent: 3}] },
    "EG": { civ: "3100 BC (Ancient Egypt)", rel: [{name: "Islam", percent: 90}, {name: "Christianity", percent: 10}, {name: "Judaism", percent: 0.1}] },
    "CD": { civ: "1960 (Modern)", rel: [{name: "Christianity", percent: 93}, {name: "Islam", percent: 1.5}, {name: "Other", percent: 5.5}] },
    "VN": { civ: "939 AD (Independence)", rel: [{name: "Folk", percent: 73}, {name: "Buddhism", percent: 12}, {name: "Christianity", percent: 7}] },
    "IR": { civ: "550 BC (Achaemenid)", rel: [{name: "Islam", percent: 99.5}, {name: "Christianity", percent: 0.2}, {name: "Other", percent: 0.3}] },
    "TR": { civ: "1299 (Ottoman)", rel: [{name: "Islam", percent: 97}, {name: "Christianity", percent: 0.2}, {name: "Judaism", percent: 0.1}] },
    "DE": { civ: "1871 (Unification)", rel: [{name: "Christianity", percent: 52}, {name: "Unaffiliated", percent: 40}, {name: "Islam", percent: 6}] },
    "TH": { civ: "1238 (Sukhothai)", rel: [{name: "Buddhism", percent: 93}, {name: "Islam", percent: 5}, {name: "Christianity", percent: 1}] },
    "GB": { civ: "927 AD (Kingdom of England)", rel: [{name: "Christianity", percent: 46}, {name: "Unaffiliated", percent: 37}, {name: "Islam", percent: 6}] },
    "FR": { civ: "843 AD (Frankish Empire)", rel: [{name: "Christianity", percent: 47}, {name: "Unaffiliated", percent: 40}, {name: "Islam", percent: 9}] },
    "IT": { civ: "1861 (Unification)", rel: [{name: "Christianity", percent: 74}, {name: "Unaffiliated", percent: 22}, {name: "Islam", percent: 3.5}] },
    "TZ": { civ: "1961 (Modern)", rel: [{name: "Christianity", percent: 63}, {name: "Islam", percent: 34}, {name: "Traditional", percent: 1}] },
    "ZA": { civ: "1652 (Dutch Cape)", rel: [{name: "Christianity", percent: 80}, {name: "Traditional", percent: 5}, {name: "Islam", percent: 2}] },
    "MM": { civ: "849 AD (Pagan)", rel: [{name: "Buddhism", percent: 88}, {name: "Christianity", percent: 6}, {name: "Islam", percent: 4}] },
    "KE": { civ: "1963 (Modern)", rel: [{name: "Christianity", percent: 85}, {name: "Islam", percent: 11}, {name: "Traditional", percent: 1.5}] },
    "KR": { civ: "1948 (Modern)", rel: [{name: "Unaffiliated", percent: 56}, {name: "Christianity", percent: 28}, {name: "Buddhism", percent: 15}] },
    "CO": { civ: "1810 (Independence)", rel: [{name: "Christianity", percent: 87}, {name: "Unaffiliated", percent: 11}, {name: "Other", percent: 2}] },
    "ES": { civ: "1492 (Unification)", rel: [{name: "Christianity", percent: 60}, {name: "Unaffiliated", percent: 37}, {name: "Islam", percent: 2.5}] },
    "UG": { civ: "1962 (Modern)", rel: [{name: "Christianity", percent: 84}, {name: "Islam", percent: 14}, {name: "Other", percent: 2}] },
    "AR": { civ: "1816 (Independence)", rel: [{name: "Christianity", percent: 79}, {name: "Unaffiliated", percent: 19}, {name: "Islam", percent: 1}] },
    "DZ": { civ: "1962 (Modern)", rel: [{name: "Islam", percent: 99}, {name: "Christianity", percent: 0.3}, {name: "Judaism", percent: 0.1}] },
    "SD": { civ: "1956 (Modern)", rel: [{name: "Islam", percent: 91}, {name: "Christianity", percent: 5}, {name: "Traditional", percent: 4}] },
    "UA": { civ: "1991 (Modern)", rel: [{name: "Christianity", percent: 78}, {name: "Unaffiliated", percent: 18}, {name: "Islam", percent: 1}] },
    "IQ": { civ: "5500 BC (Mesopotamia)", rel: [{name: "Islam", percent: 98}, {name: "Christianity", percent: 1}, {name: "Other", percent: 1}] },
    "AF": { civ: "1747 (Durrani Empire)", rel: [{name: "Islam", percent: 99.7}, {name: "Other", percent: 0.3}, {name: "None", percent: 0}] },
    "PL": { civ: "966 AD (Baptism of Poland)", rel: [{name: "Christianity", percent: 92}, {name: "Unaffiliated", percent: 6}, {name: "Other", percent: 2}] },
    "CA": { civ: "1867 (Confederation)", rel: [{name: "Christianity", percent: 67}, {name: "Unaffiliated", percent: 24}, {name: "Islam", percent: 3.2}] },
    "MA": { civ: "788 AD (Idrisid Dynasty)", rel: [{name: "Islam", percent: 99}, {name: "Christianity", percent: 0.8}, {name: "Judaism", percent: 0.2}] },
    "SA": { civ: "1727 (First Saudi State)", rel: [{name: "Islam", percent: 93}, {name: "Christianity", percent: 4}, {name: "Hinduism", percent: 1}] },
    "UZ": { civ: "1991 (Modern)", rel: [{name: "Islam", percent: 88}, {name: "Christianity", percent: 9}, {name: "Other", percent: 3}] },
    "PE": { civ: "1821 (Independence)", rel: [{name: "Christianity", percent: 94}, {name: "Unaffiliated", percent: 5}, {name: "Other", percent: 1}] },
    "AO": { civ: "1975 (Modern)", rel: [{name: "Christianity", percent: 93}, {name: "Traditional", percent: 4}, {name: "Other", percent: 3}] },
    "MY": { civ: "1957 (Modern)", rel: [{name: "Islam", percent: 61.3}, {name: "Buddhism", percent: 19.8}, {name: "Christianity", percent: 9.2}] },
    "MZ": { civ: "1975 (Modern)", rel: [{name: "Christianity", percent: 56}, {name: "Islam", percent: 18}, {name: "Unaffiliated", percent: 18}] },
    "GH": { civ: "1957 (Modern)", rel: [{name: "Christianity", percent: 71}, {name: "Islam", percent: 18}, {name: "Traditional", percent: 5}] },
    "YE": { civ: "1990 (Unification)", rel: [{name: "Islam", percent: 99.1}, {name: "Other", percent: 0.9}, {name: "None", percent: 0}] },
    "NP": { civ: "1768 (Unification)", rel: [{name: "Hinduism", percent: 81.3}, {name: "Buddhism", percent: 9}, {name: "Islam", percent: 4.4}] },
    "VE": { civ: "1811 (Independence)", rel: [{name: "Christianity", percent: 88}, {name: "Unaffiliated", percent: 9}, {name: "Other", percent: 3}] }
};

const arcData: { source: [number, number], target: [number, number] }[] = [
    { source: [-74.0060, 40.7128], target: [-0.1276, 51.5072] }, 
    { source: [121.4737, 31.2304], target: [4.4777, 51.9244] },   
    { source: [55.2708, 25.2048], target: [139.6917, 35.6895] },  
    { source: [-118.2437, 34.0522], target: [151.2093, -33.8688] },
    { source: [-46.6333, -23.5505], target: [18.4232, -33.9249] }, 
    { source: [72.8777, 19.0760], target: [-43.1729, -22.9068] }  
];

const MICROSTATES = ["AD", "MC", "SM", "VA", "LI", "MT", "SG", "BH", "MV", "BB", "LC", "GD", "VC", "KN", "AG", "DM"];
const YEARS = [1980, 1990, 2000, 2010, 2020, 2026];
const TIME_MULTIPLIERS = [0.60, 0.70, 0.80, 0.90, 1.00, 1.05];

const PLAY_ICON = `<svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>`;
const PAUSE_ICON = `<svg viewBox="0 0 24 24"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>`;
const MOON_ICON = `<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 1 0 9 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 0 1-4.4 2.26 5.403 5.403 0 0 1-3.14-9.8c-.44-.06-.9-.1-1.36-.1z"/></svg>`;
const SUN_ICON = `<svg viewBox="0 0 24 24"><path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41L5.99 4.58zm12.37 12.37c-.39-.39-1.03-.39-1.41 0-.39.39-.39 1.03 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0 .39-.39.39-1.03 0-1.41l-1.06-1.06zm1.06-10.96c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36c.39-.39.39-1.03 0-1.41-.39-.39-1.03-.39-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41.39.39 1.03.39 1.41 0l1.06-1.06z"/></svg>`;

export class PolygonMap {
    width: number;
    height: number;
    svg: any;
    mapGroup: any;
    projection: any;
    pathGenerator: any;
    countryData: any = {};
    countryNameMap: Map<string, any> = new Map(); 
    colorScale: any;
    
    originalGeoData: any;
    geoData: any;
    eventsData: any;
    zoomBehavior: any;
    dragBehavior: any;
    
    currentYearIndex: number = 5;
    isPlaying: boolean = false;
    animationInterval: any = null;
    animationSpeed: number = 1200;
    loop: boolean = false;
    
    projectionType: string = 'geoNaturalEarth1';
    globeRotation: [number, number] = [0, -20];
    
    customColors: Record<string, string> | null = null;
    addedMarkers: Array<{lat: number, lng: number, label: string}> = [];
    isTooltipPinned: boolean = false;
    tooltip: HTMLElement;

    isDraggingPanel: boolean = false;
    panelOffsetX: number = 0;
    panelOffsetY: number = 0;

    isDrillDown: boolean = false;
    allProvincesData: any = null; 

    isCompareMode: boolean = false;
    selectedCountries: string[] = [];

    constructor(containerId: string = 'map') {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        
        // Use the passed containerId instead of hardcoded '#map'
        this.svg = select('#' + containerId).append('svg').attr('width', this.width).attr('height', this.height);
        this.mapGroup = this.svg.append('g').attr('class', 'map-group');
        this.tooltip = document.getElementById('map-tooltip')!;

        this.initTheme(); 
        this.init();
        (window as any).polygonMap = this; 
    }

    initTheme() {
        const savedTheme = localStorage.getItem('polygon-theme');
        const icon = document.getElementById('theme-icon');
        
        if (icon) {
            if (savedTheme === 'light') {
                document.body.classList.add('light-mode');
                icon.innerHTML = SUN_ICON;
            } else {
                icon.innerHTML = MOON_ICON;
            }
        }

        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                document.body.classList.toggle('light-mode');
                const isLight = document.body.classList.contains('light-mode');
                localStorage.setItem('polygon-theme', isLight ? 'light' : 'dark');
                if (icon) icon.innerHTML = isLight ? SUN_ICON : MOON_ICON;
                
                if (this.projectionType === 'geoOrthographic') {
                    this.mapGroup.select('.ocean-sphere').attr('fill', isLight ? '#E2E8F0' : '#0c4a6e');
                } else {
                    document.body.style.backgroundColor = isLight ? '#E2E8F0' : '#0c4a6e';
                }
                this.updateComparisonPanel();
            });
        }
    }

    async init() {
        try {
            const [geoRes, countryRes, eventsRes] = await Promise.all([
                fetch('https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'),
                fetch('/data/country-data.json'), 
                fetch('/data/events.json')        
            ]);

            this.originalGeoData = await geoRes.json();
            this.geoData = JSON.parse(JSON.stringify(this.originalGeoData)); 
            this.countryData = await countryRes.json();
            this.eventsData = await eventsRes.json();

            Object.values(this.countryData).forEach((data: any) => {
                if (data.name) this.countryNameMap.set(data.name.toLowerCase().trim(), data);
            });

            this.colorScale = scaleThreshold<number, string>()
                .domain([10000000, 50000000, 100000000, 500000000])
                .range(['#FEF08A', '#FDE047', '#4ADE80', '#1E40AF', '#EF4444']);

            this.zoomBehavior = zoom<SVGSVGElement, unknown>()
                .scaleExtent([1, 15])
                .on('zoom', (event) => {
                    this.mapGroup.attr('transform', event.transform);
                });

            this.dragBehavior = drag<SVGSVGElement, unknown>()
                .on('drag', (event: any) => {
                    if (this.projectionType !== 'geoOrthographic') return;
                    
                    const sensitivity = 0.25;
                    this.globeRotation[0] += event.dx * sensitivity;
                    this.globeRotation[1] -= event.dy * sensitivity;
                    
                    this.globeRotation[1] = Math.max(-90, Math.min(90, this.globeRotation[1]));

                    this.projection.rotate(this.globeRotation);
                    this.updateProjection(); 
                    this.hideTooltip(); 
                });

            this.setupEventListeners();
            this.drawMap(); 
            
        } catch (error) {
            console.error("❌ Failed to load data:", error);
        }
    }

    getMeta(d: any) {
        let geoName = d.properties?.name ? d.properties.name.toLowerCase().trim() : "";
        geoName = nameOverrides[geoName] || geoName; 
        const mappedId = geoToIsoMap[d.id] || d.id; 
        return this.countryData[mappedId] || this.countryNameMap.get(geoName);
    }

    getColorForPopulation(population: number) {
        if (population > 0) return this.colorScale(population);
        return document.body.classList.contains('light-mode') ? '#CBD5E1' : '#334155';
    }

    drawMap() {
        this.mapGroup.selectAll('*').remove(); 
        
        const projections: Record<string, any> = {
            'geoNaturalEarth1': geoNaturalEarth1(),
            'geoMercator': geoMercator(),
            'geoEquirectangular': geoEquirectangular(),
            'geoOrthographic': geoOrthographic()
        };
        this.projection = projections[this.projectionType];
        
        if (this.projectionType === 'geoOrthographic' && !this.isDrillDown) {
            document.body.classList.add('globe-mode');
            this.svg.call(this.dragBehavior); 
            this.svg.on('.zoom', null);       
            
            this.projection
                .rotate(this.globeRotation)
                .clipAngle(90)
                .precision(0.1)
                .scale(this.height / 2.5)
                .translate([this.width / 2, this.height / 2]);

            const showOcean = (document.getElementById('ocean-checkbox') as HTMLInputElement)?.checked ?? true;
            if (showOcean) {
                const isLight = document.body.classList.contains('light-mode');
                this.mapGroup.append('circle')
                    .attr('class', 'ocean-sphere')
                    .attr('cx', this.width / 2)
                    .attr('cy', this.height / 2)
                    .attr('r', this.height / 2.5)
                    .attr('fill', isLight ? '#E2E8F0' : '#0c4a6e');
            }
                
        } else {
            document.body.classList.remove('globe-mode');
            this.svg.on('.drag', null);       
            this.svg.call(this.zoomBehavior); 
            this.projection.fitSize([this.width, this.height], this.geoData);
        }
        
        this.pathGenerator = geoPath().projection(this.projection);

        this.renderBaseMap();
        this.renderLabels();
        
        if (!this.isDrillDown) {
            this.renderEvents();
            this.renderArcs(); 
            this.addedMarkers.forEach(m => this.addMarker(m.lat, m.lng, m.label, false));
        }
    }

    updateProjection() {
        this.mapGroup.selectAll('path.country').attr('d', this.pathGenerator);
        
        this.mapGroup.selectAll('text.country-label')
            .attr('x', (d: any) => { const c = this.pathGenerator.centroid(d); return c ? c[0] : 0; })
            .attr('y', (d: any) => { const c = this.pathGenerator.centroid(d); return c ? c[1] : 0; });

        this.mapGroup.selectAll('circle.pulse, circle.event-marker')
            .attr('cx', (d: any) => this.projection(d.geometry.coordinates)?.[0] || -100)
            .attr('cy', (d: any) => this.projection(d.geometry.coordinates)?.[1] || -100);

        this.mapGroup.selectAll('.custom-marker-group').each((d: any, i: number, nodes: any) => {
            const group = select(nodes[i]);
            const markerData = group.select('circle').datum() as any;
            if (!markerData) return;
            
            const pt = this.projection([markerData.lng, markerData.lat]);
            if (pt) {
                group.style('display', 'block');
                group.select('circle').attr('cx', pt[0]).attr('cy', pt[1]);
                group.select('text').attr('x', pt[0]).attr('y', pt[1] - 10);
            } else {
                group.style('display', 'none');
            }
        });

        this.mapGroup.selectAll('.arc-path').attr('d', (d: any) => d.pathData);
    }

    renderArcs() {
        const showArcs = (document.getElementById('arcs-checkbox') as HTMLInputElement)?.checked;
        if (!showArcs) return;

        const arcLayer = this.mapGroup.append('g').attr('id', 'arcs-layer');
        
        arcData.forEach(arc => {
            const interpolate = geoInterpolate(arc.source, arc.target);
            
            const points: [number, number][] = [];
            for (let i = 0; i <= 1; i += 0.05) {
                points.push(interpolate(i));
            }
            
            const pathData = this.pathGenerator({ type: "LineString", coordinates: points });
            
            arcLayer.append('path')
                .datum({ pathData })
                .attr('class', 'arc-path')
                .attr('d', (pathData || "") as any); 
        });
    }

    private seededRandom(seed: string) {
        let h = 0xdeadbeef;
        for(let i = 0; i < seed.length; i++) {
            h = Math.imul(h ^ seed.charCodeAt(i), 2654435761);
        }
        return () => {
            h = Math.imul(h ^ (h >>> 16), 2246822507);
            h = Math.imul(h ^ (h >>> 13), 3266489909);
            return ((h ^= h >>> 16) >>> 0) / 4294967296;
        }
    }

    generateSparkline(basePop: number, countryId: string) {
        const rand = this.seededRandom(countryId);
        
        const data = YEARS.map((_, i) => {
            const baseMultiplier = TIME_MULTIPLIERS[i] || 1;
            const variance = 0.8 + (rand() * 0.4); 
            return basePop * baseMultiplier * variance;
        });
        
        data[data.length - 1] = basePop * (TIME_MULTIPLIERS[TIME_MULTIPLIERS.length - 1] || 1);
        
        const maxPop = Math.max(...data, 1); 
        const minPop = Math.min(...data) * 0.85; 
        
        const width = 260;
        const height = 40;
        
        const xScale = scaleLinear<number, number>().domain([0, YEARS.length - 1]).range([0, width]);
        const yScale = scaleLinear<number, number>().domain([minPop, maxPop]).range([height, 0]);
        
        const lineGen = line<number>()
            .x((_, i) => xScale(i))
            .y(d => yScale(d))
            .curve(curveBasis);
            
        const path = lineGen(data) || "";
        
        const strokeColor = document.body.classList.contains('light-mode') ? '#0D9488' : '#14B8A6';
        
        const lastDataPoint = data[data.length - 1] || 0;
        const lastX = xScale(YEARS.length - 1);
        const lastY = yScale(lastDataPoint);
        
        return `
            <div class="sparkline-container">
                <div class="sparkline-title">Population Trend (Est. 1980-2026)</div>
                <svg width="${width}" height="${height}" style="overflow: visible;">
                    <path d="${path}" fill="none" stroke="${strokeColor}" stroke-width="2" />
                    <circle cx="${lastX}" cy="${lastY}" r="3" fill="${strokeColor}" />
                </svg>
            </div>
        `;
    }

    getFormattedReligions(relArray: Religion[]) {
        if (!relArray || relArray.length === 0) return "Data Unavailable";
        
        return relArray.map(r => {
            let color = document.body.classList.contains('light-mode') ? "#0F172A" : "#FFFFFF"; 
            let fontWeight = "600";
            
            if (r.name.includes("Islam")) color = "#22C55E"; 
            if (r.name.includes("Christianity")) color = "#3B82F6"; 
            
            return `<span style="color: ${color}; font-weight: ${fontWeight};">${r.name} (${r.percent}%)</span>`;
        }).join("<br>");
    }

    getCountryHtml(d: any) {
        if (this.isDrillDown) {
            const name = d.properties?.name || d.properties?.NAME || d.properties?.name_en || "Unknown Province";
            const type = d.properties?.type_en || d.properties?.type || "Province / State";
            return `
                <div class="tooltip-title">${name}</div>
                <div class="tooltip-row"><span>Region Type:</span> <span>${type}</span></div>
                <div class="tooltip-row"><span>Admin Level:</span> <span>Level 1</span></div>
            `;
        }

        const meta = this.getMeta(d);
        const mappedId = geoToIsoMap[d.id] || d.id;
        
        const lang = languageData[mappedId] || "Data Unavailable";
        const extra = extraData[mappedId] || { civ: "Data Unavailable", rel: [] };

        const basePop = meta && meta.population ? meta.population : 0;
        const currentPop = basePop * (TIME_MULTIPLIERS[this.currentYearIndex] || 1);
        
        const name = meta ? meta.name : (d.properties?.name || "Unknown");
        const region = meta ? (meta.region || 'N/A') : 'N/A';
        const popText = Math.round(currentPop) > 0 ? Math.round(currentPop).toLocaleString() : '0';

        return `
            <div class="tooltip-title">${name}</div>
            <div class="tooltip-row"><span>Region:</span> <span>${region}</span></div>
            <div class="tooltip-row"><span>Population:</span> <span>${popText}</span></div>
            ${basePop > 0 ? this.generateSparkline(basePop, mappedId) : ''}
            <div class="tooltip-row" style="margin-top: 8px;"><span>Language:</span> <span>${lang}</span></div>
            <div class="tooltip-row"><span>Civilization:</span> <span>${extra.civ}</span></div>
            <div class="tooltip-row" style="flex-direction: column; gap: 4px; margin-top: 8px;">
                <span style="color: var(--text-muted); font-size: 12px; margin-bottom: 4px;">Top Religions:</span> 
                <span style="text-align: left; font-weight: normal; line-height: 1.5;">${this.getFormattedReligions(extra.rel)}</span>
            </div>
            <div style="margin-top: 12px; text-align: center; color: var(--accent-teal); font-size: 11px; font-weight: bold; border-top: 1px solid var(--panel-border); padding-top: 8px;">
                ${this.isCompareMode ? '🖱️ Click to select for comparison' : '🖱️ Click to view provinces'}
            </div>
        `;
    }

    bindEvents(selection: any, isLabel: boolean = false) {
        selection
            .on('mouseover', (event: any, d: any) => {
                if (!this.isTooltipPinned) this.showTooltip(event, this.getCountryHtml(d));
                const targetPath = isLabel ? select(`#country-${d.id || d.properties?.name}`) : select(event.currentTarget);
                targetPath.style('stroke', '#14B8A6').style('stroke-width', '1.5px');
            })
            .on('mousemove', (event: any) => { if (!this.isTooltipPinned) this.moveTooltip(event); })
            .on('mouseout', (event: any, d: any) => {
                if (!this.isTooltipPinned) this.hideTooltip();
                const targetPath = isLabel ? select(`#country-${d.id || d.properties?.name}`) : select(event.currentTarget);
                
                const mappedId = geoToIsoMap[d.id] || d.id;
                if (!this.selectedCountries.includes(mappedId)) {
                    targetPath.style('stroke', 'var(--country-stroke)').style('stroke-width', '0.5px');
                }
            })
            .on('click', (event: any, d: any) => {
                event.stopPropagation(); 
                
                const mappedId = geoToIsoMap[d.id] || d.id;

                if (this.isCompareMode) {
                    if (this.selectedCountries.includes(mappedId)) {
                        this.selectedCountries = this.selectedCountries.filter(c => c !== mappedId);
                        const targetPath = isLabel ? select(`#country-${d.id}`) : select(event.currentTarget);
                        targetPath.classed('selected', false).style('stroke', 'var(--country-stroke)').style('stroke-width', '0.5px');
                    } else {
                        if (this.selectedCountries.length < 5) {
                            this.selectedCountries.push(mappedId);
                            const targetPath = isLabel ? select(`#country-${d.id}`) : select(event.currentTarget);
                            targetPath.classed('selected', true);
                            if (isLabel) select(`#country-${d.id}`).classed('selected', true);
                        } else {
                            alert("You can only compare up to 5 countries at a time.");
                        }
                    }
                    this.updateComparisonPanel();
                    return;
                }

                if (!this.isDrillDown) {
                    const meta = this.getMeta(d);
                    if (meta && mappedId) {
                        this.drillDown(mappedId);
                        return;
                    }
                }

                this.isTooltipPinned = true;
                this.showTooltip(event, this.getCountryHtml(d));
            });
    }

    renderBaseMap() {
        const showMicro = (document.getElementById('microstates-checkbox') as HTMLInputElement)?.checked ?? true;
        
        let features = this.geoData.features;
        if (!showMicro && !this.isDrillDown) {
            features = features.filter((f: any) => !MICROSTATES.includes(geoToIsoMap[f.id] || f.id));
        }

        const paths = this.mapGroup.append('g').attr('id', 'base-layer')
            .selectAll('path')
            .data(features)
            .enter().append('path')
            .attr('class', (d: any) => {
                const mappedId = geoToIsoMap[d.id] || d.id;
                return `country ${this.selectedCountries.includes(mappedId) ? 'selected' : ''}`;
            })
            .attr('id', (d: any) => `country-${d.id || d.properties?.name || Math.random()}`)
            .attr('d', this.pathGenerator)
            .style('fill', (d: any) => {
                if (this.isDrillDown) return document.body.classList.contains('light-mode') ? '#93C5FD' : '#3B82F6'; 
                
                const mappedId = geoToIsoMap[d.id] || d.id;
                if (this.customColors && this.customColors[mappedId]) return this.customColors[mappedId];
                
                const meta = this.getMeta(d);
                const currentPop = meta && meta.population ? meta.population * (TIME_MULTIPLIERS[this.currentYearIndex] || 1) : 0;
                return this.getColorForPopulation(currentPop);
            });
            
        this.bindEvents(paths);
    }

    renderLabels() {
        const showMicro = (document.getElementById('microstates-checkbox') as HTMLInputElement)?.checked ?? true;
        let features = this.geoData.features;
        if (!showMicro && !this.isDrillDown) {
            features = features.filter((f: any) => !MICROSTATES.includes(geoToIsoMap[f.id] || f.id));
        }

        const labels = this.mapGroup.append('g').attr('id', 'labels-layer')
            .selectAll('text')
            .data(features)
            .enter().append('text')
            .attr('class', 'country-label')
            .attr('x', (d: any) => { const c = this.pathGenerator.centroid(d); return c ? c[0] : 0; })
            .attr('y', (d: any) => { const c = this.pathGenerator.centroid(d); return c ? c[1] : 0; })
            .text((d: any) => {
                if (this.isDrillDown) return (d.properties?.name || d.properties?.NAME || d.properties?.name_en || "").substring(0, 10);
                const meta = this.getMeta(d);
                return meta ? meta.name.substring(0, 10) : (d.properties?.name || "").substring(0, 10);
            });
            
        this.bindEvents(labels, true); 
    }

    renderEvents() {
        const group = this.mapGroup.append('g').attr('id', 'events-layer').style('opacity', 0).style('pointer-events', 'none');
        
        group.selectAll('circle.pulse').data(this.eventsData.features).enter().append('circle').attr('class', 'pulse')
            .attr('cx', (d: any) => this.projection(d.geometry.coordinates)?.[0] || 0)
            .attr('cy', (d: any) => this.projection(d.geometry.coordinates)?.[1] || 0).attr('r', 6);

        group.selectAll('circle.event-marker')
            .data(this.eventsData.features)
            .enter().append('circle')
            .attr('class', 'event-marker')
            .attr('cx', (d: any) => this.projection(d.geometry.coordinates)?.[0] || 0)
            .attr('cy', (d: any) => this.projection(d.geometry.coordinates)?.[1] || 0)
            .attr('r', 4)
            .on('mouseover', (event: any, d: any) => {
                if (!this.isTooltipPinned) {
                    const html = `<div class="tooltip-date">${d.properties.date}</div><div class="tooltip-title event-title">${d.properties.title}</div><div class="tooltip-desc">${d.properties.description}</div>`;
                    this.showTooltip(event, html);
                }
            })
            .on('mousemove', (event: any) => { if (!this.isTooltipPinned) this.moveTooltip(event); })
            .on('mouseout', () => { if (!this.isTooltipPinned) this.hideTooltip(); });
    }

    toggleCompareMode(forceState?: boolean) {
        if (typeof forceState === 'boolean') {
            this.isCompareMode = forceState;
            const cb = document.getElementById('compare-checkbox') as HTMLInputElement;
            if (cb) cb.checked = forceState;
        } else {
            this.isCompareMode = !this.isCompareMode;
        }

        const panel = document.getElementById('compare-panel');
        
        if (this.isCompareMode) {
            if (panel) panel.classList.add('active');
        } else {
            if (panel) panel.classList.remove('active');
            this.selectedCountries = [];
            this.mapGroup.selectAll('.country').classed('selected', false).style('stroke', 'var(--country-stroke)').style('stroke-width', '0.5px');
            this.updateComparisonPanel();
        }
    }

    updateComparisonPanel() {
        const svg = select('#compare-chart');
        if (svg.empty()) return; // Component not in DOM
        
        svg.selectAll('*').remove(); 

        if (this.selectedCountries.length === 0) return;

        const data = this.selectedCountries.map(code => {
            const meta = this.countryData[code];
            return {
                code: code,
                name: meta ? meta.name : code,
                population: meta && meta.population ? meta.population : 0
            };
        }).sort((a, b) => b.population - a.population);

        const panel = document.getElementById('compare-panel');
        const width = panel ? panel.clientWidth - 48 : 800;
        const height = 150;
        
        const margin = { top: 20, right: 30, bottom: 20, left: 100 };

        const xScale = scaleLinear()
            .domain([0, Math.max(...data.map(d => d.population))])
            .range([margin.left, width - margin.right]);

        const yScale = scaleBand()
            .domain(data.map(d => d.name))
            .range([margin.top, height - margin.bottom])
            .padding(0.3);

        const barColor = document.body.classList.contains('light-mode') ? '#0D9488' : '#14B8A6';

        svg.selectAll('.bar')
            .data(data)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', margin.left)
            .attr('y', d => yScale(d.name) || 0)
            .attr('width', d => Math.max(0, xScale(d.population) - margin.left))
            .attr('height', yScale.bandwidth())
            .attr('fill', barColor)
            .attr('rx', 4);

        svg.selectAll('.bar-label')
            .data(data)
            .enter().append('text')
            .attr('class', 'bar-label')
            .attr('x', margin.left - 10)
            .attr('y', d => (yScale(d.name) || 0) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'end')
            .text(d => d.name);

        svg.selectAll('.bar-value')
            .data(data)
            .enter().append('text')
            .attr('class', 'bar-value')
            .attr('x', d => xScale(d.population) + 8)
            .attr('y', d => (yScale(d.name) || 0) + yScale.bandwidth() / 2)
            .attr('dy', '0.35em')
            .attr('text-anchor', 'start')
            .text(d => d.population.toLocaleString());
    }

    async fetchLiveData() {
        const loader = document.getElementById('loading-overlay');
        const loaderText = document.getElementById('loader-text');
        if (loader) loader.style.display = 'flex';
        if (loaderText) loaderText.innerText = "Fetching Live Data from API...";

        try {
            const res = await fetch('https://restcountries.com/v3.1/all?fields=cca2,population');
            if (!res.ok) throw new Error("API request failed");
            
            const liveData = await res.json();
            let updatedCount = 0;

            liveData.forEach((country: any) => {
                const code = country.cca2;
                if (this.countryData[code]) {
                    this.countryData[code].population = country.population;
                    updatedCount++;
                }
            });

            console.log(`Updated ${updatedCount} countries with live data.`);
            
            this.updateMapForYear(); 
            if (this.isCompareMode) this.updateComparisonPanel();

            if (loader) loader.style.display = 'none';
            alert(`Successfully updated live data for ${updatedCount} countries!`);
            
        } catch (e) {
            console.error("Failed to fetch live data:", e);
            if (loader) loader.style.display = 'none';
            alert("Failed to fetch live data. The REST Countries API might be down or rate-limited.");
        }
    }

    async drillDown(countryCode: string) {
        const loader = document.getElementById('loading-overlay');
        if (loader) loader.style.display = 'flex'; 
        console.log("Starting drill down for:", countryCode);
        
        try {
            if (!this.allProvincesData) {
                const res = await fetch('https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                this.allProvincesData = await res.json();
            }
            
            const countryName = this.countryData[countryCode]?.name || "Unknown";
            
            const filteredFeatures = this.allProvincesData.features.filter((f: any) => {
                const props = f.properties;
                return props.iso_a2 === countryCode || 
                       props.adm0_a3 === countryCode ||
                       (props.admin && props.admin.toLowerCase() === countryName.toLowerCase());
            });
            
            if (filteredFeatures.length === 0) {
                alert(`No detailed province data found for ${countryName} in the global dataset.`);
                if (loader) loader.style.display = 'none';
                return;
            }
            
            this.geoData = { type: "FeatureCollection", features: filteredFeatures };
            this.isDrillDown = true;
            const backBtn = document.getElementById('back-btn');
            if (backBtn) backBtn.style.display = 'block'; 
            
            this.projectionType = 'geoMercator';
            const projSelect = document.getElementById('projection-select') as HTMLSelectElement;
            if (projSelect) projSelect.value = 'geoMercator';
            
            this.drawMap();
            this.resetView();
            if (loader) loader.style.display = 'none'; 
            
        } catch (e) {
            console.error("Failed to load province data:", e);
            if (loader) loader.style.display = 'none'; 
            alert("Failed to fetch province data. Check your console (F12) for details.");
        }
    }

    resetToWorld() {
        this.isDrillDown = false;
        this.geoData = JSON.parse(JSON.stringify(this.originalGeoData)); 
        const backBtn = document.getElementById('back-btn');
        if (backBtn) backBtn.style.display = 'none'; 
        
        this.projectionType = 'geoNaturalEarth1';
        const projSelect = document.getElementById('projection-select') as HTMLSelectElement;
        if (projSelect) projSelect.value = 'geoNaturalEarth1';

        this.drawMap();
        this.resetView();
    }

    exportCSV() {
        if (this.isDrillDown) {
            alert("CSV Export is currently configured for the World map only.");
            return;
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvContent += "Code,Name,Region,Population,Sovereignty\n";

        Object.keys(this.countryData).forEach(key => {
            if (key === "World") return;
            const data = this.countryData[key];
            const pop = data.population || 0;
            const sov = data.sovereignty || "";
            csvContent += `${key},${data.name},${data.region || ""},${pop},${sov}\n`;
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "polygon-data.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    handleFileUpload(event: any) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed && parsed.type === "FeatureCollection" && parsed.features) {
                    this.geoData = parsed;
                    this.isDrillDown = true; 
                    const backBtn = document.getElementById('back-btn');
                    if (backBtn) backBtn.style.display = 'block';
                    
                    this.drawMap();
                    this.resetView();
                    console.log("Custom GeoJSON loaded successfully.");
                } else {
                    alert("Invalid GeoJSON format. Must be a FeatureCollection.");
                }
            } catch (error) {
                alert("Error parsing JSON file. Please ensure it is valid GeoJSON.");
            }
        };
        reader.readAsText(file);
    }

    update(customData: Record<string, string>) {
        this.customColors = customData;
        this.pauseAnimation();
        this.mapGroup.selectAll('path.country').transition().duration(500).style('fill', (d: any) => {
            if (this.isDrillDown) return document.body.classList.contains('light-mode') ? '#93C5FD' : '#3B82F6';
            const mappedId = geoToIsoMap[d.id] || d.id;
            if (this.customColors && this.customColors[mappedId]) return this.customColors[mappedId];
            return document.body.classList.contains('light-mode') ? '#CBD5E1' : '#334155'; 
        });
    }

    highlightGroup(regionCode: string) {
        this.customColors = null; 
        this.mapGroup.selectAll('path.country').transition().duration(500).style('fill', (d: any) => {
            if (this.isDrillDown) return document.body.classList.contains('light-mode') ? '#93C5FD' : '#3B82F6';
            const meta = this.getMeta(d);
            if (meta && meta.region === regionCode) {
                return '#14B8A6'; 
            }
            return document.body.classList.contains('light-mode') ? '#E2E8F0' : '#1E293B'; 
        });
    }

    table(htmlString: string) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlString, 'text/html');
        const table = doc.querySelector('table');
        if (!table) { console.warn("No table found in HTML."); return; }

        const headers = Array.from(table.querySelectorAll('th')).map(th => th.innerText.toLowerCase().trim());
        const nameIdx = headers.findIndex(h => h.includes('country') || h.includes('name') || h.includes('iso'));
        const valIdx = headers.findIndex(h => h.includes('population') || h.includes('value') || h.includes('count'));

        if (nameIdx === -1 || valIdx === -1) { console.warn("Could not find 'Country' or 'Population' columns."); return; }

        const scrapedData: Record<string, string> = {};
        const rows = Array.from(table.querySelectorAll('tbody tr'));

        rows.forEach(row => {
            const cells = Array.from(row.querySelectorAll('td'));
            if (cells.length > Math.max(nameIdx, valIdx)) {
                const countryName = cells[nameIdx]!.innerText.trim().toLowerCase();
                const val = parseInt(cells[valIdx]!.innerText.replace(/,/g, ''), 10);
                
                let iso = Object.keys(this.countryData).find(key => 
                    this.countryData[key].name.toLowerCase() === countryName
                );

                if (iso && !isNaN(val)) {
                    scrapedData[iso] = this.colorScale(val);
                }
            }
        });

        this.update(scrapedData);
        console.log("Scraped Data Applied:", scrapedData);
    }

    setupEventListeners() {
        const panel = document.getElementById('layers-panel');
        const dragHandle = document.getElementById('panel-drag-handle');

        if (panel && dragHandle) {
            dragHandle.addEventListener('mousedown', (e: any) => {
                if (e.target.closest('.toggle-btn')) return; 

                this.isDraggingPanel = true;
                const rect = panel.getBoundingClientRect();
                this.panelOffsetX = e.clientX - rect.left;
                this.panelOffsetY = e.clientY - rect.top;
                
                panel.style.right = 'auto'; 
                panel.style.left = `${rect.left}px`;
                panel.style.top = `${rect.top}px`;
                panel.style.transition = 'none'; 
            });

            document.addEventListener('mousemove', (e: any) => {
                if (!this.isDraggingPanel) return;
                panel.style.left = `${e.clientX - this.panelOffsetX}px`;
                panel.style.top = `${e.clientY - this.panelOffsetY}px`;
            });

            document.addEventListener('mouseup', () => {
                if (this.isDraggingPanel) {
                    this.isDraggingPanel = false;
                    panel.style.transition = 'all 0.3s ease'; 
                }
            });
        }

        const fileUpload = document.getElementById('file-upload');
        if (fileUpload) fileUpload.addEventListener('change', (e) => this.handleFileUpload(e));

        const labelsCheck = document.getElementById('labels-checkbox');
        if (labelsCheck) labelsCheck.addEventListener('change', (e) => {
            const layer = document.getElementById('labels-layer');
            if (layer) layer.style.opacity = (e.target as HTMLInputElement).checked ? '1' : '0';
        });

        const antarcticaCheck = document.getElementById('antarctica-checkbox');
        if (antarcticaCheck) antarcticaCheck.addEventListener('change', (e) => {
            const antarctica = document.getElementById('country-ATA');
            if (antarctica) (antarctica as HTMLElement).style.display = (e.target as HTMLInputElement).checked ? 'block' : 'none';
        });

        const oceanCheck = document.getElementById('ocean-checkbox');
        if (oceanCheck) oceanCheck.addEventListener('change', (e) => {
            const isChecked = (e.target as HTMLInputElement).checked;
            if (this.projectionType === 'geoOrthographic') {
                const sphere = this.mapGroup.select('.ocean-sphere');
                if (!sphere.empty()) {
                    sphere.style('display', isChecked ? 'block' : 'none');
                }
            } else {
                const isLight = document.body.classList.contains('light-mode');
                document.body.style.backgroundColor = isChecked ? (isLight ? '#E2E8F0' : '#0c4a6e') : '#111827';
            }
        });

        const microCheck = document.getElementById('microstates-checkbox');
        if (microCheck) microCheck.addEventListener('change', () => this.drawMap());

        const eventsCheck = document.getElementById('events-checkbox');
        if (eventsCheck) eventsCheck.addEventListener('change', (e) => {
            const eventsLayer = document.getElementById('events-layer');
            if (eventsLayer) {
                eventsLayer.style.opacity = (e.target as HTMLInputElement).checked ? '1' : '0';
                eventsLayer.style.pointerEvents = (e.target as HTMLInputElement).checked ? 'auto' : 'none';
            }
        });

        const arcsCheck = document.getElementById('arcs-checkbox');
        if (arcsCheck) arcsCheck.addEventListener('change', (e) => {
            const arcsLayer = document.getElementById('arcs-layer');
            if (e.target as HTMLInputElement) {
                if (!arcsLayer) this.renderArcs();
            } else if (arcsLayer) {
                arcsLayer.remove();
            }
        });

        const compareCheck = document.getElementById('compare-checkbox');
        if (compareCheck) compareCheck.addEventListener('change', (e) => {
            this.toggleCompareMode((e.target as HTMLInputElement).checked);
        });

        const projSelect = document.getElementById('projection-select');
        if (projSelect) projSelect.addEventListener('change', (e) => {
            this.projectionType = (e.target as HTMLSelectElement).value;
            this.drawMap();
        });

        const slider = document.getElementById('time-slider') as HTMLInputElement;
        const playBtn = document.getElementById('play-btn') as HTMLButtonElement;
        const dateText = document.getElementById('time-date')!;
        const speedSelect = document.getElementById('speed-select') as HTMLSelectElement;
        const loopCheck = document.getElementById('loop-checkbox') as HTMLInputElement;

        if (slider) slider.addEventListener('input', (e) => {
            this.pauseAnimation();
            this.currentYearIndex = parseInt((e.target as HTMLInputElement).value);
            this.customColors = null; 
            this.updateMapForYear();
            if (dateText) dateText.innerText = (YEARS[this.currentYearIndex] || 2026).toString();
        });

        if (playBtn) playBtn.addEventListener('click', () => { if (this.isPlaying) this.pauseAnimation(); else this.playAnimation(); });
        
        if (speedSelect) speedSelect.addEventListener('change', (e) => { 
            this.animationSpeed = parseInt((e.target as HTMLSelectElement).value); 
            if (this.isPlaying) { 
                this.pauseAnimation(); 
                this.playAnimation(); 
            } 
        });
        
        if (loopCheck) loopCheck.addEventListener('change', (e) => { this.loop = (e.target as HTMLInputElement).checked; });

        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        const dropdown = document.getElementById('autocomplete-list')!;

        if (searchInput && dropdown) {
            searchInput.addEventListener('input', () => {
                const query = searchInput.value.toLowerCase().trim();
                dropdown.innerHTML = ''; 
                
                if (query.length > 0) {
                    const matches = Object.values(this.countryData).filter((c: any) => 
                        c.name && c.name.toLowerCase().includes(query) && c.code !== "World"
                    ).slice(0, 8);

                    if (matches.length > 0) {
                        dropdown.style.display = 'block';
                        matches.forEach((match: any) => {
                            const div = document.createElement('div');
                            div.className = 'autocomplete-item';
                            div.innerText = match.name;
                            div.onclick = () => {
                                searchInput.value = match.name;
                                dropdown.style.display = 'none';
                                this.flyTo(match.name);
                                this.unpinTooltip();
                            };
                            dropdown.appendChild(div);
                        });
                    } else {
                        dropdown.style.display = 'none';
                    }
                } else {
                    dropdown.style.display = 'none';
                }
            });

            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
                    dropdown.style.display = 'none';
                }
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = searchInput.value.trim();
                    dropdown.style.display = 'none';
                    if (query) { this.flyTo(query); this.unpinTooltip(); }
                }
            });
        }

        const fsBtn = document.getElementById('fullscreen-btn');
        if (fsBtn) fsBtn.addEventListener('click', () => {
            if (!document.fullscreenElement) document.documentElement.requestFullscreen();
            else if (document.exitFullscreen) document.exitFullscreen();
        });

        this.svg.on('click', () => this.unpinTooltip());
    }

    updateMapForYear() {
        if (this.isDrillDown) return; 
        
        const multiplier = TIME_MULTIPLIERS[this.currentYearIndex] || 1;
        this.mapGroup.selectAll('path.country')
            .transition().duration(300)
            .style('fill', (d: any) => {
                const meta = this.getMeta(d);
                const historicalPop = meta && meta.population ? meta.population * multiplier : 0;
                return this.getColorForPopulation(historicalPop);
            });
    }

    playAnimation() {
        this.isPlaying = true;
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.innerHTML = PAUSE_ICON;
        if (this.currentYearIndex === YEARS.length - 1) this.currentYearIndex = 0;

        this.animationInterval = setInterval(() => {
            this.currentYearIndex++;
            if (this.currentYearIndex >= YEARS.length) {
                if (this.loop) { this.currentYearIndex = 0; } 
                else { this.currentYearIndex = YEARS.length - 1; this.pauseAnimation(); return; }
            }
            const slider = document.getElementById('time-slider') as HTMLInputElement;
            if (slider) slider.value = this.currentYearIndex.toString();
            const dateText = document.getElementById('time-date');
            if (dateText) dateText.innerText = (YEARS[this.currentYearIndex] || 2026).toString();
            this.updateMapForYear();
        }, this.animationSpeed); 
    }

    pauseAnimation() {
        this.isPlaying = false;
        const playBtn = document.getElementById('play-btn');
        if (playBtn) playBtn.innerHTML = PLAY_ICON;
        if (this.animationInterval) { clearInterval(this.animationInterval); this.animationInterval = null; }
    }

    flyTo(countryName: string) {
        if (this.projectionType === 'geoOrthographic' || this.isDrillDown) return;

        const searchLower = countryName.toLowerCase().trim();
        const feature = this.geoData.features.find((f: any) => {
            const meta = this.getMeta(f);
            const name = meta ? meta.name.toLowerCase() : (f.properties?.name || "").toLowerCase();
            return name.includes(searchLower);
        });

        if (!feature) return;

        const bounds = this.pathGenerator.bounds(feature);
        const dx = bounds[1][0] - bounds[0][0];
        const dy = bounds[1][1] - bounds[0][1];
        const x = (bounds[0][0] + bounds[1][0]) / 2;
        const y = (bounds[0][1] + bounds[1][1]) / 2;
        const scale = Math.max(1, Math.min(10, 0.8 / Math.max(dx / this.width, dy / this.height)));
        const tx = this.width / 2 - scale * x;
        const ty = this.height / 2 - scale * y;

        this.svg.transition().duration(1250).call(this.zoomBehavior.transform, zoomIdentity.translate(tx, ty).scale(scale));
    }

    addMarker(lat: number, lng: number, label: string, save: boolean = true) {
        const coords = this.projection([lng, lat]);
        if (!coords) return;
        const x = coords[0];
        const y = coords[1];

        if (save) this.addedMarkers.push({ lat, lng, label });

        const markerGroup = this.mapGroup.append('g').attr('class', 'custom-marker-group');
        
        markerGroup.append('circle')
            .datum({ lat, lng })
            .attr('class', 'custom-marker')
            .attr('cx', x).attr('cy', y).attr('r', 5);
            
        markerGroup.append('text')
            .datum({ lat, lng })
            .attr('class', 'custom-marker-text')
            .attr('x', x).attr('y', y - 10).text(label);
    }

    resetView() {
        this.customColors = null;
        if (!this.isDrillDown) this.updateMapForYear();
        
        if (this.projectionType === 'geoOrthographic') {
            this.globeRotation = [0, -20];
            this.projection.rotate(this.globeRotation);
            this.updateProjection();
        } else {
            this.svg.transition().duration(1000).call(this.zoomBehavior.transform, zoomIdentity);
        }
        
        this.unpinTooltip();
    }

    downloadSVG() {
        const svgElement = document.querySelector('#' + this.svg.node().parentNode.id + ' svg') as SVGSVGElement;
        if (!svgElement) return;
        
        const clone = svgElement.cloneNode(true) as SVGSVGElement;
        
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `
            .country { stroke: var(--country-stroke); stroke-width: 0.5px; }
            .country-label { fill: var(--text-main); font-size: 8px; text-anchor: middle; text-shadow: 1px 1px 2px var(--bg-color); }
            .event-marker { fill: #EF4444; stroke: #FFF; stroke-width: 1px; }
            .pulse { fill: none; stroke: #EF4444; stroke-width: 1px; }
            .custom-marker { fill: #F59E0B; stroke: #FFF; stroke-width: 1.5px; }
            .custom-marker-text { fill: var(--text-main); font-size: 10px; font-weight: 700; text-anchor: middle; text-shadow: 1px 1px 2px var(--bg-color); }
            .arc-path { fill: none; stroke: var(--accent-teal); stroke-width: 1.5px; stroke-dasharray: 4 4; opacity: 0.7; }
        `;
        clone.prepend(style);
        
        const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        rect.setAttribute('width', '100%');
        rect.setAttribute('height', '100%');
        rect.setAttribute('fill', this.projectionType === 'geoOrthographic' ? (document.body.classList.contains('light-mode') ? '#E0E7FF' : '#0F172A') : (document.body.classList.contains('light-mode') ? '#E2E8F0' : '#0c4a6e'));
        clone.insertBefore(rect, clone.firstChild);

        const svgString = new XMLSerializer().serializeToString(clone);
        const blob = new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'});
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'polygon-map.svg';
        link.click();
    }

    downloadPNG() {
        const svgElement = document.querySelector('#' + this.svg.node().parentNode.id + ' svg') as SVGSVGElement;
        if (!svgElement) return;
        const clone = svgElement.cloneNode(true) as SVGSVGElement;
        
        const style = document.createElementNS('http://www.w3.org/2000/svg', 'style');
        style.textContent = `.country { stroke: var(--country-stroke); stroke-width: 0.5px; } .country-label { fill: var(--text-main); font-size: 8px; text-anchor: middle; text-shadow: 1px 1px 2px var(--bg-color); } .event-marker { fill: #EF4444; stroke: #FFF; stroke-width: 1px; } .custom-marker { fill: #F59E0B; stroke: #FFF; stroke-width: 1.5px; } .custom-marker-text { fill: var(--text-main); font-size: 10px; font-weight: 700; text-anchor: middle; text-shadow: 1px 1px 2px var(--bg-color); } .arc-path { fill: none; stroke: var(--accent-teal); stroke-width: 1.5px; stroke-dasharray: 4 4; opacity: 0.7; }`;
        clone.prepend(style);

        const svgString = new XMLSerializer().serializeToString(clone);
        const blobURL = window.URL.createObjectURL(new Blob([svgString], {type: 'image/svg+xml;charset=utf-8'}));
        
        const image = new Image();
        image.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = this.width; canvas.height = this.height;
            const context = canvas.getContext('2d')!;
            context.fillStyle = this.projectionType === 'geoOrthographic' ? (document.body.classList.contains('light-mode') ? '#E0E7FF' : '#0F172A') : (document.body.classList.contains('light-mode') ? '#E2E8F0' : '#0c4a6e'); 
            context.fillRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            const png = canvas.toDataURL('image/png');
            const link = document.createElement('a'); link.href = png; link.download = `polygon-map.png`; link.click();
        };
        image.src = blobURL;
    }

    showTooltip(event: MouseEvent, htmlContent: string) {
        this.tooltip.innerHTML = htmlContent;
        this.tooltip.style.display = 'block';
        this.moveTooltip(event);
        if (this.isTooltipPinned) {
            this.tooltip.classList.add('pinned');
            if (!this.tooltip.querySelector('.tooltip-close')) {
                const closeBtn = document.createElement('div'); closeBtn.className = 'tooltip-close'; closeBtn.innerHTML = '&times;';
                closeBtn.onclick = () => this.unpinTooltip(); this.tooltip.appendChild(closeBtn);
            }
        } else { this.tooltip.classList.remove('pinned'); }
    }

    moveTooltip(event: MouseEvent) {
        let x = event.pageX + 15; let y = event.pageY + 15;
        const rect = this.tooltip.getBoundingClientRect();
        if (x + rect.width > window.innerWidth) x = event.pageX - rect.width - 15;
        if (y + rect.height > window.innerHeight) y = event.pageY - rect.height - 15;
        this.tooltip.style.left = x + 'px'; this.tooltip.style.top = y + 'px';
    }

    hideTooltip() { this.tooltip.style.display = 'none'; this.tooltip.classList.remove('pinned'); }
    unpinTooltip() { this.isTooltipPinned = false; this.hideTooltip(); this.mapGroup.selectAll('.country').style('stroke', 'var(--country-stroke)').style('stroke-width', '0.5px'); }
}

// Auto-initialize for the local Vite demo if the #map container exists
if (document.getElementById('map')) {
    setTimeout(() => {
        const map = new PolygonMap('map');
        map.addMarker(48.8566, 2.3522, "Paris"); 
        map.addMarker(35.6762, 139.6503, "Tokyo");
    }, 500);
}