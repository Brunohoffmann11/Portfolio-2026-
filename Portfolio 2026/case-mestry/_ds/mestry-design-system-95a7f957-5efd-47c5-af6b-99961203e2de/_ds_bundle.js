/* @ds-bundle: {"format":3,"namespace":"MestryDesignSystem_95a7f9","components":[],"sourceHashes":{"ui_kits/web-app/AccountSettings.jsx":"082e18b1bd02","ui_kits/web-app/App.jsx":"95ebd76d253d","ui_kits/web-app/Buttons.jsx":"a2072d2cb72b","ui_kits/web-app/Cards.jsx":"06dacfc96fba","ui_kits/web-app/Icons.jsx":"23f5e9d20085","ui_kits/web-app/Placeholders.jsx":"6fd5a65dd7b2","ui_kits/web-app/Sidebar.jsx":"b7d508be32b2","ui_kits/web-app/SubNav.jsx":"3c9be20f08f5","ui_kits/web-app/TopBar.jsx":"98b7a17192dc"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.MestryDesignSystem_95a7f9 = window.MestryDesignSystem_95a7f9 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/web-app/AccountSettings.jsx
try { (() => {
// AccountSettings.jsx — the verified screen (Minha conta → Moeda)

const ACCOUNT_SECTIONS = [{
  id: "dados",
  title: "Dados básicos",
  desc: "Configure seus dados básicos",
  icon: IconUser
}, {
  id: "seguranca",
  title: "Segurança",
  desc: "Gerencie sua senha",
  icon: IconLock
}, {
  id: "configuracoes",
  title: "Configurações",
  desc: "Configure informações de sua conta",
  icon: IconSettings
}, {
  id: "notificacoes",
  title: "Notificações",
  desc: "Configure suas notificações",
  icon: IconBell
}, {
  id: "regional",
  title: "Moeda e Fuso horário",
  desc: "Configure suas preferências regionais",
  icon: IconDollar
}];
const CURRENCIES = [{
  code: "BRL",
  label: "Real Brasileiro",
  symbol: "R$",
  samples: ["R$ 1.250,00", "R$ 45.780,50", "R$ 890,75", "R$ 15.600,00"]
}, {
  code: "USD",
  label: "Dólar Americano",
  symbol: "$",
  samples: ["$ 1,250.00", "$ 45,780.50", "$ 890.75", "$ 15,600.00"]
}, {
  code: "EUR",
  label: "Euro",
  symbol: "€",
  samples: ["€ 1.250,00", "€ 45.780,50", "€ 890,75", "€ 15.600,00"]
}];
const CurrencyTab = ({
  selected,
  onSelect
}) => {
  const active = CURRENCIES.find(c => c.code === selected) || CURRENCIES[0];
  return /*#__PURE__*/React.createElement("div", {
    className: "currency-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "column-label"
  }, "Selecione a moeda"), CURRENCIES.map(c => /*#__PURE__*/React.createElement(SelectionCard, {
    key: c.code,
    icon: c.symbol,
    title: c.code,
    sub: c.label,
    selected: c.code === selected,
    onClick: () => onSelect(c.code)
  }))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
    className: "column-label"
  }, "Pr\xE9via de valores"), /*#__PURE__*/React.createElement("div", {
    className: "preview-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "active-cur"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ico"
  }, active.symbol), /*#__PURE__*/React.createElement("div", {
    className: "meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "lbl"
  }, "Moeda ativa"), /*#__PURE__*/React.createElement("div", {
    className: "val"
  }, active.code))), /*#__PURE__*/React.createElement("div", {
    className: "preview-list-label"
  }, /*#__PURE__*/React.createElement(IconInfo, {
    size: 12
  }), "Exemplos de exibi\xE7\xE3o:"), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("tbody", null, active.samples.map((s, i) => /*#__PURE__*/React.createElement("tr", {
    key: i
  }, /*#__PURE__*/React.createElement("td", null, "Valor ", i + 1), /*#__PURE__*/React.createElement("td", null, s))))))));
};
const TimezoneTab = () => /*#__PURE__*/React.createElement("div", {
  className: "placeholder",
  style: {
    padding: "20px 0"
  }
}, /*#__PURE__*/React.createElement("span", {
  className: "badge"
}, "Sem refer\xEAncia"), /*#__PURE__*/React.createElement("h1", {
  style: {
    fontSize: 18,
    marginTop: 10
  }
}, "Fuso hor\xE1rio"), /*#__PURE__*/React.createElement("p", null, "Esta tela n\xE3o estava na captura de origem. Encaminhar uma refer\xEAncia para reconstru\xE7\xE3o fiel."));
const AccountSettings = () => {
  const [section, setSection] = React.useState("regional");
  const [tab, setTab] = React.useState("moeda");
  const [currency, setCurrency] = React.useState("BRL");
  const [collapsed, setCollapsed] = React.useState(false);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "page-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "collapse",
    onClick: () => setCollapsed(!collapsed),
    title: "Recolher"
  }, /*#__PURE__*/React.createElement(IconChevronsLeft, {
    size: 20
  })), /*#__PURE__*/React.createElement("div", {
    className: "titles"
  }, /*#__PURE__*/React.createElement("h1", null, "Minha conta"), /*#__PURE__*/React.createElement("p", null, "Visualize e gerencie as informa\xE7\xF5es da sua conta")), /*#__PURE__*/React.createElement("div", {
    className: "actions"
  }, /*#__PURE__*/React.createElement(OutlineButton, {
    icon: IconPencil
  }, "Editar dados"))), /*#__PURE__*/React.createElement("div", {
    className: "account"
  }, /*#__PURE__*/React.createElement(SubNav, {
    items: ACCOUNT_SECTIONS,
    active: section,
    onSelect: setSection
  }), /*#__PURE__*/React.createElement("div", {
    className: "account-body"
  }, /*#__PURE__*/React.createElement("h2", null, section === "regional" ? "Configurações regionais" : ACCOUNT_SECTIONS.find(s => s.id === section)?.title), /*#__PURE__*/React.createElement("p", {
    className: "body-desc"
  }, section === "regional" ? "Configure suas preferências regionais" : ACCOUNT_SECTIONS.find(s => s.id === section)?.desc), section === "regional" ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "tabs"
  }, /*#__PURE__*/React.createElement("div", {
    className: `tab ${tab === "moeda" ? "active" : ""}`,
    onClick: () => setTab("moeda")
  }, /*#__PURE__*/React.createElement(IconDollar, {
    size: 16
  }), "Moeda"), /*#__PURE__*/React.createElement("div", {
    className: `tab ${tab === "fuso" ? "active" : ""}`,
    onClick: () => setTab("fuso")
  }, /*#__PURE__*/React.createElement(IconClock, {
    size: 16
  }), "Fuso hor\xE1rio")), tab === "moeda" ? /*#__PURE__*/React.createElement(CurrencyTab, {
    selected: currency,
    onSelect: setCurrency
  }) : /*#__PURE__*/React.createElement(TimezoneTab, null), /*#__PURE__*/React.createElement(InfoNotice, {
    action: /*#__PURE__*/React.createElement(PrimaryButton, null, "Salvar altera\xE7\xF5es")
  }, "As altera\xE7\xF5es afetar\xE3o todos os usu\xE1rios do workspace")) : /*#__PURE__*/React.createElement("div", {
    className: "placeholder",
    style: {
      padding: "24px 0"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "badge"
  }, "Sem refer\xEAncia"), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14
    }
  }, "Esta se\xE7\xE3o n\xE3o estava na captura de origem. Encaminhar uma refer\xEAncia para reconstru\xE7\xE3o fiel.")))));
};
Object.assign(window, {
  AccountSettings
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/AccountSettings.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/App.jsx
try { (() => {
// App.jsx — top-level
const PAGE_META = {
  home: {
    breadcrumb: "Home",
    title: "Home",
    desc: "Visão geral do seu workspace"
  },
  dashboard: {
    breadcrumb: "Dashboard",
    title: "Dashboard",
    desc: "Métricas principais do espaço"
  },
  reports: {
    breadcrumb: "Reports",
    title: "Reports",
    desc: "Relatórios detalhados"
  },
  custos: {
    breadcrumb: "Custos",
    title: "Custos",
    desc: "Acompanhe seus gastos com mídia"
  },
  regras: {
    breadcrumb: "Regras",
    title: "Regras de campanhas",
    desc: "Automação de campanhas"
  },
  campanhas: {
    breadcrumb: "Campanhas",
    title: "Campanhas",
    desc: "Suas campanhas ativas"
  },
  funnel: {
    breadcrumb: "Funnel",
    title: "Funnel builder",
    desc: "Construa funis de conversão"
  },
  dominios: {
    breadcrumb: "Domínios",
    title: "Domínios",
    desc: "Gerencie domínios"
  },
  usuarios: {
    breadcrumb: "Usuários",
    title: "Usuários",
    desc: "Convide e gerencie usuários"
  },
  integracoes: {
    breadcrumb: "Integrações",
    title: "Integrações",
    desc: "Conecte serviços externos"
  },
  suporte: {
    breadcrumb: "Suporte",
    title: "Suporte",
    desc: "Fale com nosso time"
  },
  conta: {
    breadcrumb: "Minha conta",
    title: "Minha conta",
    desc: "Visualize e gerencie as informações da sua conta"
  }
};
const App = () => {
  const [page, setPage] = React.useState("conta");
  const [theme, setTheme] = React.useState("dark");
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);
  const meta = PAGE_META[page] || PAGE_META.home;
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(TopBar, {
    breadcrumb: meta.breadcrumb,
    theme: theme,
    onTheme: setTheme
  }), /*#__PURE__*/React.createElement(Sidebar, {
    active: page,
    onNav: setPage,
    onUpgrade: () => alert("Upgrade flow not implemented in this UI kit.")
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, page === "conta" ? /*#__PURE__*/React.createElement(AccountSettings, null) : /*#__PURE__*/React.createElement(PlaceholderPage, {
    title: meta.title,
    desc: meta.desc
  })));
};
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/App.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Buttons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Buttons.jsx
const PrimaryButton = ({
  children,
  icon: IconCmp,
  pill,
  full,
  ...rest
}) => /*#__PURE__*/React.createElement("button", _extends({
  className: `btn primary ${pill ? "pill" : ""} ${full ? "full" : ""}`
}, rest), IconCmp ? /*#__PURE__*/React.createElement(IconCmp, {
  size: 16
}) : null, children);
const OutlineButton = ({
  children,
  icon: IconCmp,
  pill,
  full,
  ...rest
}) => /*#__PURE__*/React.createElement("button", _extends({
  className: `btn outline ${pill ? "pill" : ""} ${full ? "full" : ""}`
}, rest), IconCmp ? /*#__PURE__*/React.createElement(IconCmp, {
  size: 16
}) : null, children);
const GhostButton = ({
  children,
  icon: IconCmp,
  ...rest
}) => /*#__PURE__*/React.createElement("button", _extends({
  className: `btn ghost`
}, rest), IconCmp ? /*#__PURE__*/React.createElement(IconCmp, {
  size: 16
}) : null, children);
const IconOnlyButton = ({
  icon: IconCmp,
  ariaLabel,
  ...rest
}) => /*#__PURE__*/React.createElement("button", _extends({
  className: "icon-btn",
  "aria-label": ariaLabel
}, rest), /*#__PURE__*/React.createElement(IconCmp, {
  size: 18
}));
Object.assign(window, {
  PrimaryButton,
  OutlineButton,
  GhostButton,
  IconOnlyButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Buttons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Cards.jsx
try { (() => {
// Cards.jsx — SelectionCard + InfoNotice
const SelectionCard = ({
  icon,
  title,
  sub,
  selected,
  onClick
}) => /*#__PURE__*/React.createElement("div", {
  className: `sel-card ${selected ? "selected" : ""}`,
  onClick: onClick
}, /*#__PURE__*/React.createElement("div", {
  className: "ico"
}, icon), /*#__PURE__*/React.createElement("div", {
  className: "meta"
}, /*#__PURE__*/React.createElement("div", {
  className: "title"
}, title), /*#__PURE__*/React.createElement("div", {
  className: "sub"
}, sub)), selected ? /*#__PURE__*/React.createElement("div", {
  className: "check"
}, /*#__PURE__*/React.createElement(IconCheck, {
  size: 12,
  style: {
    strokeWidth: 3
  }
})) : /*#__PURE__*/React.createElement("div", {
  className: "ring"
}));
const InfoNotice = ({
  children,
  action
}) => /*#__PURE__*/React.createElement("div", {
  className: "notice"
}, /*#__PURE__*/React.createElement(IconInfo, {
  size: 16
}), /*#__PURE__*/React.createElement("span", null, children), /*#__PURE__*/React.createElement("span", {
  className: "spacer"
}), action);
Object.assign(window, {
  SelectionCard,
  InfoNotice
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Cards.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Icons.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Icons.jsx — Mestry icon set (Lucide-stroke, currentColor)
// Substituted from the Lucide line family. Stroke 2, round caps + joins.
const _svgProps = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24"
};
const Icon = ({
  size = 18,
  children,
  style,
  ...rest
}) => /*#__PURE__*/React.createElement("svg", _extends({
  width: size,
  height: size
}, _svgProps, {
  style: style
}, rest), children);
const IconHome = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "9 22 9 12 15 12 15 22"
}));
const IconGrid = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
  width: "7",
  height: "7",
  x: "3",
  y: "3",
  rx: "1"
}), /*#__PURE__*/React.createElement("rect", {
  width: "7",
  height: "7",
  x: "14",
  y: "3",
  rx: "1"
}), /*#__PURE__*/React.createElement("rect", {
  width: "7",
  height: "7",
  x: "14",
  y: "14",
  rx: "1"
}), /*#__PURE__*/React.createElement("rect", {
  width: "7",
  height: "7",
  x: "3",
  y: "14",
  rx: "1"
}));
const IconBars = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {
  x1: "18",
  x2: "18",
  y1: "20",
  y2: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  x2: "12",
  y1: "20",
  y2: "4"
}), /*#__PURE__*/React.createElement("line", {
  x1: "6",
  x2: "6",
  y1: "20",
  y2: "14"
}));
const IconFile = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M14 2v6h6"
}));
const IconPercent = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {
  x1: "19",
  x2: "5",
  y1: "5",
  y2: "19"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "6.5",
  cy: "6.5",
  r: "2.5"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "17.5",
  cy: "17.5",
  r: "2.5"
}));
const IconListChecks = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "m3 17 2 2 4-4"
}), /*#__PURE__*/React.createElement("path", {
  d: "m3 7 2 2 4-4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M13 6h8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M13 12h8"
}), /*#__PURE__*/React.createElement("path", {
  d: "M13 18h8"
}));
const IconMegaphone = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "m3 11 18-5v12L3 14v-3z"
}), /*#__PURE__*/React.createElement("path", {
  d: "M11.6 16.8a3 3 0 1 1-5.8-1.6"
}));
const IconFlask = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M10 2v7.527a2 2 0 0 1-.211.896L4.72 20.55a1 1 0 0 0 .9 1.45h12.76a1 1 0 0 0 .9-1.45l-5.069-10.127A2 2 0 0 1 14 9.527V2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M8.5 2h7"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7 16h10"
}));
const IconGlobe = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "2",
  x2: "22",
  y1: "12",
  y2: "12"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
}));
const IconUsers = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "9",
  cy: "7",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M22 21v-2a4 4 0 0 0-3-3.87"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16 3.13a4 4 0 0 1 0 7.75"
}));
const IconPlug = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 22v-5"
}), /*#__PURE__*/React.createElement("path", {
  d: "M9 7V2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M15 7V2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M6 13V8h12v5a4 4 0 0 1-4 4h-4a4 4 0 0 1-4-4Z"
}));
const IconHeadphones = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H4a1 1 0 0 1-1-1v-6a9 9 0 0 1 18 0v6a1 1 0 0 1-1 1h-2a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"
}));
const IconUser = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "7",
  r: "4"
}));
const IconLock = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("rect", {
  width: "18",
  height: "11",
  x: "3",
  y: "11",
  rx: "2"
}), /*#__PURE__*/React.createElement("path", {
  d: "M7 11V7a5 5 0 0 1 10 0v4"
}));
const IconSettings = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "3"
}));
const IconBell = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M10.3 21a1.94 1.94 0 0 0 3.4 0"
}));
const IconDollar = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("line", {
  x1: "12",
  x2: "12",
  y1: "2",
  y2: "22"
}), /*#__PURE__*/React.createElement("path", {
  d: "M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"
}));
const IconClock = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "12 6 12 12 16 14"
}));
const IconPencil = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M12 20h9"
}), /*#__PURE__*/React.createElement("path", {
  d: "M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4z"
}));
const IconZap = p => /*#__PURE__*/React.createElement("svg", _extends({
  width: p.size || 16,
  height: p.size || 16,
  viewBox: "0 0 24 24",
  fill: "currentColor"
}, p), /*#__PURE__*/React.createElement("path", {
  d: "M13 2 3 14h7l-1 8 10-12h-7z"
}));
const IconTarget = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "6"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "2"
}));
const IconChevronLeft = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "15 18 9 12 15 6"
}));
const IconChevronRight = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "9 18 15 12 9 6"
}));
const IconChevronsLeft = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "11 17 6 12 11 7"
}), /*#__PURE__*/React.createElement("polyline", {
  points: "18 17 13 12 18 7"
}));
const IconChevronDown = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "6 9 12 15 18 9"
}));
const IconCheck = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("polyline", {
  points: "20 6 9 17 4 12"
}));
const IconSun = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "4"
}), /*#__PURE__*/React.createElement("path", {
  d: "M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"
}));
const IconMoon = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
}));
const IconPlus = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M5 12h14M12 5v14"
}));
const IconMore = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "1"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "19",
  cy: "12",
  r: "1"
}), /*#__PURE__*/React.createElement("circle", {
  cx: "5",
  cy: "12",
  r: "1"
}));
const IconX = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("path", {
  d: "M18 6 6 18M6 6l12 12"
}));
const IconInfo = p => /*#__PURE__*/React.createElement(Icon, p, /*#__PURE__*/React.createElement("circle", {
  cx: "12",
  cy: "12",
  r: "10"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  x2: "12",
  y1: "16",
  y2: "12"
}), /*#__PURE__*/React.createElement("line", {
  x1: "12",
  x2: "12.01",
  y1: "8",
  y2: "8"
}));
Object.assign(window, {
  Icon,
  IconHome,
  IconGrid,
  IconBars,
  IconFile,
  IconPercent,
  IconListChecks,
  IconMegaphone,
  IconFlask,
  IconGlobe,
  IconUsers,
  IconPlug,
  IconHeadphones,
  IconUser,
  IconLock,
  IconSettings,
  IconBell,
  IconDollar,
  IconClock,
  IconPencil,
  IconZap,
  IconTarget,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronDown,
  IconCheck,
  IconSun,
  IconMoon,
  IconPlus,
  IconMore,
  IconX,
  IconInfo
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Icons.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Placeholders.jsx
try { (() => {
// Placeholders.jsx — explicit "no reference" pages for nav items we don't have ground truth for
const PlaceholderPage = ({
  title,
  desc
}) => /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
  className: "page-header"
}, /*#__PURE__*/React.createElement("div", {
  className: "titles"
}, /*#__PURE__*/React.createElement("h1", null, title), /*#__PURE__*/React.createElement("p", null, desc))), /*#__PURE__*/React.createElement("div", {
  className: "placeholder"
}, /*#__PURE__*/React.createElement("span", {
  className: "badge"
}, "Sem refer\xEAncia visual"), /*#__PURE__*/React.createElement("h1", null, "Tela n\xE3o capturada"), /*#__PURE__*/React.createElement("p", null, "A reconstru\xE7\xE3o do Mestry Design System foi feita a partir de uma \xFAnica captura de tela (a p\xE1gina ", /*#__PURE__*/React.createElement("i", null, "Minha conta \u203A Moeda e Fuso hor\xE1rio"), "). Esta tela existe na navega\xE7\xE3o, mas n\xE3o temos refer\xEAncia visual para reconstru\xED-la com fidelidade."), /*#__PURE__*/React.createElement("p", null, "Para preencher esta tela, envie uma captura de tela ou exporte os componentes do c\xF3digo-fonte.")));
Object.assign(window, {
  PlaceholderPage
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Placeholders.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/Sidebar.jsx
try { (() => {
// Sidebar.jsx
const NAV = [{
  id: "home",
  label: "Home",
  icon: IconHome,
  isPage: false
}];
const SPACE_NAV = [{
  id: "dashboard",
  label: "Dashboard",
  icon: IconBars
}, {
  id: "reports",
  label: "Reports",
  icon: IconFile
}, {
  id: "custos",
  label: "Custos",
  icon: IconPercent
}, {
  id: "regras",
  label: "Regras de campanhas",
  icon: IconListChecks
}, {
  id: "campanhas",
  label: "Campanhas",
  icon: IconMegaphone
}, {
  id: "funnel",
  label: "Funnel builder",
  icon: IconFlask
}, {
  id: "dominios",
  label: "Domínios",
  icon: IconGlobe
}, {
  id: "usuarios",
  label: "Usuários",
  icon: IconUsers
}, {
  id: "integracoes",
  label: "Integrações",
  icon: IconPlug
}];
const TrialCard = ({
  onDismiss,
  onUpgrade
}) => /*#__PURE__*/React.createElement("div", {
  className: "trial-card"
}, /*#__PURE__*/React.createElement("div", {
  className: "head"
}, /*#__PURE__*/React.createElement("span", {
  className: "name"
}, "Plano Pro"), /*#__PURE__*/React.createElement("span", {
  className: "badge"
}, "TRIAL"), /*#__PURE__*/React.createElement("span", {
  className: "close",
  onClick: onDismiss
}, /*#__PURE__*/React.createElement(IconX, {
  size: 12
}))), /*#__PURE__*/React.createElement("div", {
  className: "copy"
}, "Seu teste expira em ", /*#__PURE__*/React.createElement("b", null, "5 dias"), "."), /*#__PURE__*/React.createElement(OutlineButton, {
  icon: IconZap,
  pill: true,
  full: true,
  onClick: onUpgrade
}, "Fazer Upgrade"));
const Sidebar = ({
  active,
  onNav,
  onUpgrade
}) => {
  const [expanded, setExpanded] = React.useState({
    "Nome do espaço 1": true
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav"
  }, NAV.map(n => /*#__PURE__*/React.createElement("div", {
    key: n.id,
    className: `item ${active === n.id ? "active" : ""}`,
    onClick: () => onNav(n.id)
  }, /*#__PURE__*/React.createElement(n.icon, {
    size: 18
  }), " ", n.label))), [1, 2, 3].map(i => {
    const name = `Nome do espaço ${i}`;
    const isOpen = !!expanded[name];
    return /*#__PURE__*/React.createElement(React.Fragment, {
      key: i
    }, /*#__PURE__*/React.createElement("div", {
      className: "group",
      style: i === 1 ? null : {
        paddingTop: 22
      }
    }, i === 1 ? null : /*#__PURE__*/React.createElement(IconChevronDown, {
      size: 14,
      onClick: () => setExpanded({
        ...expanded,
        [name]: !isOpen
      }),
      style: {
        cursor: 'pointer'
      }
    }), name, i === 1 ? /*#__PURE__*/React.createElement("span", {
      className: "plus",
      title: "Novo espa\xE7o"
    }, /*#__PURE__*/React.createElement(IconPlus, {
      size: 12
    })) : /*#__PURE__*/React.createElement("span", {
      className: "more",
      title: "Mais"
    }, /*#__PURE__*/React.createElement(IconMore, {
      size: 16
    }))), i === 1 && /*#__PURE__*/React.createElement("div", {
      className: "nav"
    }, SPACE_NAV.map(n => /*#__PURE__*/React.createElement("div", {
      key: n.id,
      className: `item ${active === n.id ? "active" : ""}`,
      onClick: () => onNav(n.id)
    }, /*#__PURE__*/React.createElement(n.icon, {
      size: 18
    }), " ", n.label))));
  }), /*#__PURE__*/React.createElement("div", {
    className: "divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: `item ${active === "suporte" ? "active" : ""}`,
    onClick: () => onNav("suporte")
  }, /*#__PURE__*/React.createElement(IconHeadphones, {
    size: 18
  }), " Suporte"), /*#__PURE__*/React.createElement("div", {
    className: "bottom",
    style: {
      marginTop: "auto",
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement(TrialCard, {
    onUpgrade: onUpgrade
  })));
};
Object.assign(window, {
  Sidebar,
  TrialCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/Sidebar.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/SubNav.jsx
try { (() => {
// SubNav.jsx — used inside settings-style pages
const SubNav = ({
  items,
  active,
  onSelect
}) => /*#__PURE__*/React.createElement("div", {
  className: "subnav"
}, items.map(it => /*#__PURE__*/React.createElement("div", {
  key: it.id,
  className: `subnav-item item ${active === it.id ? "active" : ""}`,
  onClick: () => onSelect(it.id)
}, /*#__PURE__*/React.createElement("div", {
  className: "ico"
}, /*#__PURE__*/React.createElement(it.icon, {
  size: 18
})), /*#__PURE__*/React.createElement("div", {
  className: "meta"
}, /*#__PURE__*/React.createElement("div", {
  className: "t"
}, it.title), /*#__PURE__*/React.createElement("div", {
  className: "d"
}, it.desc)))));
Object.assign(window, {
  SubNav
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/SubNav.jsx", error: String((e && e.message) || e) }); }

// ui_kits/web-app/TopBar.jsx
try { (() => {
// TopBar.jsx
const ThemeToggle = ({
  value,
  onChange
}) => /*#__PURE__*/React.createElement("div", {
  className: "theme-toggle",
  onClick: () => onChange(value === "dark" ? "light" : "dark")
}, /*#__PURE__*/React.createElement("div", {
  className: `slot ${value === "dark" ? "on" : ""}`
}, /*#__PURE__*/React.createElement(IconMoon, {
  size: 14
})), /*#__PURE__*/React.createElement("div", {
  className: `slot ${value === "light" ? "on" : ""}`
}, /*#__PURE__*/React.createElement(IconSun, {
  size: 14
})));
const TopBar = ({
  breadcrumb,
  theme,
  onTheme
}) => /*#__PURE__*/React.createElement("div", {
  className: "topbar"
}, /*#__PURE__*/React.createElement("div", {
  className: "brand"
}, /*#__PURE__*/React.createElement("img", {
  src: "../../assets/logo_full_transparent.png",
  alt: "mestry"
})), /*#__PURE__*/React.createElement("div", {
  className: "center"
}, /*#__PURE__*/React.createElement("div", {
  className: "breadcrumb"
}, /*#__PURE__*/React.createElement("div", {
  className: "home"
}, /*#__PURE__*/React.createElement(IconHome, {
  size: 14
})), /*#__PURE__*/React.createElement(IconChevronRight, {
  size: 14
}), /*#__PURE__*/React.createElement("span", {
  className: "crumb"
}, breadcrumb)), /*#__PURE__*/React.createElement("div", {
  className: "goal"
}, /*#__PURE__*/React.createElement("div", {
  className: "lbl"
}, /*#__PURE__*/React.createElement(IconTarget, {
  size: 14
}), "META DE FATURAMENTO"), /*#__PURE__*/React.createElement("div", {
  className: "bar"
}, /*#__PURE__*/React.createElement("i", null)), /*#__PURE__*/React.createElement("div", {
  className: "val"
}, "R$ 380K ", /*#__PURE__*/React.createElement("span", null, "/ R$ 500K"))), /*#__PURE__*/React.createElement("div", null)), /*#__PURE__*/React.createElement("div", {
  className: "right",
  style: {
    display: "flex",
    alignItems: "center",
    gap: 10
  }
}, /*#__PURE__*/React.createElement(ThemeToggle, {
  value: theme,
  onChange: onTheme
}), /*#__PURE__*/React.createElement(IconOnlyButton, {
  icon: IconBell,
  ariaLabel: "Notifica\xE7\xF5es"
}), /*#__PURE__*/React.createElement("div", {
  className: "avatar"
}, "A")));
Object.assign(window, {
  TopBar,
  ThemeToggle
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/web-app/TopBar.jsx", error: String((e && e.message) || e) }); }

})();
