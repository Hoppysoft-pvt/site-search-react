"use strict";

require("core-js/modules/es.weak-map.js");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = SearchBar;
require("core-js/modules/web.dom-collections.iterator.js");
var _react = _interopRequireWildcard(require("react"));
var React = _react;
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Dialog = _interopRequireDefault(require("@mui/material/Dialog"));
var _DialogActions = _interopRequireDefault(require("@mui/material/DialogActions"));
var _DialogContent = _interopRequireDefault(require("@mui/material/DialogContent"));
var _DialogTitle = _interopRequireDefault(require("@mui/material/DialogTitle"));
var _material = require("@mui/material");
var _axios = _interopRequireDefault(require("axios"));
var _ResultNotFound = _interopRequireDefault(require("./ResultNotFound"));
var _ServerError = _interopRequireDefault(require("./ServerError"));
var _ListItemTextWithHighlightedText = _interopRequireDefault(require("./ListItemTextWithHighlightedText"));
var _Search = _interopRequireDefault(require("@mui/icons-material/Search"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const throwMandatoryAttributeError = (name, value) => {
  if (!value) throw new Error("".concat(name, " is a mandatory attribute for HSSearchPage"));
};
function SearchBar(_ref) {
  let {
    indexId,
    apiKey,
    onTypeSearch,
    targetURL,
    iconURL,
    secondaryText,
    primaryText
  } = _ref;
  // throw error
  throwMandatoryAttributeError("indexId", indexId);
  throwMandatoryAttributeError("apiKey", apiKey);
  throwMandatoryAttributeError("targetURL", targetURL);
  throwMandatoryAttributeError("primaryText", primaryText);

  // UseState
  const [isOpen, setIsOpen] = (0, _react.useState)(false);
  const [searchText, setSearchText] = (0, _react.useState)('');
  const [searchResultDocuments, setSearchResultDocuments] = (0, _react.useState)([]);
  const [isSearchServerFailed, setIsSearchServerFailed] = (0, _react.useState)(false);
  const handleClickOpen = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };
  function debounce(callback, timeout) {
    var _this = this;
    let timer;
    return function () {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      clearTimeout(timer);
      timer = setTimeout(() => {
        callback.apply(_this, args);
      }, timeout);
    };
  }
  const handleSearchJsonData = searchText => {
    const simpleSearchEndpoint = searchText ? "https://".concat(indexId, ".hoppysearch.com/v1/search?q=").concat(searchText) : "https://".concat(indexId, ".hoppysearch.com/v1/search");
    _axios.default.get(simpleSearchEndpoint, {
      headers: {
        'Authorization': apiKey
      }
    }).then(response => {
      var _response$data;
      if (response !== null && response !== void 0 && (_response$data = response.data) !== null && _response$data !== void 0 && _response$data.documents) {
        var _response$data2;
        setSearchResultDocuments(response === null || response === void 0 || (_response$data2 = response.data) === null || _response$data2 === void 0 ? void 0 : _response$data2.documents);
      } else {
        setSearchResultDocuments([]);
      }
    }).catch(err => {
      console.log(err);
      setIsSearchServerFailed(true);
    });
  };

  // useCallback
  const handleSearchJsonDataOnType = (0, _react.useCallback)(debounce(searchText => handleSearchJsonData(searchText), 500), []);

  // useEffect
  (0, _react.useEffect)(() => {
    const handleKeyDown = event => {
      if (event.ctrlKey && event.key === 'k') {
        event.preventDefault();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  (0, _react.useEffect)(() => {
    handleSearchJsonData(searchText);
  }, []);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(_Button.default, {
    variant: "outlined",
    onClick: handleClickOpen,
    startIcon: /*#__PURE__*/React.createElement(_Search.default, null)
  }, "Search...", /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '3px',
      color: "#000000",
      marginLeft: "50px",
      border: '1px solid #757575',
      borderRadius: '5px'
    }
  }, /*#__PURE__*/React.createElement(_material.Typography, {
    variant: "body2"
  }, "ctrl+k"))), /*#__PURE__*/React.createElement(_Dialog.default, {
    open: isOpen,
    onClose: handleClose,
    PaperProps: {
      sx: {
        width: "100%",
        minWidth: "520px!important"
      }
    }
  }, /*#__PURE__*/React.createElement(_DialogTitle.default, {
    style: {
      cursor: 'move'
    },
    id: "draggable-dialog-title"
  }, /*#__PURE__*/React.createElement(_material.Grid, {
    container: true,
    spacing: 1,
    sx: {
      backgroundColor: "#ffffff",
      width: "93%"
    }
  }, /*#__PURE__*/React.createElement(_material.Grid, {
    item: true,
    xs: 12,
    md: 11
  }, onTypeSearch ? /*#__PURE__*/React.createElement(_material.TextField, {
    id: "outlined-full-width",
    label: "Search",
    placeholder: "Search",
    fullWidth: true,
    margin: "normal",
    value: searchText,
    onChange: e => setSearchText(e.target.value),
    InputLabelProps: {
      shrink: true
    },
    onKeyDown: event => {
      if (event.key === "Enter") {
        handleSearchJsonData(event.target.value);
      }
    },
    onKeyUp: event => handleSearchJsonDataOnType(event.target.value)
  }) : /*#__PURE__*/React.createElement(_material.TextField, {
    id: "outlined-full-width",
    label: "Search",
    placeholder: "Search",
    fullWidth: true,
    margin: "normal",
    value: searchText,
    onChange: e => setSearchText(e.target.value),
    InputLabelProps: {
      shrink: true
    },
    onKeyDown: event => {
      if (event.key === "Enter") {
        handleSearchJsonData(event.target.value);
      }
    }
  })), /*#__PURE__*/React.createElement(_material.Grid, {
    item: true,
    xs: 12,
    md: 1
  }, /*#__PURE__*/React.createElement(_Button.default, {
    variant: "outlined",
    style: {
      color: '#673ab7',
      height: 55,
      width: 80,
      borderColor: '#673ab7',
      marginTop: 17
    },
    onClick: () => handleSearchJsonData(searchText)
  }, /*#__PURE__*/React.createElement(_Search.default, null))))), /*#__PURE__*/React.createElement(_DialogContent.default, null, /*#__PURE__*/React.createElement(_material.Grid, {
    item: true,
    xs: 12
  }, isSearchServerFailed ? /*#__PURE__*/React.createElement(_ServerError.default, null) : /*#__PURE__*/React.createElement(_material.List, {
    sx: {
      width: '100%'
    }
  }, searchResultDocuments.length === 0 && /*#__PURE__*/React.createElement(_ResultNotFound.default, {
    searchText: searchText
  }), searchResultDocuments.map((document, index) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: index
  }, /*#__PURE__*/React.createElement(_material.ListItemButton, {
    component: _material.Link,
    href: document === null || document === void 0 ? void 0 : document[targetURL],
    sx: {
      '&:hover': {
        border: '2px solid #2196f3',
        borderRadius: '4px',
        boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)',
        backgroundColor: '#e3f2fd',
        cursor: 'pointer'
      }
    }
  }, iconURL && /*#__PURE__*/React.createElement(_material.ListItemAvatar, null, /*#__PURE__*/React.createElement(_material.Avatar, {
    alt: document === null || document === void 0 ? void 0 : document[primaryText],
    src: document === null || document === void 0 ? void 0 : document[iconURL]
  })), /*#__PURE__*/React.createElement(_ListItemTextWithHighlightedText.default, {
    primary: document === null || document === void 0 ? void 0 : document[primaryText],
    secondary: secondaryText ? document === null || document === void 0 ? void 0 : document[secondaryText] : "",
    highlightedWords: searchText.toLowerCase().split(" ")
  })), /*#__PURE__*/React.createElement(_material.Divider, null)))))), /*#__PURE__*/React.createElement(_DialogActions.default, null, /*#__PURE__*/React.createElement(_Button.default, {
    autoFocus: true,
    onClick: handleClose
  }, "Close"))));
}